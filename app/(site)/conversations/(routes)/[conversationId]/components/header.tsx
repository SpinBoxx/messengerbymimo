"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AvatarDot,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-dot";
import useOtherUser from "@/hooks/use-other-user";
import { Conversation, User } from "@prisma/client";
import { ChevronLeft, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import AvatarGroup from "@/components/ui/avatar-group";
import { ConfirmDialog } from "@/app/(site)/conversations/(routes)/[conversationId]/components/confirm-dialog";
import useActiveList from "@/hooks/user-active-list";

interface Props {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Header({ conversation }: Props) {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  return (
    <div className="flex w-full items-center justify-between border-b bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Link
          className="block cursor-pointer text-sky-500 transition-colors hover:text-sky-600 lg:hidden"
          href={"/conversations"}
        >
          <ChevronLeft className="h-8 w-8" />
        </Link>
        <AvatarDot user={otherUser}>
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
      <Popover>
        <PopoverTrigger asChild>
          <MoreVertical className="hoverr:text-sky-600 cursor-pointer text-sky-500 transition-colors" />
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-bold leading-none">Informations</h4>
            </div>
            <div className="mt-2 flex flex-col justify-between gap-2">
              <div className="flex gap-3">
                {conversation.isGroup ? (
                  <AvatarGroup users={conversation.users} />
                ) : (
                  <AvatarDot user={otherUser}>
                    <AvatarImage src={otherUser.image!} />
                    <AvatarFallback>{otherUser.name?.at(0)}</AvatarFallback>
                  </AvatarDot>
                )}

                <div className="flex flex-col">
                  <span className="text-sembold">{otherUser.name}</span>
                  <span className="text-sm text-gray-500">{statusText}</span>
                </div>
                <ConfirmDialog>
                  <div className="ml-auto flex cursor-pointer flex-col items-center">
                    <Button
                      className="h-fit w-fit rounded-full bg-gray-200 p-2.5 text-red-500 hover:bg-gray-300"
                      size="icon"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>

                    <span className="text-red-500">Delete</span>
                  </div>
                </ConfirmDialog>
              </div>
            </div>
            <Separator />
            <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
              <dl className="space-y-8 sm:space-y-6 ">
                {conversation.isGroup && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Emails
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {conversation.users.map((user) => user.email).join(", ")}
                    </dd>
                  </div>
                )}
                {!conversation.isGroup && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600 sm:w-40 sm:flex-shrink-0">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {otherUser.email}
                    </dd>
                  </div>
                )}
                {!conversation.isGroup && (
                  <>
                    <Separator />
                    <div>
                      <dt className="text-sm font-medium text-gray-600 sm:w-40 sm:flex-shrink-0">
                        Joined
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                        <time dateTime={joinedDate}>{joinedDate}</time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
