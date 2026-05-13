from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ai_helper import generate_questions, evaluate_answer
from database import get_db, Interview

router = APIRouter()

class RoleRequest(BaseModel):
    role: str

class AnswerRequest(BaseModel):
    role: str
    question: str
    answer: str

@router.post("/generate-questions")
def get_questions(request: RoleRequest):
    questions = generate_questions(request.role)
    return {"questions": questions}

@router.post("/evaluate-answer")
def evaluate(request: AnswerRequest, db: Session = Depends(get_db)):
    result = evaluate_answer(
        request.role,
        request.question,
        request.answer
    )

    # Save to database
    interview = Interview(
        role=request.role,
        question=request.question,
        answer=request.answer,
        score=result["score"],
        feedback=result["feedback"],
        ideal=result["ideal"]
    )
    db.add(interview)
    db.commit()

    return result

@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    interviews = db.query(Interview).order_by(
        Interview.date.desc()
    ).limit(20).all()
    
    return {"history": [
        {
            "id": i.id,
            "role": i.role,
            "question": i.question,
            "score": i.score,
            "feedback": i.feedback,
            "date": str(i.date)
        }
        for i in interviews
    ]}