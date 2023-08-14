import prismadb from "@/app/lib/prismadb";
import getCurrentUser from "./get-current-user";

export default async function getMessages(conversationId: string) {
  const messages = await prismadb.message.findMany({
    where: {
      conversationId: conversationId,
    },
    include: {
      sender: true,
      seen: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return messages;
}
