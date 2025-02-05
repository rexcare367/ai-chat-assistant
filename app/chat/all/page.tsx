"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
// import WeatherWidget from "../../components/weather-widget";
import { getWeather } from "../../utils/weather";
import FileViewer from "../../components/file-viewer";
import ChatHistory from "../../components/chat-history";

// import ChatHeader from "../../components/chat-header";

const FunctionCalling = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const [weatherData, setWeatherData] = useState({});
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const functionCallHandler = async (call) => {
    if (call?.function?.name !== "get_weather") return;
    const args = JSON.parse(call.function.arguments);
    const data = getWeather(args.location);
    setWeatherData(data);
    return JSON.stringify(data);
  };

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
          className={`${styles.column} transition-all duration-300 ${
            isMobile && "absolute z-10"
          } ${showLeftSidebar ? "block" : "!hidden"}`}
        >
          <ChatHistory />
        </div>
        <span
          className="flex items-center rounded-r-md justify-center absolute left-0 !w-4 !h-10 top-[45vh] bg-[#e5e7eb] z-10 cursor-pointer"
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        >
          ::
        </span>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
        <span
          className="flex items-center rounded-l-md justify-center absolute right-0 !w-4 !h-10 top-[45vh] bg-[#e5e7eb] z-10 cursor-pointer"
          onClick={() => setShowRightSidebar(!showRightSidebar)}
        >
          ::
        </span>
        <div
          className={`${styles.column}  ${
            isMobile && "absolute  z-10"
          } right-0 transition-all duration-300 ${
            showRightSidebar ? "block" : "!hidden"
          }`}
        >
          <FileViewer />
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
