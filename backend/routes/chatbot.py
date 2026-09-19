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

IMPORTANT CONTEXT RULE:

The user's recommended career will be provided separately.

If a recommended career is provided, you MUST use it as the primary career context when answering the user's question.

Do NOT say that the career is unspecified if a recommended career is provided.

For example, if the recommended career is "Machine Learning Engineer"
and the user asks "What should I learn next?", answer specifically
for a Machine Learning Engineer.

Only discuss other careers when the user explicitly asks about them.

Give practical and beginner-friendly answers.

When recommending a career:
1. Explain why it may be suitable.
2. Mention important skills.
3. Suggest a learning path when useful.

Keep answers clear, structured, and reasonably concise.
""",

            input=f"""
RECOMMENDED CAREER:
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