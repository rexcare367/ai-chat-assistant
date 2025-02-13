import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./chat-history.module.css";
import UserPanel from "./user-panel";
import { PlusIcon, MessageIcon } from "./icons";
import { useAuth } from "@clerk/nextjs";

const ChatHistory = () => {
  const { slug } = useParams();
  const a_ssistantId = slug ? slug[0] : "";

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    console.log("assistants :>> ", assistants);
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

    setIsLoading(false);

    await fetchHistory();
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

        <div className="flex-1 overflow-auto p-4">
          {history &&
            history.map((_, i) => {
              return (
                <Link
                  className={`text-black w-full justify-start gap-4 flex flex-row items-center px-5 py-2 rounded-md ${
                    a_ssistantId === _.assistant_id ? "font-bold" : ""
                  }`}
                  key={i}
                  // onClick={handleRoute}
                  href={`/chat/all/${_.assistant_id}/${_.thread_id}`}
                >
                  <MessageIcon />
                  Recent Chat {i + 1}
                </Link>
              );
            })}
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
