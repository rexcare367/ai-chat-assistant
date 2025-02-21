import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./file-viewer.module.css";
import { LoaderIcon, UploadIcon, FileIcon, AttachmentIcon } from "./icons";
import FileItem from "./file-item";

const FileViewer = () => {
  const router = useRouter();
  const { slug } = useParams();
  const a_ssistantId = slug ? slug[0] : "";
  // const a_threadId = slug ? slug[1] : "";

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchFiles();
      setIsLoading(false);
    })();
  }, [a_ssistantId]);

  const fetchFiles = async () => {
    if (a_ssistantId) {
      const resp = await fetch(`/api/assistants/${a_ssistantId}/files`, {
        method: "GET",
      });
      const { code, data } = await resp.json();
      if (code !== 200) {
        router.push("/chat/all");
      }

      setFiles(data);
    } else setFiles([]);
  };

  const handleFileUpload = async (event: any) => {
    setIsUploading(true);
    const data = new FormData();
    if (event.target.files.length < 0) return;

    const newFile = event.target.files[0];

    const isDuplicate = files.some((file) => {
      return file.filename === newFile.name;
    });

    if (isDuplicate) {
      alert("File with the same name already exists.");
      setIsUploading(false);
      return;
    }

    data.append("file", newFile);
    await fetch(`/api/assistants/${a_ssistantId}/files`, {
      method: "POST",
      body: data,
    });
    await fetchFiles();
    setIsUploading(false);
  };

  const isDisabled = useMemo(
    () => isUploading || !a_ssistantId || isLoading,
    [isUploading, a_ssistantId, isLoading]
  );

  return (
    <div className={styles.fileViewer}>
      <div className={`${styles.title} flex flx-row items-center gap-4`}>
        <FileIcon />
        File History
      </div>
      <div
        className={`${styles.filesList} ${
          files.length !== 0 ? styles.grow : ""
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <LoaderIcon /> Loading
          </div>
        ) : files.length === 0 ? (
          <div
            className={`flex flex-col items-center gap-4 justify-center h-full`}
          >
            <AttachmentIcon />
            No document
          </div>
        ) : (
          files.map((file, i) => (
            <FileItem file={file} fetchFiles={fetchFiles} key={i} />
          ))
        )}
      </div>
      <div className={styles.fileUploadContainer}>
        <label
          htmlFor="file-upload"
          className={`flex flex-row items-center gap-2 ${
            styles.fileUploadBtn
          } ${
            isDisabled
              ? "bg-black/40 cursor-default"
              : "bg-black cursor-pointer"
          }`}
        >
          {isUploading ? (
            <span className="animate-spin">
              <LoaderIcon />
            </span>
          ) : (
            <UploadIcon />
          )}{" "}
          Attach file
        </label>
        <input
          type="file"
          id="file-upload"
          name="file-upload"
          className={styles.fileUploadInput}
          multiple
          onClick={(e: any) => (e.target.value = null)}
          onChange={handleFileUpload}
          disabled={isDisabled}
          accept=".c,.cpp,.cs,.css,.doc,.docx,.go,.html,.java,.js,.json,.md,.pdf,.php,.pptx,.py,.rb,.sh,.tex,.ts,.txt"
        />
      </div>
    </div>
  );
};

export default FileViewer;
