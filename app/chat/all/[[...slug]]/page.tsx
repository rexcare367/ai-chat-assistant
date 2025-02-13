"use client";

import React, { useState } from "react";
import Chat from "../../../components/chat";
import { getWeather } from "../../../utils/weather";

const FunctionCalling = () => {
  const [weatherData, setWeatherData] = useState({});

  const functionCallHandler = async (call) => {
    if (call?.function?.name !== "get_weather") return;
    const args = JSON.parse(call.function.arguments);
    const data = getWeather(args.location);
    setWeatherData(data);
    return JSON.stringify(data);
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white">
      <div className="w-full h-full">
        <Chat functionCallHandler={functionCallHandler} />
      </div>
    </div>
  );
};

export default FunctionCalling;
