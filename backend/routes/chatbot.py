import os

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

load_dotenv()

router = APIRouter()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


class ChatMessage(BaseModel):
    message: str
    career: str | None = None


@router.post("/chat")
def chat(data: ChatMessage):

    try:

        career = data.career.strip() if data.career else ""

        if career:
            career_context = career
        else:
            career_context = "No recommended career is currently available."

        response = client.responses.create(
            model="gpt-5.6-luna",

            instructions="""
You are an AI Career Assistant for an AI Career Guidance Platform.

You help students and beginners with:

- Career selection
- Career roadmaps
- Programming skills
- Technology skills
- Learning plans
- Project ideas
- Interview preparation
- Certifications
- Career-related questions

IMPORTANT CAREER CONTEXT RULES:

The user's recommended career is provided separately as background context.

The user's CURRENT QUESTION has the highest priority.

RULE 1:
If the user explicitly mentions a career, job role, or professional role
in their question, answer specifically about that career.

For example:

Recommended career:
Data Scientist

User question:
"What should I learn to become a Machine Learning Engineer?"

You MUST answer about becoming a Machine Learning Engineer.

Do NOT make Data Scientist the focus of the answer.

RULE 2:
If the user does NOT explicitly mention another career,
use the recommended career as the primary career context.

For example:

Recommended career:
Data Scientist

User question:
"What should I learn next?"

Answer specifically for a Data Scientist.

RULE 3:
If the user asks to compare careers, discuss all careers mentioned
in the question fairly and clearly.

RULE 4:
Do not say that a career is unspecified if a recommended career
is available.

RULE 5:
Do not unnecessarily mention the recommended career when the user
has explicitly asked about a different career.

Give practical and beginner-friendly answers.

When discussing a career, cover relevant areas such as:

- Important skills
- Programming languages
- Technologies
- Learning roadmap
- Projects
- Interview preparation
- Certifications
- Career progression

Keep answers clear, structured, and reasonably concise.
""",

            input=f"""
RECOMMENDED CAREER (BACKGROUND CONTEXT):
{career_context}

USER QUESTION:
{data.message}
"""
        )

        return {
            "response": response.output_text
        }

    except Exception as error:

        print("OpenAI error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to generate AI response"
        )