from database import SessionLocal
from models.users import User
from models.recommendation import Recommendation
from fastapi import APIRouter
from pydantic import BaseModel

from services.career_service import recommend_career

router = APIRouter()


class UserInput(BaseModel):
    skills: list[str]
    interests: list[str]


# ---------------- RECOMMEND ----------------

@router.post("/recommend")
def recommend(user: UserInput):

    career, score, careers = recommend_career(
        user.skills,
        user.interests
    )

    db = SessionLocal()

    # Temporary: save recommendation for the first user
    first_user = db.query(User).first()

    if first_user and career:

        recommendation = Recommendation(
            user_id=first_user.id,
            career=career,
            confidence=score
        )

        db.add(recommendation)
        db.commit()

    db.close()

    return {
        "recommended_career": career,
        "confidence_score": score,
        "roadmap": careers[career]["roadmap"] if career else [],
        "resources": careers[career]["resources"] if career else [],
        "related_careers": careers[career]["related_careers"] if career else []
    }
# ---------------- CAREER DETAILS ----------------

@router.get("/career/{career_name}")
def get_career_details(career_name: str):

    from services.career_service import get_careers

    careers = get_careers()

    # Find the career
    if career_name not in careers:
        return {
            "error": "Career not found"
        }

    career = careers[career_name]

    return {
        "career": career_name,
        "skills": career["skills"],
        "interests": career["interests"],
        "roadmap": career["roadmap"],
        "resources": career["resources"],
        "related_careers": career["related_careers"]
    }


# ---------------- HISTORY ----------------

@router.get("/history/{user_id}")
def history(user_id: int):

    db = SessionLocal()

    recommendations = db.query(Recommendation).filter(
        Recommendation.user_id == user_id
    ).all()

    result = []

    for recommendation in recommendations:

        result.append({
            "career": recommendation.career,
            "confidence": recommendation.confidence
        })

    db.close()

    return result