"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase/client";

export default function FileDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch file details
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

  // Handle download
  const handleDownload = async () => {
    try {
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
        link.download = "downloaded_file";
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

  if (loading) {
    return (
      <div
        className="px-4 py-6 rounded-md max-w-2xl mx-auto mt-10 shadow-lg"
        style={{
          /* Use global CSS variables for colors */
          backgroundColor: "var(--color-background)",
          color: "var(--color-text-main)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="px-4 py-6 rounded-md max-w-2xl mx-auto mt-10 shadow-lg"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text-main)",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="px-4 py-6 rounded-md max-w-2xl mx-auto mt-10 shadow-lg"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text-main)",
      }}
    >
      <h1 className="text-2xl font-bold mb-4">{file.file_heading}</h1>
      <p className="mb-6">{file.description}</p>

      <button
        onClick={handleDownload}
        className="px-6 py-2 rounded hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: "var(--color-background)",
          color: "var(--color-text-main)",
          border: `1px solid var(--color-text-main)`,
        }}
      >
        Downloads
      </button>
    </div>
  );
}
