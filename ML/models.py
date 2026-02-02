from pydantic import BaseModel

class SymptomRequest(BaseModel):
    user_id: int
    symptoms: str
