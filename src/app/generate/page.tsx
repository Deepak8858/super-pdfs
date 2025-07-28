"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import withAuth from "@/components/withAuth/withAuth";
import ParticleBackground from "@/components/ParticleBackground/ParticleBackground";

function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  const handleGenerate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const { text } = await res.json();
    setGeneratedText(text);
  };

  const handleDownloadPdf = () => {
    if (!generatedText) return;

    const doc = new jsPDF();
    doc.text(generatedText, 10, 10);
    doc.save("generated.pdf");
  };

  return (
    <div className="min-h-screen bg-primary text-light-blue">
      <ParticleBackground />
      <div className="container mx-auto p-4 z-10">
        <h1 className="text-4xl font-bold mb-8 text-accent">Generate PDF</h1>
        <div className="mt-8">
          <textarea
            placeholder="Enter your prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 bg-secondary border border-gray-600 rounded-lg"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleGenerate}
            className="w-full px-4 py-2 font-bold text-primary bg-accent rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Generate
          </button>
        </div>
        {generatedText && (
          <div className="mt-8 p-6 bg-secondary rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-accent">
              Generated Text
            </h2>
            <p>{generatedText}</p>
            <button
              onClick={handleDownloadPdf}
              className="mt-4 px-4 py-2 font-bold text-primary bg-accent rounded-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(GeneratePage);
