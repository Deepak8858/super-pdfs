import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

async function summarizeChunk(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Summarize the following text:\n\n${text}`;
  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);

  const text = data.text;
  const chunkSize = 10000;
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }

  let summary = "";
  for (const chunk of chunks) {
    summary += await summarizeChunk(chunk);
  }

  const finalSummary = await summarizeChunk(summary);

  return NextResponse.json({ summary: finalSummary });
}
