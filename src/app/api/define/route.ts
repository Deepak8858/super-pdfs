import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI("AIzaSyBiatJyRD309R4WiD1DmbQW59o8oti7FU8");

export async function POST(req: NextRequest) {
  const { word } = await req.json();

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `What is the definition of the word "${word}"?`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const definition = response.text();

  return NextResponse.json({ definition });
}
