import React, { useState } from "react";
import styles from "./file-viewer.module.css";
import { TrashIcon, LoaderIcon } from "./icons";
import { useParams } from "next/navigation";

const FileItem = ({ fetchFiles, file }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { slug } = useParams();
  const assistantId = slug[0];

  const handleFileDelete = async (fileId: string) => {
    setIsDeleting(true);
    await fetch(`/api/assistants/${assistantId}/files`, {
      method: "DELETE",
      body: JSON.stringify({ fileId }),
    });
    await fetchFiles();
    setIsDeleting(false);
  };

  return (
    <div className={styles.fileEntry}>
      <div className={styles.fileName}>
        <span className={styles.fileName}>{file.filename}</span>
        <span className={styles.fileStatus}>{file.status}</span>
      </div>
      <span
        className="cursor-pointer"
        onClick={() => handleFileDelete(file.file_id)}
      >
        {!isDeleting ? (
          <TrashIcon />
        ) : (
          <span className="animate-spin">
            <LoaderIcon />
          </span>
        )}
      </span>
    </div>
  );
};

export default FileItem;
