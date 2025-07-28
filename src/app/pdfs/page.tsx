"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import withAuth from "@/components/withAuth/withAuth";
import { motion } from "framer-motion";

interface Pdf {
  name: string;
  id: string;
}

function PdfsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[] | null>(null);
  const [sentiment, setSentiment] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      const getPdfs = async () => {
        const { data, error } = await supabase
          .from("pdfs")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error(error);
        } else {
          setPdfs(data as Pdf[]);
        }
      };
      getPdfs();
    }
  }, [user]);

  const handleSummarize = async (pdfName: string) => {
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfName }),
    });

    const { summary } = await res.json();
    setSummary(summary);
  };

  const handleHighlight = async (pdfName: string) => {
    const res = await fetch("/api/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfName }),
    });

    const { topics } = await res.json();
    setTopics(topics);
  };

  const handleSentiment = async (pdfName: string) => {
    const res = await fetch("/api/sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfName }),
    });

    const { sentiment } = await res.json();
    setSentiment(sentiment);
  };

  return (
    <div className="min-h-screen bg-primary text-gray-800">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-8 text-dark-purple">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pdfs.map((pdf) => (
            <motion.div
              key={pdf.id}
              className="bg-secondary p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">{pdf.name}</h2>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleSummarize(pdf.name)}
                  className="w-full px-4 py-2 font-bold text-white bg-accent rounded-md hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Summarize
                </button>
                <Link
                  href={`/chat/${pdf.name}`}
                  className="w-full text-center px-4 py-2 font-bold text-white bg-accent rounded-md hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Chat
                </Link>
                <button
                  onClick={() => handleHighlight(pdf.name)}
                  className="w-full px-4 py-2 font-bold text-white bg-accent rounded-md hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Highlight Topics
                </button>
                <button
                  onClick={() => handleSentiment(pdf.name)}
                  className="w-full px-4 py-2 font-bold text-white bg-accent rounded-md hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Analyze Sentiment
                </button>
                <Link
                  href={`/interactive/${pdf.name}`}
                  className="w-full text-center px-4 py-2 font-bold text-white bg-accent rounded-md hover:bg-dark-purple focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Interactive View
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        {summary && (
          <motion.div
            className="mt-8 p-6 bg-secondary rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-dark-purple">
              Summary
            </h2>
            <p>{summary}</p>
          </motion.div>
        )}
        {topics && (
          <div className="mt-8 p-6 bg-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-dark-purple">
              Important Topics
            </h2>
            <ul className="list-disc list-inside">
              {topics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
        {sentiment && (
          <div className="mt-8 p-6 bg-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-dark-purple">
              Sentiment
            </h2>
            <p>{sentiment}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(PdfsPage);
