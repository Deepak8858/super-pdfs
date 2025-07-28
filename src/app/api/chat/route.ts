import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

export async function POST(req: NextRequest) {
  const { message, pdfName } = await req.json();

  const { data: file, error } = await supabase.storage
    .from("pdfs")
    .download(pdfName);

  if (error) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);

  const { data: knowledge, error: knowledgeError } = await supabase
    .from("knowledge_base")
    .select("key, value");

  if (knowledgeError) {
    return NextResponse.json(
      { error: "Could not retrieve knowledge base" },
      { status: 500 }
    );
  }

  const knowledgeText = knowledge
    .map((item) => `${item.key}: ${item.value}`)
    .join("\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Based on the following text and knowledge base, answer the question: "${message}"\n\nText:\n${data.text}\n\nKnowledge Base:\n${knowledgeText}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return NextResponse.json({ response: text });
}
