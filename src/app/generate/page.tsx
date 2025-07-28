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
    <div className="container mx-auto p-4">
      <ParticleBackground />
      <h1 className="text-2xl font-bold mb-4 z-10">Generate PDF</h1>
      <div className="mt-4">
        <textarea
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>
      <div className="mt-4">
        <button
          onClick={handleGenerate}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Generate
        </button>
      </div>
      {generatedText && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Generated Text</h2>
          <p>{generatedText}</p>
          <button
            onClick={handleDownloadPdf}
            className="mt-4 px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth(GeneratePage);
