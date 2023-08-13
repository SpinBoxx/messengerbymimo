"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FullConversationType } from "@/types";
import useOtherUser from "@/hooks/use-other-user";
import { useSession } from "next-auth/react";
import { useCallback, useMemo } from "react";
import clsx from "clsx";
import {
  AvatarDot,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-dot";

interface Props {
  conversation: FullConversationType;
  selected: boolean;
}

export default function ConversationBox({ conversation, selected }: Props) {
  const router = useRouter();
  const session = useSession();
  const otherUser = useOtherUser(conversation);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArray = lastMessage.seen || [];
    if (!userEmail) return false;

    // if the current logged user saw the last message
    // Filter the seenArray to find if the current logged user are in
    // If not return false, if yes return true
    return (
      seenArray.filter((user) => {
        user.email === userEmail;
      }).length !== 0
    );
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image";

    if (lastMessage?.body) return lastMessage.body;

    return "Start a conversation";
  }, [lastMessage]);

  return (
    <div
      className={clsx(
        "relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100",
        selected ? "bg-neutral-100" : "bg-white"
      )}
      onClick={handleClick}
    >
      <AvatarDot>
        <AvatarImage src={otherUser.image || "/images/user-ano.jpg"} />
        <AvatarFallback>{otherUser.name?.at(0)}</AvatarFallback>
      </AvatarDot>
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-md font-medium text-gray-900">
              {conversation.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              "truncate text-sm",
              hasSeen ? "text-gray-900" : "font-medium text-black"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
}
