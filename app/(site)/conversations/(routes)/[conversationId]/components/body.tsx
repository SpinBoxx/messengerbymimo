"use client";

import useConversation from "@/hooks/use-conversation";
import { FullMessageType } from "@/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./message-box";
import axios from "axios";

interface Props {
  initialMessages: FullMessageType[];
}

export default function Body({ initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          message={message}
          key={index}
          isLast={messages.length - 1 === index}
        />
      ))}
      <div ref={bottomRef} className="pt-24"></div>
    </div>
  );
}
