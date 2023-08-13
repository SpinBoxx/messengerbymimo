import getConversation from "@/actions/get-conversation";
import getMessages from "@/actions/get-messages";
import EmptyState from "@/components/empty-state";
import React from "react";
import Header from "./components/header";
import Body from "./components/body";
import Form from "./components/form";

interface Props {
  params: {
    conversationId: string;
  };
}

export default async function conversationPage({ params }: Props) {
  const conversation = await getConversation(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="h-full lg:pl-80 ">
        <div className="h-ful flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:pl-80 ">
      <div className="flex h-full flex-col">
        <Header conversation={conversation} />
        <Body />
        <Form />
      </div>
    </div>
  );
}
