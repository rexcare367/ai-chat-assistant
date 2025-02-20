import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(_request) {
  const assistant = await openai.beta.assistants.create({
    instructions: `You are a highly intelligent and helpful assistant. 
    Ensure your responses are clear, concise, and easy to understand. 
    If a user requests the generation of a file, respond with a link to download the file instead of providing the source code. 
    Always respond in the same language as the user's last message. 
    Provide accurate and up-to-date information, and use reliable sources.`,
    name: "Advanced Assistant",
    model: "gpt-4o-mini",
    tools: [
      {
        type: "function",
        function: {
          name: "liveWebSearch",
          description:
            "Retrieve the most up-to-date information from the web to provide accurate answers to the user's inquiries.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "The complete text of the user's question or request for information.",
              },
            },
            required: ["query"],
          },
        },
      },
      { type: "file_search" },
      { type: "code_interpreter" },
    ],
  });

  return Response.json({ assistantId: assistant.id });
}
