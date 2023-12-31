import getCurrentUser from "@/actions/get-current-user";
import prismadb from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  const body = await req.json();
  const { message, image, conversationId } = body;

  if (!currentUser?.id || !currentUser?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (!conversationId)
    return NextResponse.json(
      { message: "Conversation id is required" },
      { status: 400 }
    );

  const newMessage = await prismadb.message.create({
    data: {
      body: message,
      image: image,
      conversation: {
        connect: {
          id: conversationId,
        },
      },
      sender: {
        connect: {
          id: currentUser.id,
        },
      },
      seen: {
        connect: {
          id: currentUser.id,
        },
      },
    },
    include: {
      seen: true,
      sender: true,
    },
  });

  const updatedConversation = await prismadb.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessageAt: new Date(),
      messages: {
        connect: {
          id: newMessage.id,
        },
      },
    },
    include: {
      users: true,
      messages: {
        include: {
          seen: true,
        },
      },
    },
  });

  await pusherServer.trigger(conversationId, "messages:new", newMessage);
  const lastMessage =
    updatedConversation.messages[updatedConversation.messages.length - 1];

  updatedConversation.users.map((user) => {
    pusherServer.trigger(user.email!, "conversation:update", {
      id: conversationId,
      messages: [lastMessage],
    });
  });
  return NextResponse.json(newMessage, { status: 201 });
}
