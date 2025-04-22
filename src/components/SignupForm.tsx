"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

const SignupForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");

    try {
      const formData = new FormData(event.currentTarget);

      const username = formData.get("username") as string | null;
      const email = formData.get("email") as string | null;
      const password = formData.get("password") as string | null;

      if (!username || !email || !password) {
        throw new Error("All fields are required.");
      }

      const response = await fetch(`/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        const errorText = await response.text();
        setError(errorText || "Signup failed.");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred during registration.");
    }
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-blue-700">
          Create a New Account
        </h1>

        {error && (
          <div className="mt-4 text-center text-sm text-blue-700 bg-blue-100 p-2 rounded border border-blue-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="username"
              id="username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?
          <button
            onClick={() => router.push("/login")}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
