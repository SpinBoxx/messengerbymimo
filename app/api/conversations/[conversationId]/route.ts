import getCurrentUser from "@/actions/get-current-user";
import prismadb from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

interface Body {
  params: {
    conversationId: string;
  };
}

export async function DELETE(req: Request, { params }: Body) {
  const currentUser = await getCurrentUser();

  const { conversationId } = params;

  if (!currentUser?.id || !currentUser?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const conversation = await prismadb.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      users: true,
    },
  });

  if (!conversation)
    return NextResponse.json(
      { message: "Can't find a conversation" },
      { status: 400 }
    );

  const deleteConversation = await prismadb.conversation.delete({
    where: {
      id: conversationId,
      userIds: {
        hasSome: [currentUser.id],
      },
    },
  });

  conversation.users.forEach((user) => {
    if (user.email) {
      pusherServer.trigger(user.email, "conversation:remove", conversation);
    }
  });

  return NextResponse.json(deleteConversation, { status: 200 });
}
