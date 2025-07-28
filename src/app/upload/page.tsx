"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import withAuth from "@/components/withAuth/withAuth";
import { motion } from "framer-motion";

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setUploading(true);
    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      setUploading(false);
      alert(error.message);
      return;
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setUploading(false);
      alert("You must be logged in to upload a PDF.");
      return;
    }

    const user = sessionData.session.user;
    const { error: insertError } = await supabase.from("pdfs").insert({
      user_id: user.id,
      name: file.name,
      url: `https://ozcgtjtxijrxahohnzrp.supabase.co/storage/v1/object/public/pdfs/${file.name}`,
    });

    setUploading(false);

    if (insertError) {
      alert(insertError.message);
    } else {
      router.push("/pdfs");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Upload PDF</h1>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full">
            <motion.div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default withAuth(UploadPage);
