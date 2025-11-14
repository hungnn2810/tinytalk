"""
Blend AI - Prototype repository (single-file) for training a blending assessment model (Jolly Phonics)

This single-file bundle is a runnable prototype containing:
 - preprocessing utilities (convert to 16k WAV, normalize)
 - naive phoneme-interval estimator (fallback if you don't have MFA)
 - feature extraction (per-interval MFCC, RMS, pitch via librosa)
 - rule-based blend score calculator
 - simple ML training pipeline (RandomForest classifier) with joblib model save/load
 - minimal FastAPI server to serve inference (/blend-score)

LIMITATIONS & NEXT STEPS
 - This prototype uses a NAIVE interval splitter when no forced-aligner is provided. Replace `estimate_intervals_naive`
   with Montreal Forced Aligner (MFA) or Gentle for accurate phoneme boundaries before production.
 - For production, collect labelled dataset and switch to a proper phoneme alignment pipeline.

FILES (this document contains all code; copy to files locally as instructed below):
 - preprocess.py (functions)
 - features.py
 - train.py
 - app.py

USAGE
 1. Create conda env / virtualenv and install:
    pip install numpy scipy librosa soundfile scikit-learn joblib fastapi uvicorn python-multipart

 2. Prepare dataset folder structure:
    dataset/
      audio/      # wav files 16k mono
      labels.csv  # columns: filename,word,label (label as int 0..3 or text)

 3. Train model:
    python blend_ai_model_repo.py --mode train --dataset ./dataset --labels ./dataset/labels.csv --model_out ./model.joblib


 4. Run server:
    python blend_ai_model_repo.py --mode serve --model_in ./model.joblib

| filename      | word | label | Ý nghĩa                          |
| ------------- | ---- | ----- | -------------------------------- |
| `cat_001.wav` | cat  | 3     | Bé đọc rất tốt → điểm cao        |
| `cat_002.wav` | cat  | 2     | Tạm ổn                           |
| `dog_001.wav` | dog  | 1     | Yếu                              |
| `dog_002.wav` | dog  | 0     | Sai hoàn toàn (không blend được) |
| …             | …    | …     | …                                |


"""

import os
import argparse
import csv
import uuid
import warnings
from typing import List, Dict, Tuple

import numpy as np
import soundfile as sf
import librosa
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

# Optional: FastAPI server for inference
try:
    from fastapi import FastAPI, UploadFile, File, Form
    import uvicorn
    FASTAPI_AVAILABLE = True
except Exception:
    FASTAPI_AVAILABLE = False


# ----------------------
# Preprocessing utils
# ----------------------

def ensure_wav_16k_mono(in_path: str, out_path: str, sr: int = 16000) -> None:
    """Load audio, resample to sr, normalize peak, write 16-bit PCM WAV mono."""
    y, _ = librosa.load(in_path, sr=sr, mono=True)
    if np.max(np.abs(y)) > 0:
        y = y / np.max(np.abs(y))
    sf.write(out_path, y, sr, subtype='PCM_16')


# ----------------------
# Naive phoneme interval estimator (fallback)
# ----------------------

def estimate_intervals_naive(audio_path: str, target_phonemes: List[str]) -> List[Dict]:
    """
    Fallback method: split the audio duration equally across target phonemes.
    Replace with MFA/Gentle for production.
    Returns list of dicts: [{"phoneme": p, "start": 0.0, "end": 0.12}, ...]
    """
    with sf.SoundFile(audio_path) as f:
        total_duration = len(f) / f.samplerate
    n = max(1, len(target_phonemes))
    seg = total_duration / n
    intervals = []
    for i, p in enumerate(target_phonemes):
        start = i * seg
        end = min(total_duration, (i + 1) * seg)
        intervals.append({"phoneme": p, "start": start, "end": end})
    return intervals


# ----------------------
# Feature extraction
# ----------------------

def features_for_interval(y: np.ndarray, sr: int, start: float, end: float) -> Dict:
    s = int(max(0, start * sr))
    e = int(min(len(y), end * sr))
    seg = y[s:e]

    if len(seg) < 20:
        seg = np.pad(seg, (0, max(0, 20 - len(seg))))

    # --- MFCC FIXED ---
    mfcc_feat = librosa.feature.mfcc(y=seg, sr=sr, n_mfcc=13)
    mfcc_mean = mfcc_feat.mean(axis=1)

    # RMS energy
    rms = librosa.feature.rms(y=seg)
    rms_mean = float(np.mean(rms)) if rms.size else 0.0

    # Pitch
    try:
        pitch = librosa.yin(seg, fmin=80.0, fmax=400.0, sr=sr)
        pitch_mean = float(np.nanmean(pitch)) if pitch.size else 0.0
        pitch_var = float(np.nanstd(pitch)) if pitch.size else 0.0
    except Exception:
        pitch_mean = 0.0
        pitch_var = 0.0

    duration = (end - start)

    return {
        'duration': duration,
        'rms_mean': rms_mean,
        'pitch_mean': pitch_mean,
        'pitch_var': pitch_var,
        **{f'mfcc_{i+1}_mean': float(m) for i, m in enumerate(mfcc_mean)}
    }


def extract_features_from_intervals(audio_path: str, intervals: List[Dict], sr: int = 16000) -> Dict:
    y, _ = librosa.load(audio_path, sr=sr, mono=True)
    per_phoneme = [features_for_interval(y, sr, it['start'], it['end']) for it in intervals]
    # aggregate features
    durations = np.array([p['duration'] for p in per_phoneme])
    avg_gap = 0.0
    if len(intervals) > 1:
        gaps = [intervals[i+1]['start'] - intervals[i]['end'] for i in range(len(intervals)-1)]
        avg_gap = float(np.mean(gaps))
    # phoneme_duration_mean
    dur_mean = float(np.mean(durations)) if durations.size else 0.0
    # energy continuity: measure rms drop across phonemes
    rms_vals = np.array([p['rms_mean'] for p in per_phoneme]) if per_phoneme else np.array([0.0])
    energy_drop = 0.0
    if len(rms_vals) > 1 and np.max(rms_vals) > 0:
        energy_drop = float(np.mean(np.maximum(0.0, (np.max(rms_vals)-rms_vals)/np.max(rms_vals))))
    # compile aggregate features
    feat = {
        'avg_gap': avg_gap,
        'dur_mean': dur_mean,
        'energy_drop': energy_drop,
        'n_phonemes': len(intervals)
    }
    # include averaged MFCC/pitch features
    mfcc_keys = [k for k in per_phoneme[0].keys() if k.startswith('mfcc_')] if per_phoneme else []
    for k in mfcc_keys:
        vals = np.array([p[k] for p in per_phoneme])
        feat[f'{k}_mean'] = float(vals.mean())
        feat[f'{k}_std'] = float(vals.std())
    # pitch
    pitch_vals = np.array([p['pitch_mean'] for p in per_phoneme]) if per_phoneme else np.array([0.0])
    feat['pitch_mean_mean'] = float(pitch_vals.mean())
    feat['pitch_mean_std'] = float(pitch_vals.std())
    return feat


# ----------------------
# Rule-based scoring (baseline)
# ----------------------

def rule_based_score(phoneme_accuracy: float, avg_gap: float, energy_drop: float) -> float:
    """
    phoneme_accuracy: 0..1
    avg_gap: seconds
    energy_drop: 0..1
    Returns score 0..100
    """
    # calibrate gap threshold (empirical)
    gap_threshold = 0.12
    smoothness = max(0.0, 1.0 - (avg_gap / gap_threshold))
    score = 0.6 * phoneme_accuracy + 0.3 * smoothness + 0.1 * (1.0 - energy_drop)
    score = max(0.0, min(1.0, score))
    return float(score * 100.0)


# ----------------------
# Training pipeline (simple)
# ----------------------

def load_labels(labels_csv: str) -> List[Dict]:
    rows = []
    with open(labels_csv, 'r', encoding='utf-8') as fh:
        r = csv.DictReader(fh)
        for line in r:
            rows.append(line)
    return rows


def build_feature_table(dataset_dir: str, labels_csv: str, output_csv: str = None, use_naive_intervals: bool = True):
    labels = load_labels(labels_csv)
    rows = []
    for item in labels:
        filename = item['filename']
        word = item.get('word', '')
        label = item.get('label', '')
        audio_path = os.path.join(dataset_dir, 'audio', filename)
        if not os.path.exists(audio_path):
            warnings.warn(f"Missing audio: {audio_path}")
            continue
        # target phonemes: naive split by characters (user should provide real phoneme mapping)
        target_phonemes = list(word) if word else ['_']
        if use_naive_intervals:
            intervals = estimate_intervals_naive(audio_path, target_phonemes)
        else:
            raise RuntimeError("Forced aligner not configured in this prototype. Use MFA/Gentle and parse TextGrid.")
        feat = extract_features_from_intervals(audio_path, intervals)
        feat['filename'] = filename
        feat['label'] = label
        rows.append(feat)
    # write CSV
    import pandas as pd
    df = pd.DataFrame(rows)
    if output_csv:
        df.to_csv(output_csv, index=False)
    return df


def train_model_from_features(df, model_out: str):
    # drop non-numeric
    X = df.select_dtypes(include=[np.number]).drop(columns=['label'], errors='ignore')
    y_raw = df['label'].values
    # convert label to numeric if text
    from sklearn.preprocessing import LabelEncoder
    le = LabelEncoder()
    y = le.fit_transform(y_raw)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    clf = RandomForestClassifier(n_estimators=200, random_state=42)
    clf.fit(X_train, y_train)
    preds = clf.predict(X_test)
    print(classification_report(y_test, preds, target_names=le.classes_))
    # persist model and label encoder
    joblib.dump({'model': clf, 'label_encoder': le, 'feature_columns': list(X.columns)}, model_out)
    print(f"Model saved to {model_out}")


# ----------------------
# Inference wrapper
# ----------------------

def analyze_blend_single(audio_path: str, target_word: str, model_bundle_path: str = None) -> Dict:
    # create intervals (replace with aligner in prod)
    target_phonemes = list(target_word) if target_word else ['_']
    intervals = estimate_intervals_naive(audio_path, target_phonemes)
    feat = extract_features_from_intervals(audio_path, intervals)
    # naive phoneme accuracy placeholder: if word length equals n_phonemes -> 1.0 else 0.8
    phoneme_accuracy = 1.0 if True else 0.8
    avg_gap = feat.get('avg_gap', 0.0)
    energy_drop = feat.get('energy_drop', 0.0)
    rule_score = rule_based_score(phoneme_accuracy, avg_gap, energy_drop)
    result = {
        'score_rule': rule_score,
        'features': feat,
        'intervals': intervals
    }
    # if model provided, run ML model
    if model_bundle_path and os.path.exists(model_bundle_path):
        bundle = joblib.load(model_bundle_path)
        model = bundle['model']
        cols = bundle['feature_columns']
        import pandas as pd
        row = {k: feat.get(k, 0.0) for k in cols}
        X = pd.DataFrame([row])[cols].fillna(0.0)
        pred = model.predict(X)[0]
        le = bundle['label_encoder']
        label = le.inverse_transform([pred])[0]
        result['ml_label'] = str(label)
    return result


# ----------------------
# CLI Entrypoint
# ----------------------

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['build_features', 'train', 'serve'], required=True)
    parser.add_argument('--dataset', type=str, help='dataset folder containing audio/')
    parser.add_argument('--labels', type=str, help='labels.csv path')
    parser.add_argument('--features_out', type=str, default='features.csv')
    parser.add_argument('--model_out', type=str, default='model.joblib')
    parser.add_argument('--model_in', type=str, help='model file for serving')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()

    if args.mode == 'build_features':
        if not args.dataset or not args.labels:
            parser.error('build_features requires --dataset and --labels')
        df = build_feature_table(args.dataset, args.labels, output_csv=args.features_out)
        print('features built to', args.features_out, 'rows=', len(df))
    elif args.mode == 'train':
        if not args.dataset or not args.labels:
            parser.error('train requires --dataset and --labels')
        df = build_feature_table(args.dataset, args.labels, output_csv=args.features_out)
        train_model_from_features(df, args.model_out)
    elif args.mode == 'serve':
        if not FASTAPI_AVAILABLE:
            raise RuntimeError('FastAPI not available; install fastapi and uvicorn to serve')
        model_in = args.model_in
        app = FastAPI()

        @app.post('/blend-score')
        async def blend_score(file: UploadFile = File(...), word: str = Form(...)):
            tmp = f"/tmp/{uuid.uuid4()}.wav"
            with open(tmp, 'wb') as fh:
                fh.write(await file.read())
            res = analyze_blend_single(tmp, word, model_bundle_path=model_in)
            os.remove(tmp)
            return res

        uvicorn.run(app, host='0.0.0.0', port=args.port)


if __name__ == '__main__':
    main()
