import getCurrentUser from "@/actions/get-current-user";
import prismadb from "@/app/lib/prismadb";
import { pusherServer } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  const body = await req.json();

  const { userId, isGroup, members, name } = body;

  if (!currentUser?.id || !currentUser?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (isGroup && (!members || members.length < 2 || !name))
    return NextResponse.json(
      { message: "Members need to be at least 2" },
      { status: 400 }
    );

  if (isGroup) {
    const newConversation = await prismadb.conversation.create({
      data: {
        isGroup,
        name,
        users: {
          connect: [
            ...members.map((member: { value: string }) => ({
              id: member.value,
            })),
            { id: currentUser.id },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });
    return NextResponse.json(newConversation, { status: 201 });
  }

  const existingConversations = await prismadb.conversation.findMany({
    where: {
      OR: [
        {
          userIds: {
            equals: [currentUser.id, userId],
          },
        },
      ],
    },
  });

  const singleConversation = existingConversations[0];
  if (singleConversation)
    return NextResponse.json(singleConversation, { status: 200 });

  const newConversation = await prismadb.conversation.create({
    data: {
      users: {
        connect: [{ id: currentUser.id }, { id: userId }],
      },
    },
    include: {
      users: true,
    },
  });
  newConversation.users.forEach((user) => {
    if (user.email) {
      pusherServer.trigger(user.email, "conversation:new", newConversation);
    }
  });

  return NextResponse.json(newConversation, { status: 201 });
}
