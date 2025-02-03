"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";

const ChatHeader = () => {
  const { user } = useUser();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem 2rem",
        width: "100%",
      }}
    >
      <h2>AI Assistant</h2>
    </div>
  );
};

export default ChatHeader;
