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
    <div className="flex flex-col min-h-screen bg-primary text-light-blue">
      <ParticleBackground />
      <header className="px-4 lg:px-6 h-14 flex items-center bg-secondary z-10">
        <Link className="flex items-center justify-center" href="#">
          <span className="text-2xl font-bold text-accent">AI PDF</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {user ? (
            <>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/pdfs"
              >
                Your PDFs
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/upload"
              >
                Upload PDF
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/compare"
              >
                Compare PDFs
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/knowledge-base"
              >
                Knowledge Base
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/generate"
              >
                Generate PDF
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
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
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-accent">
                  AI-Powered PDF Analysis
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  Unlock insights from your documents with the power of AI.
                  Summarize, chat, and analyze your PDFs like never before.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-lg font-medium text-primary shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  href={user ? "/upload" : "/signup"}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <h3 className="text-2xl font-bold text-accent">Summarize</h3>
                <p className="text-lg">
                  Get concise summaries of your PDFs in seconds.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <h3 className="text-2xl font-bold text-accent">Chat</h3>
                <p className="text-lg">
                  Chat with your PDFs to get instant answers to your questions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <h3 className="text-2xl font-bold text-accent">Analyze</h3>
                <p className="text-lg">
                  Analyze your PDFs for sentiment, topics, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
