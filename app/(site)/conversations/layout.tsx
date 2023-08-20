import Sidebar from "@/components/sidebar/sidebar";
import { ReactNode } from "react";
import ConversationsList from "./components/conversation-list";
import getConversations from "@/actions/get-conversations";
import getUsers from "@/actions/get-users";

export const revalidate = 0;

export default async function ({ children }: { children: ReactNode }) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <ConversationsList users={users} initialConversations={conversations} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
