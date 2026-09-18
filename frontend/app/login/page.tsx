"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {

          method: "POST",

          headers: {

            "Content-Type":
            "application/json"

          },

          body: JSON.stringify({

            email,

            password

          })

        }
      );

      const data =
        await response.json();

      if (response.ok) {

    localStorage.setItem("userId", data.id.toString());
    localStorage.setItem("username", data.username);
    localStorage.setItem("email", data.email);

    alert("Login Successful!");

    window.location.href = "/dashboard";

 }
      else {

        alert(
          data.detail
        );

      }

    }

    catch (error) {

      alert(
        "Cannot connect to backend"
      );

    }

  };

  return (

    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-950"
    >

      <div
        className="
        bg-slate-900
        p-8
        rounded-xl
        shadow-lg
        w-[400px]"
      >

        <h1
          className="
          text-3xl
          font-bold
          text-white
          text-center
          mb-6"
        >

          Login

        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <input

            type="email"

            placeholder="Email"

            className="
            w-full
            p-3
            rounded
            bg-slate-800
            text-white"

            value={email}

            onChange={(e)=>

              setEmail(
                e.target.value
              )

            }

            required

          />

          <input

            type="password"

            placeholder="Password"

            className="
            w-full
            p-3
            rounded
            bg-slate-800
            text-white"

            value={password}

            onChange={(e)=>

              setPassword(
                e.target.value
              )

            }

            required

          />

          <button

            type="submit"

            className="
            w-full
            bg-green-600
            py-3
            rounded
            hover:bg-green-700
            text-white"

          >

            Login

          </button>

        </form>

      </div>

    </main>

  );

}