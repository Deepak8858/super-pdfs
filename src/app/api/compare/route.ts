import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

export async function POST(req: NextRequest) {
  const { pdfs, query } = await req.json();

  let documentsText = "";
  for (const pdfName of pdfs) {
    const { data: file, error } = await supabase.storage
      .from("pdfs")
      .download(pdfName);

    if (error) {
      return NextResponse.json(
        { error: `PDF ${pdfName} not found` },
        { status: 404 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    documentsText += `Document: ${pdfName}\n\n${data.text}\n\n`;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Based on the following documents, answer the query: "${query}"\n\n${documentsText}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return NextResponse.json({ result: text });
}
