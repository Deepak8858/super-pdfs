import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { pdfName: string } }
) {
  const { data, error } = await supabase.storage
    .from("pdfs")
    .download(`public/${params.pdfName}`);

  if (error) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
