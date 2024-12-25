"use client";
import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase/client";

export default function FileDetailsPage({ params }) {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);

  const id = unwrappedParams.id;
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileRef = ref(database, `posts/${id}`);
        const snapshot = await get(fileRef);

        if (snapshot.exists()) {
          setFileDetails(snapshot.val());
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

    fetchFileDetails();
  }, [id]);

  const formatFileDetail = (detail) => {
    return detail
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="container">Error: {error}</div>;
  }

  if (!fileDetails) {
    return <div className="container">File not found</div>;
  }

  return (
    <div className="container">
      {/* You might have a .card or .dark-card class in global.css for dark styling */}
      <div className="card">
        {/* Title */}
        <h1 className="card-title">
          {formatFileDetail(fileDetails.file_heading)}
        </h1>

        {/* File Name info */}
        <div className="card-info">
          <strong>File Name:</strong> {fileDetails.file_name}
        </div>

        {/* Description */}
        <p className="card-description">{fileDetails.file_description}</p>

        {/* Department & Timestamp */}
        <div className="card-info">
          <strong>Department:</strong>{" "}
          {fileDetails.department_name.toUpperCase()}
          <br />
          <strong>Uploaded:</strong>{" "}
          {new Date(fileDetails.timestamp).toLocaleDateString()}
        </div>

        {/* Download Button */}
        <a
          href={fileDetails.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
