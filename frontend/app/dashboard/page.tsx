"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Chatbot states
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: string; text: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) return;

      const response = await fetch(
        `http://127.0.0.1:8000/history/${userId}`
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.log(error);
      setHistory([]);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    loadHistory();
  }, []);

  const handleRecommend = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/recommend",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(userId),
            skills: skills
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== ""),
            interests: interests
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i !== ""),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Unable to get recommendation");
        return;
      }

      setResult(data);

      loadHistory();
    } catch (error) {
      console.log(error);
      alert("Backend is not running.");
    }
  };

  // ---------------- CHATBOT ----------------

  const handleChat = async () => {
    if (!message.trim()) return;

    const userMessage = message.trim();

    // Add user's message
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

            // Send the recommended career to the AI
            career: result?.recommended_career || "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Chatbot error");
      }

      // Add chatbot response
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
          text: "Unable to connect to the chatbot.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      {/* NAVBAR */}

      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          AI Career Guidance
        </h1>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto">

        {/* RECOMMENDATION FORM */}

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl">

          <h2 className="text-2xl font-semibold mb-6">
            Enter Your Details
          </h2>

          <div className="space-y-5">

            <div>
              <label className="block mb-2 text-lg">
                Skills
              </label>

              <input
                className="w-full p-4 rounded-lg bg-slate-800 outline-none"
                placeholder="python, sql, machine learning"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
              />
            </div>

            <div>
              <label className="block mb-2 text-lg">
                Interests
              </label>

              <input
                className="w-full p-4 rounded-lg bg-slate-800 outline-none"
                placeholder="ai, analytics, research"
                value={interests}
                onChange={(e) =>
                  setInterests(e.target.value)
                }
              />
            </div>

            <button
              onClick={handleRecommend}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-lg font-semibold text-lg"
            >
              Get Recommendation
            </button>

          </div>
        </div>

        {/* RECOMMENDATION RESULT */}

        {result && (
          <div className="bg-slate-900 rounded-2xl mt-10 p-8 shadow-xl">

            {/* CAREER */}

            <h2 className="text-3xl font-bold text-green-400">
              {result.recommended_career}
            </h2>

            {/* MATCH PERCENTAGE */}

            <div className="mt-6 bg-slate-800 rounded-xl p-5">

              <div className="flex justify-between items-center mb-3">

                <h3 className="text-xl font-semibold">
                  🎯 Career Match
                </h3>

                <span className="text-2xl font-bold text-blue-400">
                  {result.match_percentage}%
                </span>

              </div>

              <div className="w-full bg-slate-700 rounded-full h-4">

                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${result.match_percentage}%`,
                  }}
                />

              </div>

            </div>

            {/* CONFIDENCE SCORE */}

            <p className="mt-5 text-xl">
              Confidence Score:

              <span className="font-bold text-blue-400">
                {" "}
                {result.confidence_score}
              </span>
            </p>
            {/* TOP 3 CAREER MATCHES */}

{result.top_matches?.length > 0 && (
  <div className="mt-8">
    <h3 className="text-2xl font-semibold mb-4">
      🏆 Top Career Matches
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {result.top_matches.map((match: any, index: number) => (
        <div
          key={index}
          className="bg-slate-800 p-5 rounded-xl border border-slate-700"
        >
          <h4 className="text-lg font-semibold text-blue-400">
            {index + 1}. {match.career}
          </h4>

          <p className="text-green-400 font-bold mt-2">
            Match: {match.match_percentage}%
          </p>

          <p className="text-gray-400 mt-1">
            Score: {match.score}
          </p>

          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">
              Matching Skills
            </p>

            {match.matched_skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {match.matched_skills.map(
                  (skill: string, skillIndex: number) => (
                    <span
                      key={skillIndex}
                      className="bg-green-700 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No matching skills yet.
              </p>
            )}
          </div>

          <button
            onClick={() => {
              window.location.href =
                `/career/${encodeURIComponent(match.career)}`;
            }}
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
          >
            Explore Career
          </button>
        </div>
      ))}
    </div>
  </div>
)}

            {/* MATCHED SKILLS */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                ✅ Skills You Already Have
              </h3>

              {result.matched_skills?.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {result.matched_skills.map(
                    (skill: string, index: number) => (

                      <span
                        key={index}
                        className="bg-green-600 px-4 py-2 rounded-lg"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No matching skills found yet.
                </p>

              )}

            </div>

            {/* MISSING SKILLS */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                ⚠️ Skills to Improve
              </h3>

              {result.missing_skills?.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {result.missing_skills.map(
                    (skill: string, index: number) => (

                      <span
                        key={index}
                        className="bg-orange-600 px-4 py-2 rounded-lg"
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="text-green-400">
                  You already have all the required skills!
                </p>

              )}

            </div>

            {/* MATCHED INTERESTS */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                ❤️ Matching Interests
              </h3>

              {result.matched_interests?.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {result.matched_interests.map(
                    (interest: string, index: number) => (

                      <span
                        key={index}
                        className="bg-purple-600 px-4 py-2 rounded-lg"
                      >
                        {interest}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p className="text-gray-400">
                  No matching interests found yet.
                </p>

              )}

            </div>

            {/* ROADMAP */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                🛣️ Roadmap
              </h3>

              <ul className="list-disc list-inside space-y-2">

                {result.roadmap.map(
                  (item: string, index: number) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

            {/* RELATED CAREERS */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                🔗 Related Career Paths
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {result.related_careers?.map(
                  (career: string, index: number) => (

                    <button
                      key={index}
                      onClick={() => {
                        window.location.href =
                          `/career/${encodeURIComponent(career)}`;
                      }}
                      className="text-left bg-slate-800 p-5 rounded-xl hover:bg-slate-700 transition"
                    >

                      <h4 className="text-lg font-semibold text-blue-400">
                        {career}
                      </h4>

                      <p className="text-gray-400 mt-2">
                        Click to explore this career path.
                      </p>

                    </button>

                  )
                )}

              </div>

            </div>

            {/* RESOURCES */}

            <div className="mt-8">

              <h3 className="text-2xl font-semibold mb-3">
                📚 Resources
              </h3>

              <ul className="space-y-2">

                {result.resources.map(
                  (resource: any, index: number) => (

                    <li key={index}>

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                      >
                        {resource.name}
                      </a>

                    </li>

                  )
                )}

              </ul>

            </div>

          </div>
        )}

        {/* RECOMMENDATION HISTORY */}

        <div className="bg-slate-900 rounded-2xl mt-10 p-8 shadow-xl">

          <h2 className="text-2xl font-bold mb-5">
            Recommendation History
          </h2>

          {history.length === 0 ? (

            <p className="text-gray-400">
              No recommendations yet.
            </p>

          ) : (

            <ul className="space-y-3">

              {history.map(
                (item: any, index: number) => (

                  <li
                    key={index}
                    className="bg-slate-800 p-4 rounded-lg flex justify-between"
                  >

                    <span>
                      {item.career}
                    </span>

                    <span className="text-blue-400 font-bold">
                      Score: {item.confidence}
                    </span>

                  </li>

                )
              )}

            </ul>

          )}

        </div>

        {/* CAREER CHATBOT */}

        <div className="bg-slate-900 rounded-2xl mt-10 p-8 shadow-xl">

          <h2 className="text-2xl font-bold">
            💬 Career Assistant
          </h2>

          <p className="text-gray-400 mt-2">
            Ask me about careers, skills, roadmaps, or learning resources.
          </p>

          {/* CHAT AREA */}

          <div className="bg-slate-950 rounded-xl p-5 min-h-[250px] max-h-[400px] overflow-y-auto space-y-4 mt-6">

            {chatMessages.length === 0 ? (

              <div className="text-gray-500 text-center py-10">
                Start a conversation with your Career Assistant.
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
                    className={`max-w-[80%] px-4 py-3 rounded-xl ${
                      chat.sender === "user"
                        ? "bg-blue-600"
                        : "bg-slate-800"
                    }`}
                  >
                    {chat.text}
                  </div>

                </div>

              ))

            )}

            {chatLoading && (

              <div className="text-gray-400">
                Career Assistant is typing...
              </div>

            )}

          </div>

          {/* CHAT INPUT */}

          <div className="flex gap-3 mt-5">

            <input
              className="flex-1 p-4 rounded-lg bg-slate-800 outline-none"
              placeholder="Ask something like: How do I become a data scientist?"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleChat();
                }
              }}
            />

            <button
              onClick={handleChat}
              disabled={chatLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 rounded-lg font-semibold"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}