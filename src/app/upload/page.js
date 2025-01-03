"use client";
import React, { useState, Suspense } from "react";
import { ref as dbRef, push } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import styled from "styled-components";
import { useSearchParams } from "next/navigation";
import { useFirebase } from "@/hooks/useFirebase";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const UploadForm = styled.form`
  margin-top: 20px;
`;

function UploadFormContent() {
  const { database, storage, initialized } = useFirebase();
  const searchParams = useSearchParams();
  const departmentName = searchParams.get("department") || "default_department";
  const [file, setFile] = useState(null);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  if (!initialized) {
    return <Container>Initializing Firebase...</Container>;
  }

  const formatHeading = (text) => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!database || !storage) {
      setUploadStatus("Upload functionality not available");
      return;
    }

    if (!file) {
      setUploadStatus("Please select a file");
      return;
    }

    if (file.type !== "application/pdf") {
      setUploadStatus("Only PDF files are allowed");
      return;
    }

    if (file.size > 500 * 1024) {
      // 500 KB
      setUploadStatus("File size must be less than 500 KB");
      return;
    }

    try {
      // First, upload the file to Firebase Storage
      const formattedHeading = formatHeading(heading);
      const fileRef = storageRef(
        storage,
        `uploads/${formattedHeading}/${file.name}`
      );

      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Then create the post in the database
      const postData = {
        department_name: departmentName,
        file_heading: formattedHeading,
        file_description: description,
        file_url: downloadURL,
        file_name: file.name,
        timestamp: new Date().toISOString(),
        status: "posted",
      };

      const postsRef = dbRef(database, "posts");
      await push(postsRef, postData);

      // Reset form after successful submission
      setFile(null);
      setHeading("");
      setDescription("");
      setUploadStatus("Post uploaded successfully!");

      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      setUploadStatus("Error uploading post: " + error.message);
    }
  };

  return (
    <Container>
      <h1>Upload Form</h1>
      <UploadForm onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="File Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload PDF</button>
      </UploadForm>
      {uploadStatus && (
        <p
          style={{
            marginTop: "10px",
            color: uploadStatus.includes("Error") ? "red" : "green",
          }}
        >
          {uploadStatus}
        </p>
      )}
    </Container>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadFormContent />
    </Suspense>
  );
}
