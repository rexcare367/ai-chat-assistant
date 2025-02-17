import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(_request) {
  const assistant = await openai.beta.assistants.create({
    instructions: `You are a helpful assistant. 
    If a user requests the generation of a file, respond with a link to download the file instead of providing the source code. 
    Ensure that your response is in the same language as the user\'s last message.`,
    name: "Quickstart Assistant",
    model: "gpt-4o-mini",
    tools: [
      // { type: "code_interpreter" },
      // {
      //   type: "function",
      //   function: {
      //     name: "get_weather",
      //     description: "Determine weather in my location",
      //     parameters: {
      //       type: "object",
      //       properties: {
      //         location: {
      //           type: "string",
      //           description: "The city and state e.g. San Francisco, CA",
      //         },
      //         unit: {
      //           type: "string",
      //           enum: ["c", "f"],
      //         },
      //       },
      //       required: ["location"],
      //     },
      //   },
      // },
      // {
      //   type: "function",
      //   function: {
      //     name: "getCountryInformation",
      //     description:
      //       "Get detailed information of a country like position, size, population, flag and other symbols",
      //     parameters: {
      //       type: "object",
      //       properties: {
      //         country: {
      //           type: "string",
      //           description: "Country name, e.g. Sweden",
      //         },
      //       },
      //       required: ["country"],
      //     },
      //   },
      // },
      {
        type: "function",
        function: {
          name: "liveWebSearch",
          description: "Get the latest information to answer user's question",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "all of user's meesage",
              },
            },
            required: ["query"],
          },
        },
      },
      { type: "file_search" },
    ],
  });

  return Response.json({ assistantId: assistant.id });
}
