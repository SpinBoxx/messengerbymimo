"use client";

import useConversation from "@/hooks/use-conversation";
import { FullConversationType } from "@/types";
import clsx from "clsx";
import { UserPlus2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ConversationBox from "./conversation-box";
import { DialogAddGroupChat } from "./add-group-chat";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/lib/pusher";
import { find } from "lodash";

interface Props {
  initialConversations: FullConversationType[];
  users: User[];
}

export default function ConversationsList({
  initialConversations,
  users,
}: Props) {
  const [conversations, setConversations] = useState(initialConversations);
  const session = useSession();
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);
    const newHandler = (conversation: FullConversationType) => {
      setConversations((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };
    const updateHandler = (conversation: FullConversationType) => {
      setConversations((current) =>
        current.map((currentConv) => {
          if (currentConv.id === conversation.id) {
            return { ...currentConv, messages: conversation.messages };
          }
          return currentConv;
        })
      );
    };
    const removeHandler = (conversation: FullConversationType) => {
      setConversations((current) => {
        return [...current.filter((conv) => conv.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        router.push("/conversation");
      }
    };
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, router]);

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
        {conversations.map((conversation) => (
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
