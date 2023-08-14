"use client";

import {
  AvatarDot,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-dot";
import { FullMessageType } from "@/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Props {
  isLast?: boolean;
  message: FullMessageType;
}

export default function MessageBox({ message, isLast }: Props) {
  const session = useSession();
  const isOwn = session.data?.user?.email === message.sender.email;
  const seenList = (message.seen || [])
    .filter((user) => user.email !== message.sender.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const messageDiv = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    message.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  return (
    <div className={container}>
      <div className={avatar}>
        <AvatarDot>
          <AvatarImage src={message.sender.image || "/images/user-ano.jpg"} />
          <AvatarFallback>{message.sender.name?.at(0)}</AvatarFallback>
        </AvatarDot>
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>
        <div className={messageDiv}>
          {message.image ? (
            <Image
              src={message.image}
              height="288"
              width="288"
              alt="Image message"
              className="translate cursor-pointer object-cover transition hover:scale-110"
            />
          ) : (
            <div>{message.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
}
