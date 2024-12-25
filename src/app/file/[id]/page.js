"use client";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase/client";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FileDetailsCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FileTitle = styled.h1`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
`;

const FileDescription = styled.p`
  color: #666;
  margin: 15px 0;
  line-height: 1.6;
`;

const FileInfo = styled.div`
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 20px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
  }
`;

export default function FileDetailsPage({ params }) {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const fileRef = ref(database, `posts/${params.id}`);
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
  }, [params.id]);

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  if (!fileDetails) {
    return <Container>File not found</Container>;
  }

  return (
    <Container>
      <FileDetailsCard>
        <FileTitle>{fileDetails.file_heading}</FileTitle>
        <FileInfo>
          <strong>File Name:</strong> {fileDetails.file_name}
        </FileInfo>
        <FileDescription>{fileDetails.file_description}</FileDescription>
        <FileInfo>
          <strong>Department:</strong>{" "}
          {fileDetails.department_name.toUpperCase()}
          <br />
          <strong>Uploaded:</strong>{" "}
          {new Date(fileDetails.timestamp).toLocaleDateString()}
        </FileInfo>
        <DownloadButton
          href={fileDetails.file_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download PDF
        </DownloadButton>
      </FileDetailsCard>
    </Container>
  );
}
