'use client';

import { doCredentialLogin } from "@/app/actions";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const response = await doCredentialLogin(formData);

      if (response?.error) {
        console.error(response.error);
        setError(response.error.message || "An error occurred");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      console.error(e);
      setError("Check your Credentials");
    }
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="w-full max-w-lg p-8 border border-black">
        <h1 className="text-2xl font-serif font-bold text-center text-[#BA0C2F]">
          Log in to manage your activities
        </h1>

        {error && (
          <div className="mt-4 text-center text-sm text-[#BA0C2F] bg-red-100 p-2 rounded border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#BA0C2F] focus:border-[#BA0C2F]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#BA0C2F] focus:border-[#BA0C2F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-[#BA0C2F] transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?
          <button
            onClick={() => router.push("/signup")}
            className="ml-1 text-[#BA0C2F] hover:underline font-semibold"
          >
            Sign up here
          </button>
        </p>
      </Card>
    </div>
  );
};

export default LoginForm;
