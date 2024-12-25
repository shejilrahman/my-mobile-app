"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase/client";

export default function FileDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // URL param for the file ID

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch file details on mount (and whenever "id" changes)
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileRef = ref(database, `posts/${id}`);
        const snapshot = await get(fileRef);
        if (snapshot.exists()) {
          setFile(snapshot.val());
        } else {
          setError("File not found");
        }
      } catch (err) {
        console.error("Error fetching file details:", err);
        setError("Failed to load file details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFileDetails();
    }
  }, [id]);

  // Handle file download
  const handleDownload = async () => {
    try {
      // Assuming the file's actual download URL is stored under posts/[id]/file_url
      const fileRef = ref(database, `posts/${id}/file_url`);
      const snapshot = await get(fileRef);
      if (snapshot.exists()) {
        const fileUrl = snapshot.val();

        // Fetch the file as a Blob
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "downloaded_file"; // Name the file as needed
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError("File URL not found");
      }
    } catch (err) {
      console.error("Error downloading file:", err);
      setError("Failed to download file");
    }
  };

  // Show a loading state if still fetching data
  if (loading) {
    return (
      <div className="bg-black text-white px-5 py-8 max-w-2xl mx-auto mt-8 rounded-md shadow-lg">
        Loading...
      </div>
    );
  }

  // Show an error message if something went wrong
  if (error) {
    return (
      <div className="bg-black text-white px-5 py-8 max-w-2xl mx-auto mt-8 rounded-md shadow-lg">
        Error: {error}
      </div>
    );
  }

  // If everything is fine, render the file details
  return (
    <div className="bg-black text-white px-5 py-8 max-w-2xl mx-auto mt-8 rounded-md shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{file.file_heading}</h1>
      <p className="text-base mb-6">{file.description}</p>

      <button
        onClick={handleDownload}
        className="px-6 py-2
                   bg-black 
                   text-white 
                   border 
                   border-white 
                   rounded 
                   hover:bg-gray-800 
                   focus:outline-none 
                   focus:ring-2 
                   focus:ring-white 
                   transition-all"
      >
        Download
      </button>
    </div>
  );
}
