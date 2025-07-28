import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

export async function POST(req: NextRequest) {
  const { pdfName } = await req.json();

  const { data: file, error } = await supabase.storage
    .from("pdfs")
    .download(pdfName);

  if (error) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyze the sentiment of the following text and return "Positive", "Negative", or "Neutral":\n\n${data.text}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const sentiment = response.text();

  return NextResponse.json({ sentiment });
}
