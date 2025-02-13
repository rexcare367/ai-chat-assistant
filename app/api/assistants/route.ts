import { openai } from "@/app/openai";
import { createClient } from "../../utils/supabase/server";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(_request) {
  const assistant = await openai.beta.assistants.create({
    instructions:
      "You are a helpful assistant. Your response should be germany. if user ask to generate a file, you don't need to return the source code and just return the file link",
    name: "Quickstart Assistant",
    model: "gpt-4o-mini",
    tools: [
      { type: "code_interpreter" },
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Determine weather in my location",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["c", "f"],
              },
            },
            required: ["location"],
          },
        },
      },
      { type: "file_search" },
    ],
  });

  return Response.json({ assistantId: assistant.id });
}
