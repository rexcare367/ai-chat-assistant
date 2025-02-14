import { tavily } from "@tavily/core";

export async function liveWebSearch(params) {
  try {
    const query = params.query;

    const tvly = tavily({
      apiKey: process.env.NEXT_PUBLIC_TAVILY_KEY!,
    });
    const response = await tvly.search(query, {});

    return JSON.stringify(response.results);
  } catch (error) {
    console.error(error);
    return null;
  }
}
