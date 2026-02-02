from transformers import pipeline
from fastapi import FastAPI
from models import SymptomRequest

app = FastAPI()

DEPARTMENTS = [
    "cardiology",
    "orthopedics",
    "oncology",
    "neurology",
    "gastroenterology",
    "urology",
    "nephrology"
    
]
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)


def predict_department(symptoms_text: str):
    result = classifier(
        symptoms_text,
        candidate_labels=DEPARTMENTS
    )
    return result["labels"][0], result["scores"][0]

@app.post("/symptoms")
def submit_symptoms(request: SymptomRequest):
    try:
        department, confidence = predict_department(request.symptoms)
        # if confidence < 50:
        #     department = "general physician"
        return {
            "user_id": request.user_id,
            "predicted_department": department,
            "confidence": round(confidence, 4)
        }

    except Exception as e:
        return {
            "error": str(e)
        }

@app.get("/")
def check():
    return {
        "hello"
    }