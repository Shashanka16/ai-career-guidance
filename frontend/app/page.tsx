"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">

      <h1 className="text-5xl font-bold mb-4">
        AI Career Guidance Platform
      </h1>

      <p className="text-xl text-gray-300 mb-10">
        Personalized Career Roadmaps Powered by AI
      </p>

      <div className="flex gap-4">

        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/register")}
          className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Register
        </button>

      </div>

    </main>
  );
}