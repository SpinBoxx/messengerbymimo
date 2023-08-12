import Sidebar from "@/components/sidebar/sidebar";
import { ReactNode } from "react";
import ConversationsList from "./components/conversation-list";
import getConversations from "@/actions/get-conversations";

export const revalidate = 0;

export default async function ({ children }: { children: ReactNode }) {
  const conversations = await getConversations();

  return (
    <Sidebar>
      <ConversationsList initialConversations={conversations} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
