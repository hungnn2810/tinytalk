from fastapi import FastAPI, UploadFile
import whisper
import difflib

app = FastAPI()
model = whisper.load_model("base.en")

@app.post("/evaluate")
async def evaluate(file: UploadFile):
    audio_path = file.filename
    with open(audio_path, "wb") as f:
        f.write(await file.read())

    result = model.transcribe(audio_path, language="en")
    recognized = result["text"].upper().replace("-", " ")

    expected = "C A T CAT"
    ratio = difflib.SequenceMatcher(None, expected, recognized).ratio()
    score = round(ratio * 100, 2)

    return {"recognized": recognized, "score": score}

#uvicorn app:app --reload