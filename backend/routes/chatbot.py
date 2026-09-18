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
        response = client.responses.create(
            model="gpt-5.6-luna",
            instructions="""
You are an AI Career Assistant for an AI Career Guidance Platform.

Help students and beginners with:

- Career selection
- Career roadmaps
- Programming skills
- Technology skills
- Learning plans
- Project ideas
- Interview preparation
- Certifications
- Career-related questions

Give practical and beginner-friendly answers.

When recommending a career:
1. Explain why it may be suitable.
2. Mention important skills.
3. Suggest a learning path when useful.

Keep answers clear, structured, and reasonably concise.
""",
            input=f"""
The user's recommended career is: {data.career or "Not specified"}

User's question:
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