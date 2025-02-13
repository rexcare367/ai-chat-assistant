import { createClient } from "../../../utils/supabase/server";

export async function GET(_request, { params: { userId } }) {
  const supabase = await createClient();
  const { data: assistants } = await supabase
    .from("assistants")
    .select()
    .eq("clerk_id", userId);

  return Response.json(assistants);
}

export async function POST(request, { params: { userId } }) {
  const supabase = await createClient();

  const { assistantId, threadId } = await request.json();

  await supabase.from("assistants").insert({
    assistant_id: assistantId,
    clerk_id: userId,
    thread_id: threadId,
  });

  return Response.json({ assistantId, threadId });
}

export async function DELETE(request, { params: { userId } }) {
  const supabase = await createClient();

  const { assistantId } = await request.json();

  await supabase
    .from("assistants")
    .delete()
    .eq("assistant_id", assistantId)
    .eq("clerk_id", userId);

  return new Response();
}
