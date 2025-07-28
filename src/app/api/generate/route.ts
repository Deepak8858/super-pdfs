import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError || !sessionData.session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = sessionData.session.user;

  const { data: pdfs, error: pdfsError } = await supabase.storage
    .from("pdfs")
    .list();

  if (pdfsError) {
    return NextResponse.json({ error: "Could not list PDFs" }, { status: 500 });
  }

  let documentsText = "";
  for (const pdf of pdfs) {
    const { data: file, error } = await supabase.storage
      .from("pdfs")
      .download(pdf.name);

    if (error) {
      continue;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    documentsText += `Document: ${pdf.name}\n\n${data.text}\n\n`;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `Based on the following documents, generate a new document based on the prompt: "${prompt}"\n\n${documentsText}`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();

  return NextResponse.json({ text });
}
