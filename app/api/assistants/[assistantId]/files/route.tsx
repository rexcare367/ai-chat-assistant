// import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";

// upload file to assistant's vector store
export async function POST(request, { params: { assistantId } }) {
  try {
    const formData = await request.formData(); // process file as FormData
    const file = formData.get("file"); // retrieve the single file from FormData
    const vectorStoreId = await getOrCreateVectorStore(assistantId); // get or create vector store

    // upload using the file stream
    const openaiFile = await openai.files.create({
      file: file,
      purpose: "assistants",
    });

    // add file to vector store
    await openai.beta.vectorStores.files.create(vectorStoreId, {
      file_id: openaiFile.id,
    });
    return new Response();
  } catch (error) {
    console.log("error.message :>> ", error.message);
    return new Response();
  }
}

// list files in assistant's vector store
export async function GET(_request, { params: { assistantId } }) {
  try {
    const vectorStoreId = await getOrCreateVectorStore(assistantId); // get or create vector store
    const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

    const filesArray = await Promise.all(
      fileList.data.map(async (file) => {
        const fileDetails = await openai.files.retrieve(file.id);
        const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
          vectorStoreId,
          file.id
        );
        return {
          file_id: file.id,
          filename: fileDetails.filename,
          status: vectorFileDetails.status,
        };
      })
    );
    return Response.json({ code: 200, data: filesArray });
  } catch (error) {
    console.log("error.message :>> ", error.message);
    return Response.json({ code: 404, data: [] });
  }
}

// delete file from assistant's vector store
export async function DELETE(request, { params: { assistantId } }) {
  const body = await request.json();
  const fileId = body.fileId;

  const vectorStoreId = await getOrCreateVectorStore(assistantId); // get or create vector store
  await openai.beta.vectorStores.files.del(vectorStoreId, fileId); // delete file from vector store

  return new Response();
}

/* Helper functions */

const getOrCreateVectorStore = async (assistantId) => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }
  // otherwise, create a new vector store and attatch it to the assistant
  const vectorStore = await openai.beta.vectorStores.create({
    name: "sample-assistant-vector-store",
  });
  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
};
