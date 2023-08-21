import getCurrentUser from "@/actions/get-current-user";
import prismadb from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

interface Body {
  conversationId: string;
}

export async function POST(req: Request, { params }: { params: Body }) {
  const currentUser = await getCurrentUser();

  const { conversationId } = params;

  if (!currentUser?.id || !currentUser?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const conversation = await prismadb.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        include: {
          seen: true,
        },
      },
      users: true,
    },
  });

  if (!conversation)
    return NextResponse.json(
      { message: "Can't find the conversation" },
      { status: 400 }
    );

  const lastMessage = conversation.messages[conversation.messages.length - 1];

  if (!lastMessage) return NextResponse.json(conversation, { status: 200 });

  const updatedMessage = await prismadb.message.update({
    where: {
      id: lastMessage.id,
    },
    include: {
      sender: true,
      seen: true,
    },
    data: {
      seen: {
        connect: {
          id: currentUser.id,
        },
      },
    },
  });

  await pusherServer.trigger(currentUser.email, "conversation:update", {
    id: conversationId,
    messages: [updatedMessage],
  });

  if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
    return NextResponse.json(conversation);
  }

  await pusherServer.trigger(conversationId, "message:update", updatedMessage);

  return NextResponse.json(updatedMessage);
}
