import { createClient } from "../../../../utils/supabase/server";

export async function GET(_request, { params: { assistantId } }) {
  const supabase = await createClient();

  const { data: chats } = await supabase
    .from("chats")
    .select()
    .eq("assistant_id", assistantId)
    .order("created_at", { ascending: true });

  return Response.json(chats);
}
export async function POST(request, { params: { assistantId } }) {
  const supabase = await createClient();
  const { sender, text, attachments } = await request.json();

  const { data: chat } = await supabase.from("chats").insert({
    sender,
    text,
    attachments: JSON.stringify(attachments),
    assistant_id: assistantId,
  });

  return Response.json(chat);
}
