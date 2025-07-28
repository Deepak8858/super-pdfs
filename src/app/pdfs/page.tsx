"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import withAuth from "@/components/withAuth/withAuth";
import { motion } from "framer-motion";
import ParticleBackground from "@/components/ParticleBackground/ParticleBackground";

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
        const { data, error } = await supabase.storage.from("pdfs").list();
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
    const { data, error } = await supabase.storage
      .from("pdfs")
      .download(`public/${pdfName}`);

    if (error) {
      console.error(error);
      return;
    }

    const formData = new FormData();
    formData.append("file", data);

    const res = await fetch("/api/summarize", {
      method: "POST",
      body: formData,
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
    <div className="container mx-auto p-4">
      <ParticleBackground />
      <h1 className="text-2xl font-bold mb-4 z-10">Your PDFs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="p-4 border rounded-lg">
            <p className="font-bold">{pdf.name}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSummarize(pdf.name)}
                className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Summarize
              </button>
              <Link
                href={`/chat/${pdf.name}`}
                className="px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Chat
              </Link>
              <button
                onClick={() => handleHighlight(pdf.name)}
                className="px-4 py-2 font-bold text-white bg-purple-500 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Highlight Topics
              </button>
              <button
                onClick={() => handleSentiment(pdf.name)}
                className="px-4 py-2 font-bold text-white bg-yellow-500 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Analyze Sentiment
              </button>
              <Link
                href={`/interactive/${pdf.name}`}
                className="px-4 py-2 font-bold text-white bg-indigo-500 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Interactive View
              </Link>
            </div>
          </div>
        ))}
      </div>
      {summary && (
        <motion.div
          className="mt-8 p-4 border rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-2">Summary</h2>
          <p>{summary}</p>
        </motion.div>
      )}
      {topics && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Important Topics</h2>
          <ul className="list-disc list-inside">
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      )}
      {sentiment && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Sentiment</h2>
          <p>{sentiment}</p>
        </div>
      )}
    </div>
  );
}

export default withAuth(PdfsPage);
