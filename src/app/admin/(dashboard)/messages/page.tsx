import { createClient } from "@/lib/supabase/server";
import { MessagesManager } from "@/components/admin/messages-manager";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return <MessagesManager messages={messages ?? []} />;
}
