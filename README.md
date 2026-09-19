# 🤖 AI Career Guidance Platform

An AI-powered career guidance platform that analyzes a user's **skills and interests** to recommend suitable career paths and provide personalized learning guidance.

The platform combines a **FastAPI backend, Next.js frontend, career recommendation engine, database-backed recommendation history, and an AI-powered career assistant** into one full-stack application.

---

## 🚀 Features

### 🎯 AI Career Recommendation

* Takes user skills and interests as input.
* Compares them against multiple career profiles.
* Provides the most suitable career recommendation.
* Displays a career match percentage.
* Shows the top 3 matching career paths.

### 📊 Skill Analysis

* Shows skills that already match the selected career.
* Identifies missing skills that the user should improve.
* Displays matching interests.

### 🛣️ Personalized Career Roadmap

Each recommended career provides:

* Learning roadmap
* Required skills
* Learning resources
* Related career paths

### 💬 AI Career Assistant

An AI-powered chatbot that helps users with:

* Career questions
* Skills to learn
* Learning roadmaps
* Projects
* Certifications
* Interview preparation
* Career-specific guidance

The chatbot receives the user's recommended career as context so that its responses can be personalized.

### 📚 Recommendation History

Users can view their previous career recommendations.

### 🔐 Authentication

* User registration
* User login
* User-specific recommendation history
* Logout functionality

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │ Skills + Interests   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │      Dashboard       │
                    └──────────┬───────────┘
                               │ HTTP Requests
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
       │ Recommendation│ │ Authentication│ │ AI Chatbot   │
       │    Engine     │ │    System     │ │  OpenAI API  │
       └──────┬──────┘  └──────┬───────┘  └──────────────┘
              │                │
              └────────┬───────┘
                       ▼
                ┌──────────────┐
                │    SQLite    │
                │   Database   │
                └──────────────┘
```

---

## 🧠 Recommendation Logic

The recommendation engine compares the user's input with predefined career profiles.

The system considers:

* **Skills**
* **Interests**
* Skill matches
* Missing skills
* Interest matches

Skills are given a higher weight than interests when calculating the career score.

The system evaluates available careers and returns the **top 3 matching careers** along with their match information.

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### Database

* SQLite
* SQLAlchemy

### AI

* OpenAI API

### Development Tools

* Git
* GitHub
* VS Code

---

## 📂 Project Structure

```text
ai-career-guidance/
│
├── backend/
│   ├── models/
│   │   ├── users.py
│   │   └── recommendation.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── career.py
│   │   └── chatbot.py
│   │
│   ├── services/
│   │   └── career_service.py
│   │
│   ├── database.py
│   ├── main.py
│   ├── .env
│   └── career.db
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   └── career/
│   │
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── lib/
│
├── .gitignore
└── README.md
```

---

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Shashanka16/ai-career-guidance.git
cd ai-career-guidance
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn sqlalchemy python-dotenv openai
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 Environment Variables

The OpenAI API key should be stored only in the backend `.env` file.

Example:

```env
OPENAI_API_KEY=your_api_key_here
```

Never commit your real API key to GitHub.

The `.env` file should remain in `.gitignore`.

---

## 🖥️ Main User Flow

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Enter Skills + Interests
   ↓
Career Recommendation
   ↓
View Top 3 Careers
   ↓
View Skill Gaps
   ↓
View Career Roadmap
   ↓
Explore Related Careers
   ↓
Ask AI Career Assistant
   ↓
Recommendation History
```

---

## 🎓 Example

A user might enter:

```text
Skills:
Python, Machine Learning

Interests:
AI, Models
```

The system analyzes the input and may return careers such as:

```text
1. Machine Learning Engineer
2. AI Engineer
3. Data Scientist
```

The user can then explore the recommended career, identify missing skills, follow the roadmap, and ask the AI assistant what to learn next.

---

## 🔮 Future Improvements

Possible future enhancements include:

* Resume-based career recommendations
* More advanced ML-based recommendation models
* User progress tracking
* Personalized project recommendations
* Job and internship recommendations
* Course recommendation system
* Career analytics dashboard
* Deployment using cloud infrastructure
* More comprehensive authentication and authorization

---

## 📌 Project Goals

This project demonstrates practical experience with:

* Full-stack web development
* REST API development
* Database integration
* Authentication
* Recommendation systems
* AI API integration
* Frontend state management
* Git/GitHub workflow
* Building an end-to-end software product

---

## 👨‍💻 Author

**Shashanka**

B.Tech Computer Science Engineering

GitHub:
https://github.com/Shashanka16
