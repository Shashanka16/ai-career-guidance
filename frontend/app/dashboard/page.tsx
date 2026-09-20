"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD HISTORY ----------------

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

  // ---------------- LOGIN CHECK ----------------

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    loadHistory();
  }, []);

  // ---------------- RECOMMENDATION ----------------

  const handleRecommend = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        window.location.href = "/login";
        return;
      }

      if (!skills.trim() && !interests.trim()) {
        alert("Please enter at least one skill or interest.");
        return;
      }

      setLoading(true);

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

      await loadHistory();
    } catch (error) {
      console.log(error);
      alert("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ---------------- DASHBOARD UI ----------------

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
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  window.location.href = "/dashboard/chat";
                }}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition font-medium"
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

      {/* ==================== MAIN CONTENT ==================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* PAGE HEADER */}

        <div className="mb-10">

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Career Dashboard
          </h2>

          <p className="text-slate-500 mt-2 text-lg">
            Discover career paths based on your skills and interests.
          </p>

        </div>

        {/* ==================== INPUT SECTION ==================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

          <div className="mb-7">

            <h3 className="text-2xl font-bold text-slate-900">
              Find Your Career Path
            </h3>

            <p className="text-slate-500 mt-2">
              Enter your current skills and interests to get personalized
              career recommendations.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SKILLS */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Skills
              </label>

              <input
                className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Python, SQL, Machine Learning"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <p className="text-xs text-slate-400 mt-2">
                Separate multiple skills with commas.
              </p>

            </div>

            {/* INTERESTS */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Your Interests
              </label>

              <input
                className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="AI, Analytics, Research"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />

              <p className="text-xs text-slate-400 mt-2">
                Separate multiple interests with commas.
              </p>

            </div>

          </div>

          {/* RECOMMEND BUTTON */}

          <button
            onClick={handleRecommend}
            disabled={loading}
            className="mt-7 w-full md:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold transition shadow-sm"
          >
            {loading ? "Analyzing Your Profile..." : "Get Career Recommendation"}
          </button>

        </div>

        {/* ==================== RECOMMENDATION RESULT ==================== */}

        {result && (

          <div className="mt-10 space-y-8">

            {/* MAIN RECOMMENDATION */}

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              <div className="flex flex-col md:flex-row justify-between gap-6">

                <div>

                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Recommended Career
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
                    {result.recommended_career || "No strong career match found"}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    {result.recommended_career
                      ? "Based on your skills and interests."
                      : "Try entering technical skills or interests related to the careers you are exploring."}
                  </p>

                </div>

                <div className="bg-blue-50 rounded-2xl px-7 py-5 text-center">

                  <p className="text-sm text-slate-500">
                    Confidence Score
                  </p>

                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {result.confidence_score}
                  </p>

                </div>

              </div>

              {/* MATCH PERCENTAGE */}

              <div className="mt-8">

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-semibold text-slate-800">
                    Career Match
                  </h3>

                  <span className="text-xl font-bold text-blue-600">
                    {result.match_percentage}%
                  </span>

                </div>

                <div className="w-full bg-slate-100 rounded-full h-4">

                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-700"
                    style={{
                      width: `${result.match_percentage}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {result.recommended_career && (

              <>

            {/* ==================== TOP 3 CAREERS ==================== */}

            {result.top_matches?.length > 0 && (

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                <div className="mb-7">

                  <h3 className="text-2xl font-bold text-slate-900">
                    Top Career Matches
                  </h3>

                  <p className="text-slate-500 mt-1">
                    Other career paths that match your profile.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {result.top_matches.map(
                    (match: any, index: number) => (

                      <div
                        key={index}
                        className={`rounded-2xl p-6 border transition hover:-translate-y-1 hover:shadow-md ${
                          index === 0
                            ? "border-blue-300 bg-blue-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >

                        {/* RANK */}

                        <div className="flex justify-between items-center">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              index === 0
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            #{index + 1}
                          </span>

                          {index === 0 && (
                            <span className="text-xs font-semibold text-blue-600">
                              Best Match
                            </span>
                          )}

                        </div>

                        {/* CAREER */}

                        <h4 className="text-xl font-bold text-slate-900 mt-5">
                          {match.career}
                        </h4>

                        {/* MATCH */}

                        <div className="mt-5">

                          <div className="flex justify-between text-sm mb-2">

                            <span className="text-slate-500">
                              Match
                            </span>

                            <span className="font-bold text-green-600">
                              {match.match_percentage}%
                            </span>

                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-2">

                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${match.match_percentage}%`,
                              }}
                            />

                          </div>

                        </div>

                        {/* MATCHING SKILLS */}

                        <div className="mt-6">

                          <p className="text-sm font-semibold text-slate-700 mb-3">
                            Matching Skills
                          </p>

                          {match.matched_skills?.length > 0 ? (

                            <div className="flex flex-wrap gap-2">

                              {match.matched_skills.map(
                                (
                                  skill: string,
                                  skillIndex: number
                                ) => (

                                  <span
                                    key={skillIndex}
                                    className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                                  >
                                    ✓ {skill}
                                  </span>

                                )
                              )}

                            </div>

                          ) : (

                            <p className="text-sm text-slate-400">
                              No matching skills yet.
                            </p>

                          )}

                        </div>

                        {/* EXPLORE */}

                        <button
                          onClick={() => {
                            window.location.href =
                              `/career/${encodeURIComponent(
                                match.career
                              )}`;
                          }}
                          className={`mt-6 w-full px-4 py-3 rounded-xl font-semibold transition ${
                            index === 0
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          }`}
                        >
                          Explore Career →
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* ==================== SKILL ANALYSIS ==================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* MISSING SKILLS */}

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                <h3 className="text-xl font-bold text-slate-900">
                  Skills to Improve
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Skills that could strengthen your profile.
                </p>

                <div className="mt-5">

                  {result.missing_skills?.length > 0 ? (

                    <div className="flex flex-wrap gap-3">

                      {result.missing_skills.map(
                        (skill: string, index: number) => (

                          <span
                            key={index}
                            className="bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-green-600 font-medium">
                      You already have all the required skills!
                    </p>

                  )}

                </div>

              </div>

              {/* MATCHED INTERESTS */}

              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

                <h3 className="text-xl font-bold text-slate-900">
                  Matching Interests
                </h3>

                <p className="text-slate-500 text-sm mt-1">
                  Interests that align with this career.
                </p>

                <div className="mt-5">

                  {result.matched_interests?.length > 0 ? (

                    <div className="flex flex-wrap gap-3">

                      {result.matched_interests.map(
                        (interest: string, index: number) => (

                          <span
                            key={index}
                            className="bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-medium"
                          >
                            {interest}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-slate-400">
                      No matching interests found yet.
                    </p>

                  )}

                </div>

              </div>

            </div>

            {/* ==================== ROADMAP ==================== */}

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-slate-900">
                Career Roadmap
              </h3>

              <p className="text-slate-500 mt-1">
                Follow these steps to build the required skills.
              </p>

              <div className="mt-7 space-y-4">

                {result.roadmap?.map(
                  (item: string, index: number) => (

                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >

                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4">

                        <p className="text-slate-700">
                          {item}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* ==================== RELATED CAREERS ==================== */}

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-slate-900">
                Related Career Paths
              </h3>

              <p className="text-slate-500 mt-1">
                Explore other careers connected to your recommendation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">

                {result.related_careers?.map(
                  (career: string, index: number) => (

                    <button
                      key={index}
                      onClick={() => {
                        window.location.href =
                          `/career/${encodeURIComponent(
                            career
                          )}`;
                      }}
                      className="text-left bg-slate-50 border border-slate-200 p-5 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition"
                    >

                      <h4 className="text-lg font-bold text-blue-600">
                        {career}
                      </h4>

                      <p className="text-slate-500 text-sm mt-2">
                        Explore this career path →
                      </p>

                    </button>

                  )
                )}

              </div>

            </div>

            {/* ==================== RESOURCES ==================== */}

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

              <h3 className="text-2xl font-bold text-slate-900">
                Learning Resources
              </h3>

              <p className="text-slate-500 mt-1">
                Useful resources for your recommended career.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

                {result.resources?.map(
                  (resource: any, index: number) => (

                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition"
                    >

                      <p className="font-semibold text-blue-600">
                        {resource.name}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Open learning resource →
                      </p>

                    </a>

                  )
                )}

              </div>

            </div>

              </>

            )}

          </div>

        )}

        {/* ==================== HISTORY ==================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-10">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Recommendation History
            </h2>

            <p className="text-slate-500 mt-1">
              Your previous career recommendations.
            </p>

          </div>

          {history.length === 0 ? (

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">

              <p className="text-slate-500">
                No recommendations yet.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {history.map(
                (item: any, index: number) => (

                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-slate-50 border border-slate-200 p-5 rounded-xl"
                  >

                    <div>

                      <p className="font-semibold text-slate-900">
                        {item.career}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Previous recommendation
                      </p>

                    </div>

                    <span className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                      Score: {item.confidence}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* ==================== CAREER ASSISTANT CTA ==================== */}

        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div>

              <h2 className="text-2xl font-bold">
                Need help with your career?
              </h2>

              <p className="text-blue-100 mt-2">
                Ask our AI Career Assistant about skills, roadmaps,
                projects, certifications, or interviews.
              </p>

            </div>

            <button
              onClick={() => {
                window.location.href = "/dashboard/chat";
              }}
              className="px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold transition whitespace-nowrap"
            >
              Open Career Assistant →
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}