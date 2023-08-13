"use client";

import {
  AvatarDot,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-dot";
import useOtherUser from "@/hooks/use-other-user";
import { Conversation, User } from "@prisma/client";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

interface Props {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: Props) {
  const otherUser = useOtherUser(conversation);

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return "Active";
  }, [conversation]);
  return (
    <div className="flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          className="block cursor-pointer text-sky-500 transition-colors hover:text-sky-600 lg:hidden"
          href={"/conversations"}
        >
          <ChevronLeft className="h-8 w-8" />
        </Link>
        <AvatarDot>
          <AvatarImage src={otherUser.image!} />
          <AvatarFallback>{otherUser.name?.at(0)}</AvatarFallback>
        </AvatarDot>
        <div className="flex flex-col">
          <div>{conversation.name || otherUser.name}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <MoreVertical className="hoverr:text-sky-600 cursor-pointer text-sky-500 transition-colors" />
    </div>
  );
}
