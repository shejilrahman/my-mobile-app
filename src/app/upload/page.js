"use client";
import React, { useState } from "react";
import { ref as dbRef, push } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "@/lib/firebase/client";
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

    if (!file) {
      setUploadStatus("Please select a file");
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
        department_name: "dop",
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
};

export default UploadForms;
