import prismadb from "@/app/lib/prismadb";
import getCurrentUser from "./get-current-user";

export default async function getConversations() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return [];
  }

  const conversations = await prismadb.conversation.findMany({
    orderBy: {
      lastMessageAt: "desc",
    },
    where: {
      userIds: {
        has: currentUser.id,
      },
    },
    include: {
      users: true,
      messages: {
        include: {
          sender: true,
          seen: true,
        },
      },
    },
  });
  return conversations;
}
