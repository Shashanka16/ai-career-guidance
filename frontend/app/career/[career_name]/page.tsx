"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CareerDetails() {
  const params = useParams();

  const careerName = decodeURIComponent(
    params.career_name as string
  );

  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/career/${encodeURIComponent(
            careerName
          )}`
        );

        const data = await response.json();

        if (!response.ok || data.error) {
          setCareer(null);
          return;
        }

        setCareer(data);
      } catch (error) {
        console.log(error);
        setCareer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [careerName]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">
          Loading career details...
        </p>
      </main>
    );
  }

  if (!career) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-400">
            Career Not Found
          </h1>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      {/* NAVBAR */}

      <nav className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold text-blue-400">
          AI Career Guidance
        </h1>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-lg"
        >
          ← Dashboard
        </button>

      </nav>

      <div className="max-w-5xl mx-auto">

        {/* CAREER TITLE */}

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl">

          <h2 className="text-4xl font-bold text-green-400">
            {career.career}
          </h2>

          <p className="text-gray-400 mt-3 text-lg">
            Explore the skills, roadmap, and resources
            required for this career.
          </p>

        </div>

        {/* SKILLS */}

        <div className="bg-slate-900 rounded-2xl mt-8 p-8 shadow-xl">

          <h3 className="text-2xl font-semibold mb-5">
            🧠 Required Skills
          </h3>

          <div className="flex flex-wrap gap-3">

            {career.skills.map(
              (skill: string, index: number) => (
                <span
                  key={index}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        {/* INTERESTS */}

        <div className="bg-slate-900 rounded-2xl mt-8 p-8 shadow-xl">

          <h3 className="text-2xl font-semibold mb-5">
            ❤️ Suitable Interests
          </h3>

          <div className="flex flex-wrap gap-3">

            {career.interests.map(
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

        </div>

        {/* ROADMAP */}

        <div className="bg-slate-900 rounded-2xl mt-8 p-8 shadow-xl">

          <h3 className="text-2xl font-semibold mb-5">
            🛣️ Career Roadmap
          </h3>

          <div className="space-y-4">

            {career.roadmap.map(
              (step: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-slate-800 p-4 rounded-lg"
                >

                  <div className="bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <p className="text-lg">
                    {step}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

        {/* RESOURCES */}

        <div className="bg-slate-900 rounded-2xl mt-8 p-8 shadow-xl">

          <h3 className="text-2xl font-semibold mb-5">
            📚 Learning Resources
          </h3>

          <div className="space-y-3">

            {career.resources.map(
              (resource: any, index: number) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-blue-400 underline"
                >
                  {resource.name}
                </a>
              )
            )}

          </div>

        </div>

        {/* RELATED CAREERS */}

        {career.related_careers &&
          career.related_careers.length > 0 && (

          <div className="bg-slate-900 rounded-2xl mt-8 p-8 shadow-xl">

            <h3 className="text-2xl font-semibold mb-5">
              🔗 Related Career Paths
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {career.related_careers.map(
                (relatedCareer: string, index: number) => (

                  <button
                    key={index}
                    onClick={() => {
                      window.location.href =
                        `/career/${encodeURIComponent(
                          relatedCareer
                        )}`;
                    }}
                    className="text-left bg-slate-800 hover:bg-slate-700 p-5 rounded-xl transition"
                  >

                    <h4 className="text-lg font-semibold text-blue-400">
                      {relatedCareer}
                    </h4>

                    <p className="text-gray-400 mt-2">
                      Explore this career →
                    </p>

                  </button>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}