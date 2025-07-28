"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground/ParticleBackground";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <ParticleBackground />
      <header className="px-4 lg:px-6 h-14 flex items-center bg-secondary z-10">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-2xl font-bold text-accent">AI PDF</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {user ? (
            <>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/pdfs"
              >
                Your PDFs
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/upload"
              >
                Upload PDF
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/compare"
              >
                Compare PDFs
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/knowledge-base"
              >
                Knowledge Base
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/generate"
              >
                Generate PDF
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 text-gray-300"
                href="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 z-10">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-accent">
                  Unlock the Power of Your PDFs
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Our AI-powered platform allows you to chat with your
                  documents, summarize key information, and much more.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  href={user ? "/upload" : "/signup"}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
