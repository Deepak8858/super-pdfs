"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-primary">
      <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-secondary rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-2/5 bg-accent text-white rounded-tl-2xl rounded-bl-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              Fill up personal information and start journey with us.
            </p>
            <Link
              href="/signup"
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-accent"
            >
              Sign Up
            </Link>
          </div>
          <div className="w-3/5 p-5">
            <div className="text-left font-bold text-accent">
              <span className="text-white">AI</span> PDF
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-accent mb-2">
                Sign in to Account
              </h2>
              <div className="border-2 w-10 border-accent inline-block mb-2"></div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-64 p-2 flex items-center mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                <div className="bg-gray-100 w-64 p-2 flex items-center">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                <div className="flex justify-between w-64 mt-4">
                  <label className="flex items-center text-xs text-gray-300">
                    <input type="checkbox" name="remember" className="mr-1" />
                    Remember me
                  </label>
                  <a href="#" className="text-xs text-gray-300">
                    Forgot Password?
                  </a>
                </div>
                <button
                  onClick={handleLogin}
                  className="border-2 border-accent text-accent rounded-full px-12 py-2 inline-block font-semibold hover:bg-accent hover:text-white mt-5"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
