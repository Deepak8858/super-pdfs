"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import withAuth from "@/components/withAuth/withAuth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function InteractivePdfPage({
  params,
}: {
  params: { pdfName: string };
}) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [definition, setDefinition] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleWordClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "SPAN") {
      const word = target.innerText;
      const res = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });
      const { definition } = await res.json();
      setDefinition(definition);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Interactive PDF: {params.pdfName}
      </h1>
      <div onClick={handleWordClick}>
        <Document
          file={`/api/pdf/${params.pdfName}`}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      {definition && (
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Definition</h2>
          <p>{definition}</p>
        </div>
      )}
    </div>
  );
}

export default withAuth(InteractivePdfPage);
