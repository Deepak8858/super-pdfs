"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import withAuth from "@/components/withAuth/withAuth";
import ParticleBackground from "@/components/ParticleBackground/ParticleBackground";

interface Pdf {
  name: string;
  id: string;
}

function ComparePage() {
  const [user, setUser] = useState<User | null>(null);
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

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

  const handlePdfSelection = (pdfName: string) => {
    setSelectedPdfs((prev) =>
      prev.includes(pdfName)
        ? prev.filter((name) => name !== pdfName)
        : [...prev, pdfName]
    );
  };

  const handleCompare = async () => {
    const res = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfs: selectedPdfs, query }),
    });

    const { result } = await res.json();
    setComparisonResult(result);
  };

  return (
    <div className="container mx-auto p-4">
      <ParticleBackground />
      <h1 className="text-2xl font-bold mb-4 z-10">Compare PDFs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedPdfs.includes(pdf.name) ? "bg-blue-200" : ""
            }`}
            onClick={() => handlePdfSelection(pdf.name)}
          >
            <p className="font-bold">{pdf.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleCompare}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Compare
        </button>
      </div>
      {comparisonResult && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Comparison Result</h2>
          <p>{comparisonResult}</p>
        </div>
      )}
    </div>
  );
}

export default withAuth(ComparePage);
