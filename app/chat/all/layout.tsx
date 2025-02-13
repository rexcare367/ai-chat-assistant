"use client";

import React, { useEffect, useState } from "react";

import styles from "./layout.module.css";

import FileViewer from "../../components/file-viewer";
import ChatHistory from "../../components/chat-history";

export default function AllLayout({ children }: { children: React.ReactNode }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  useEffect(() => {
    if (isMobile) {
      console.log("isMobile :>> ", isMobile);
      setShowLeftSidebar(false);
      setShowRightSidebar(false);
    }
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          className={`${
            styles.column
          } border-r border-1 border-white transition-all duration-300 ${
            isMobile && "absolute z-10"
          } ${showLeftSidebar ? "block" : "!hidden"}`}
        >
          <ChatHistory />
        </div>
        <span
          className="flex items-center rounded-r-md justify-center absolute left-0 !w-4 !h-10 top-[45vh] bg-[#e5e7eb] z-20 cursor-pointer"
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        >
          ::
        </span>

        {children}
        <div
          className={`${
            styles.column
          } border-l border-1 border-white right-0 transition-all duration-300 ${
            isMobile && "absolute z-10"
          } ${showRightSidebar ? "block" : "!hidden"}`}
        >
          <FileViewer />
        </div>

        <span
          className="flex items-center rounded-l-md justify-center absolute right-0 !w-4 !h-10 top-[45vh] bg-[#e5e7eb] z-20 cursor-pointer"
          onClick={() => setShowRightSidebar(!showRightSidebar)}
        >
          ::
        </span>
      </div>
    </main>
  );
}
