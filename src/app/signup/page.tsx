"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import zxcvbn from "zxcvbn";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const strength = zxcvbn(newPassword).score;
    setPasswordStrength(strength);
  };

  const handleSignup = async () => {
    if (passwordStrength < 3) {
      setError("Password is too weak.");
      return;
    }

    const { error } = await supabase.auth.signUp({
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
          <div className="w-3/5 p-5">
            <div className="text-left font-bold text-accent">
              <span className="text-white">AI</span> PDF
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-accent mb-2">
                Create Account
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
                    onChange={handlePasswordChange}
                    className="bg-gray-100 outline-none text-sm flex-1 text-black"
                  />
                </div>
                <div className="w-64 mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        passwordStrength === 0
                          ? "bg-red-500"
                          : passwordStrength === 1
                          ? "bg-orange-500"
                          : passwordStrength === 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={handleSignup}
                  className="border-2 border-accent text-accent rounded-full px-12 py-2 inline-block font-semibold hover:bg-accent hover:text-white mt-5"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
          <div className="w-2/5 bg-accent text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">
              To keep connected with us please login with your personal info.
            </p>
            <Link
              href="/login"
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-accent"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
