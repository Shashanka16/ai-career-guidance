"use client";

import { useEffect, useState } from "react";

export default function CareerAssistant() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [career, setCareer] = useState("");

  // ---------------- LOGIN + CAREER ----------------

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    loadCareer(userId);
  }, []);

  // ---------------- LOAD LATEST CAREER ----------------

  const loadCareer = async (userId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/history/${userId}`
      );

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const latest = data[data.length - 1];

        if (latest?.career) {
          setCareer(latest.career);
        }
      }
    } catch (error) {
      console.log("Unable to load career:", error);
    }
  };

  // ---------------- CHATBOT ----------------

  const handleChat = async () => {
    if (!message.trim() || chatLoading) return;

    const userMessage = message.trim();

    setChatMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setChatLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            career: career,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Chatbot error");
      }

      setChatMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.log(error);

      setChatMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text: "Unable to connect to the Career Assistant. Please make sure the backend is running.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ---------------- UI ----------------

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ==================== NAVBAR ==================== */}

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                AI
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  AI Career Guidance
                </h1>

                <p className="text-sm text-slate-500">
                  Personalized Career Discovery
                </p>
              </div>

            </div>

            {/* NAVIGATION */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium"
              >
                Dashboard
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold"
              >
                Career Assistant
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition font-medium"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* ==================== CHAT CONTENT ==================== */}

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* HEADER */}

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 text-3xl mb-4">
            💬
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Career Assistant
          </h2>

          <p className="text-slate-500 mt-2">
            Get personalized guidance about careers, skills, projects,
            certifications, and interviews.
          </p>

          {career && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">

              <span className="text-sm text-slate-500">
                Recommended Career:
              </span>

              <span className="text-sm font-bold text-blue-600">
                {career}
              </span>

            </div>
          )}

        </div>

        {/* ==================== CHAT CARD ==================== */}

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* CHAT AREA */}

          <div className="h-[500px] overflow-y-auto p-6 space-y-5">

            {chatMessages.length === 0 ? (

              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">
                  🤖
                </div>

                <h3 className="text-xl font-semibold text-slate-800">
                  How can I help you?
                </h3>

                <p className="text-slate-500 mt-2 max-w-md">
                  Ask me about your recommended career, what skills to learn,
                  project ideas, certifications, or interview preparation.
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-6">

                  <button
                    onClick={() => {
                      setMessage("What should I learn next?");
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-sm transition"
                  >
                    What should I learn next?
                  </button>

                  <button
                    onClick={() => {
                      setMessage("What projects should I build?");
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-sm transition"
                  >
                    Project ideas
                  </button>

                  <button
                    onClick={() => {
                      setMessage("Which certifications should I consider?");
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-sm transition"
                  >
                    Certifications
                  </button>

                </div>

              </div>

            ) : (

              chatMessages.map((chat, index) => (

                <div
                  key={index}
                  className={`flex ${
                    chat.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`max-w-[80%] px-5 py-4 rounded-2xl ${
                      chat.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-slate-100 text-slate-800 rounded-bl-md"
                    }`}
                  >

                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {chat.sender === "user"
                        ? "You"
                        : "Career Assistant"}
                    </p>

                    <p className="whitespace-pre-wrap leading-relaxed">
                      {chat.text}
                    </p>

                  </div>

                </div>

              ))

            )}

            {/* LOADING */}

            {chatLoading && (

              <div className="flex justify-start">

                <div className="bg-slate-100 px-5 py-4 rounded-2xl rounded-bl-md">

                  <p className="text-sm text-slate-500">
                    Career Assistant is thinking...
                  </p>

                </div>

              </div>

            )}

          </div>

          {/* ==================== INPUT ==================== */}

          <div className="border-t border-slate-200 p-5 bg-slate-50">

            <div className="flex gap-3">

              <input
                className="flex-1 p-4 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ask about your career..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleChat();
                  }
                }}
              />

              <button
                onClick={handleChat}
                disabled={chatLoading || !message.trim()}
                className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold transition"
              >
                Send
              </button>

            </div>

            <p className="text-xs text-slate-400 mt-3">
              Press Enter to send your message.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}