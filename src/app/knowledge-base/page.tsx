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
          .select("*");
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
    <div className="container mx-auto p-4">
      <ParticleBackground />
      <h1 className="text-2xl font-bold mb-4 z-10">Knowledge Base</h1>
      <button
        onClick={handleBuildKnowledgeBase}
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Build Knowledge Base
      </button>
      <div className="mt-8">
        {knowledge.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg mb-4">
            <p className="font-bold">{item.key}</p>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(KnowledgeBasePage);
