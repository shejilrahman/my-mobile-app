"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/hooks/useFirebase";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const FileList = styled.div`
  margin-top: 20px;
`;

const FileCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const FileTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const NoFiles = styled.p`
  text-align: center;
  color: #666;
  margin-top: 40px;
`;

const formatFileHeading = (heading) => {
  return heading
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function DownloadPageContent() {
  const { database, initialized } = useFirebase();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const department = searchParams.get("department");
  const router = useRouter();

  useEffect(() => {
    if (initialized && database) {
      const fetchFiles = async () => {
        try {
          const filesRef = ref(database, "posts");
          const filesQuery = query(
            filesRef,
            orderByChild("department_name"),
            equalTo(department)
          );

          const snapshot = await get(filesQuery);
          if (snapshot.exists()) {
            const filesData = [];
            snapshot.forEach((childSnapshot) => {
              filesData.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            filesData.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            setFiles(filesData);
          } else {
            setFiles([]);
          }
        } catch (err) {
          console.error("Error fetching files:", err);
          setError("Failed to load files");
        } finally {
          setLoading(false);
        }
      };

      fetchFiles();
    }
  }, [department, initialized, database]);

  if (!initialized) {
    return <Container>Initializing Firebase...</Container>;
  }

  if (loading) {
    return <Container>Loading files...</Container>;
  }

  if (error) {
    return <Container>Error: {error}</Container>;
  }

  return (
    <Container>
      <div className="p-5 text-center">
        <h1 className="text-2xl font-bold">Download Forms</h1>
        <p>Select a form to download:</p>
        <ul className="list-none p-0">
          {files.length > 0 ? (
            files.map((file) => (
              <li
                key={file.id}
                className="my-2 text-lg cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-800 hover:shadow-md transition duration-200"
                onClick={() => {
                  router.push(`/file/${file.id}`);
                }}
              >
                {formatFileHeading(file.file_heading)}
              </li>
            ))
          ) : (
            <NoFiles>No files found for this department</NoFiles>
          )}
        </ul>
      </div>
    </Container>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DownloadPageContent />
    </Suspense>
  );
}
