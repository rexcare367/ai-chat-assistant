"use client";

import React, { useState } from "react";
import Chat from "../../../components/chat";
import { getWeather } from "../../../utils/weather";
import { getCountryInformation } from "../../../utils/country";
import { liveWebSearch } from "../../../utils/liveWebSearch";

const FunctionCalling = () => {
  const [weatherData, setWeatherData] = useState({});

  const functionCallHandler = async (call) => {
    const functionName = call?.function?.name;
    switch (functionName) {
      case "get_weather": {
        const args = JSON.parse(call.function.arguments);
        const data = getWeather(args.location);
        setWeatherData(data);
        return JSON.stringify(data);
      }
      case "getCountryInformation": {
        const args = JSON.parse(call.function.arguments);
        const data = await getCountryInformation(args);
        console.log("data :>> ", data);
        // setWeatherData(data);
        return JSON.stringify(data);
      }
      case "liveWebSearch": {
        const args = JSON.parse(call.function.arguments);
        console.log("args", args);
        const data = await liveWebSearch(args);
        console.log("data :>> ", data);
        return JSON.stringify(data);
      }
      default:
        break;
    }
    if (call?.function?.name !== "get_weather") return;
    const args = JSON.parse(call.function.arguments);
    const data = getWeather(args.location);
    setWeatherData(data);
    return JSON.stringify(data);
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-white">
      <div className="w-full h-full">
        <Chat functionCallHandler={functionCallHandler} />
      </div>
    </div>
  );
};

export default FunctionCalling;
