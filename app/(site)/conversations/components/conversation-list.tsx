"use client";

import useConversation from "@/hooks/use-conversation";
import { FullConversationType } from "@/types";
import clsx from "clsx";
import { UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConversationBox from "./conversation-box";
import { DialogAddGroupChat } from "./add-group-chat";
import { User } from "@prisma/client";

interface Props {
  initialConversations: FullConversationType[];
  users: User[];
}

export default function ConversationsList({
  initialConversations,
  users,
}: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0",
        isOpen ? "hidden" : "left-0 block w-full"
      )}
    >
      <div className="px-5 ">
        <div className="mb-4 flex items-center justify-between pt-4">
          <div className="text-2xl font-bold text-neutral-800">Messages</div>
          <DialogAddGroupChat users={users} />
        </div>
        {initialConversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            conversation={conversation}
            selected={conversationId === conversation.id}
          />
        ))}
      </div>
    </aside>
  );
}
