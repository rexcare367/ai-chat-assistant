import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment";

import { LoaderIcon, TrashIcon, MessageIcon } from "./icons";

const ChatHistoryItem = ({ fetchHistory, chatHistory, userId }) => {
  const { push } = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { slug } = useParams();
  const a_ssistantId = slug ? slug[0] : "";

  const handleHistoryDelete = async () => {
    setIsDeleting(true);

    await fetch(`/api/chat-history/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ assistantId: chatHistory.assistant_id }),
    });

    await fetchHistory();

    setIsDeleting(false);

    if (a_ssistantId === chatHistory.assistant_id) {
      push("/chat/all");
    }
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <Link
        className={`text-black w-full justify-start gap-4 flex flex-row items-center px-5 py-2 rounded-md ${
          a_ssistantId === chatHistory.assistant_id ? "font-bold" : ""
        }`}
        href={`/chat/all/${chatHistory.assistant_id}/${chatHistory.thread_id}`}
      >
        <MessageIcon />
        {moment(chatHistory.created_at).format("YYYY-MM-DD HH:mm")}
      </Link>
      <button
        className="cursor-pointer disabled:bg-opacity-80"
        onClick={() => handleHistoryDelete()}
        disabled={isDeleting}
      >
        {!isDeleting ? (
          <TrashIcon />
        ) : (
          <span className="animate-spin">
            <LoaderIcon />
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatHistoryItem;
