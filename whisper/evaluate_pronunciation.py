import whisper
import requests
import json
import os

# -----------------------------
AUDIO_FILE = "cat_wrong.m4a"
EXPECTED_TEXT = "C A T CAT"
MODEL_NAME = "base"
GENTLE_SERVER = "http://127.0.0.1:32768/transcriptions?async=false"
# -----------------------------

# Convert audio nếu cần (tương tự script trước)
def convert_to_wav(input_path):
    import subprocess
    base, ext = os.path.splitext(input_path)
    wav_path = base + "_converted.wav"
    if ext.lower() == ".wav":
        return input_path
    subprocess.run(["ffmpeg", "-y", "-i", input_path, "-ar", "16000", "-ac", "1", wav_path], check=True)
    return wav_path

# Whisper transcription
def transcribe_whisper(audio_path, model_name):
    model = whisper.load_model(model_name)
    result = model.transcribe(audio_path, language="en")
    return result["text"].upper().replace("-", " ")

# Gentle alignment
def align_with_gentle(audio_path, transcript):
    files = {
        'audio': open(audio_path, 'rb'),
        'transcript': (None, transcript)
    }
    response = requests.post(GENTLE_SERVER, files=files)
    return response.json()

# Tính điểm blend / pronunciation sơ cấp
def calculate_pronunciation_score(gentle_json):
    phonemes = gentle_json['words']
    total = len(phonemes)
    correct = sum(1 for w in phonemes if w.get('alignedWord') != "<unk>")
    score = round(correct / total * 100, 2) if total > 0 else 0
    return score

if __name__ == "__main__":
    wav_file = convert_to_wav(AUDIO_FILE)
    
    print("Transcribing with Whisper...")
    recognized_text = transcribe_whisper(wav_file, MODEL_NAME)
    print("Whisper recognized:", recognized_text)

    print("Aligning with Gentle for pronunciation...")
    gentle_result = align_with_gentle(wav_file, EXPECTED_TEXT)
    
    score = calculate_pronunciation_score(gentle_result)
    
    print(f"\nExpected: {EXPECTED_TEXT}")
    print(f"Blend/Pronunciation Score: {score}%")
