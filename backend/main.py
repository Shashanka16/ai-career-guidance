from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# ---------------- ROOT ROUTE ----------------
@app.get("/")
def home():
    return {"message": "AI Career Guidance Backend Running"}

# ---------------- CAREER DATASET ----------------
careers = {
    "Data Scientist": {
        "skills": ["python", "statistics", "machine learning", "sql", "pandas"],
        "interests": ["data", "ai", "analytics", "insights"]
    },
    "Machine Learning Engineer": {
        "skills": ["python", "machine learning", "deep learning", "tensorflow", "pytorch"],
        "interests": ["ai", "models", "automation", "research"]
    },
    "Web Developer": {
        "skills": ["html", "css", "javascript", "react", "django"],
        "interests": ["web", "design", "frontend", "backend"]
    },
    "Cyber Security Analyst": {
        "skills": ["networking", "linux", "security", "python", "cryptography"],
        "interests": ["security", "hacking", "systems", "protection"]
    },
    "App Developer": {
        "skills": ["flutter", "dart", "kotlin", "java", "react native"],
        "interests": ["mobile", "apps", "ui", "ux"]
    }
}

# ---------------- INPUT MODEL ----------------
class UserInput(BaseModel):
    skills: list
    interests: list

# ---------------- AI LOGIC ----------------
def recommend_career(user_skills, user_interests):
    best_match = None
    max_score = 0

    for career, data in careers.items():
        score = 0

        # match skills (high weight)
        for skill in user_skills:
            if skill.lower() in data["skills"]:
                score += 2

        # match interests (low weight)
        for interest in user_interests:
            if interest.lower() in data["interests"]:
                score += 1

        if score > max_score:
            max_score = score
            best_match = career

    return best_match, max_score

# ---------------- API ENDPOINT ----------------
@app.post("/recommend")
def recommend(user: UserInput):
    career, score = recommend_career(user.skills, user.interests)

    return {
        "recommended_career": career,
        "confidence_score": score
    }