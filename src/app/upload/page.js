"use client";
import React, { useState } from "react";
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

  const handleUpload = (e) => {
    e.preventDefault();
    // Handle file upload logic here
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
    </Container>
  );
};

export default UploadForms;
