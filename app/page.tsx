"use client";

import React from "react";
import styles from "./page.module.css";

const Home = () => {
  const categories = {
    "Basic chat": "basic-chat",
    "Function calling": "function-calling",
    "File search": "file-search",
    All: "all",
  };

  return (
    <main
      className={styles.main}
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80")',
        backgroundSize: "cover",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80%",
          background: "rgba(255, 255, 255, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "1rem",
        }}
      >
        <div className={styles.title}>AI Assistants Chatbot</div>
        <div className={styles.container}>
          <a
            className={styles.category}
            href={`/sign-in`}
            style={{ width: "fit-content" }}
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
};

export default Home;
