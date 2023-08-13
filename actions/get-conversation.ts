import prismadb from "@/app/lib/prismadb";
import getCurrentUser from "./get-current-user";

export default async function getConversation(conversationId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return null;
  }

  const conversation = await prismadb.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: true,
    },
  });
  return conversation;
}
