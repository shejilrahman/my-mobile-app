"use client";
import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "@/lib/firebase/client";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const UploadForm = styled.form`
  margin-top: 20px;
`;

const UploadForms = () => {
  const [file, setFile] = useState(null);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const formatHeading = (text) => {
    return text.toLowerCase().replace(/\s+/g, "_");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        department_name: "dop",
        file_heading: formatHeading(heading),
        file_description: description,
        timestamp: new Date().toISOString(),
        status: "posted",
      };

      const dbRef = ref(database, "posts");
      await push(dbRef, postData);

      // Reset form after successful submission
      setFile(null);
      setHeading("");
      setDescription("");
      setUploadStatus("Post uploaded successfully!");
    } catch (error) {
      console.error("Error uploading post:", error);
      setUploadStatus("Error uploading post");
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
};

export default UploadForms;
