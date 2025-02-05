import React from "react";
import styles from "./chat-history.module.css";
import UserPanel from "./user-panel";
import { PlusIcon, MessageIcon } from "./icons";

const ChatHistory = () => {
  return (
    <div className={styles.fileViewer}>
      <div className="w-full h-full order-1">
        <div className="p-4">
          <button className="w-full justify-start border border-1 border-black rounded-md gap-4 flex flex-row items-center px-5 py-3">
            <PlusIcon />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <button className="w-full justify-start gap-4 flex flex-row items-center px-5 py-2">
            <MessageIcon />
            Recent Chat 1
          </button>
          <button className="w-full justify-start gap-4 flex flex-row items-center px-5 py-2">
            <MessageIcon />
            Recent Chat 2
          </button>
        </div>
      </div>
      <div
        style={{
          order: 2,
          zIndex: 10,
          width: "100%",
          height: "fit-content",
          display: "flex",
          justifyContent: "center",
          padding: "20px 10px",
          borderTop: "1px solid white",
        }}
      >
        <UserPanel />
      </div>
    </div>
  );
};

export default ChatHistory;
