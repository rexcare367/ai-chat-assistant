import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import styles from "./chat-history.module.css";
import { LoaderIcon, PlusIcon, AttachmentIcon } from "./icons";

import UserPanel from "./user-panel";
import ChatHistoryItem from "./chat-history-item";

const ChatHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      userId && (await fetchHistory());
      setIsLoading(false);
    })();
  }, [userId]);

  const fetchHistory = async () => {
    const resp = await fetch(`/api/chat-history/${userId}`);
    const assistants = await resp.json();
    setHistory(assistants);
  };

  const addHistory = async () => {
    setIsLoading(true);
    const assistant_res = await fetch(`/api/assistants`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    const assistant = await assistant_res.json();

    let assistantId = assistant.assistantId;

    const thread_res = await fetch(`/api/assistants/${assistantId}/threads`, {
      method: "POST",
    });
    const { threadId } = await thread_res.json();

    await fetch(`/api/chat-history/${userId}`, {
      method: "POST",
      body: JSON.stringify({ assistantId, threadId }),
    });

    await fetchHistory();
    setIsLoading(false);

    router.push(`/chat/all/${assistantId}/${threadId}`);
  };

  return (
    <div className={styles.fileViewer}>
      <div className="w-full h-full order-1">
        <div className="p-4">
          <button
            className="w-full justify-start border border-1 border-black disabled:border-black/20 disabled:text-black/20 rounded-md gap-4 flex flex-row items-center px-5 py-3"
            onClick={addHistory}
            disabled={isLoading}
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LoaderIcon /> Loading
            </div>
          ) : history.length === 0 ? (
            <div
              className={`flex flex-col items-center gap-4 justify-center h-full`}
            >
              <AttachmentIcon />
              No Chat
            </div>
          ) : (
            history &&
            history.map((item, i) => (
              <ChatHistoryItem
                key={i}
                chatHistory={item}
                fetchHistory={fetchHistory}
                userId={userId}
              />
            ))
          )}
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
          padding: "32px 10px",
          borderTop: "1px solid white",
        }}
      >
        <UserPanel />
      </div>
    </div>
  );
};

export default ChatHistory;
