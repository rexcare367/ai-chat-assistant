import React from "react";
import styles from "./chat-history.module.css";
import UserPanel from "./user-panel";

const ChatHistory = () => {
  return (
    <div className={styles.fileViewer}>
      <div
        style={{
          order: 1,
          height: "100%",
        }}
      ></div>
      <div
        style={{
          order: 2,
          zIndex: 10,
          width: "100%",
          height: "fit-content",
          display: "flex",
          justifyContent: "center",
          padding: "10px 5px",
          borderTop: "1px solid white",
        }}
      >
        <UserPanel />
      </div>
    </div>
  );
};

export default ChatHistory;
