"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import withAuth from "@/components/withAuth/withAuth";
import ParticleBackground from "@/components/ParticleBackground/ParticleBackground";

interface Knowledge {
  id: string;
  key: string;
  value: string;
}

function KnowledgeBasePage() {
  const [user, setUser] = useState<User | null>(null);
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);

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
      const getKnowledge = async () => {
        const { data, error } = await supabase
          .from("knowledge_base")
          .select("*")
          .eq("user_id", user.id);
        if (error) {
          console.error(error);
        } else {
          setKnowledge(data as Knowledge[]);
        }
      };
      getKnowledge();
    }
  }, [user]);

  const handleBuildKnowledgeBase = async () => {
    const { data: pdfs, error } = await supabase
      .from("pdfs")
      .select("name")
      .eq("user_id", user?.id);

    if (error) {
      console.error(error);
      return;
    }

    for (const pdf of pdfs) {
      const res = await fetch("/api/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfName: pdf.name }),
      });

      const { knowledge } = await res.json();
      //
    }
  };

  return (
    <div className="min-h-screen bg-primary text-light-blue">
      <ParticleBackground />
      <div className="container mx-auto p-4 z-10">
        <h1 className="text-4xl font-bold mb-8 text-accent">Knowledge Base</h1>
        <button
          onClick={handleBuildKnowledgeBase}
          className="w-full px-4 py-2 font-bold text-primary bg-accent rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Build Knowledge Base
        </button>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {knowledge.map((item) => (
            <div key={item.id} className="bg-secondary p-6 rounded-lg shadow-lg">
              <p className="font-bold text-accent">{item.key}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(KnowledgeBasePage);
