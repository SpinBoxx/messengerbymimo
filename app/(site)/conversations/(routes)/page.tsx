"use client";

import EmptyState from "@/components/empty-state";
import useConversation from "@/hooks/use-conversation";
import clsx from "clsx";

export default function ConversationsPage() {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx("h-full lg:block lg:pl-80", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
}
