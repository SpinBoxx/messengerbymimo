"use client";

import useConversation from "@/hooks/use-conversation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Image, Plane, SendHorizonal } from "lucide-react";

export default function FormComponent() {
  const { conversationId } = useConversation();

  const formSchema = z.object({
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    axios.post("/api/messages", {
      ...values,
      conversationId,
    });
  }

  return (
    <div className="flex w-full items-center gap-2 border-t bg-white p-4 lg:gap-4">
      <Image className="h-7 w-7 text-sky-500" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full items-center gap-3"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="w-full">
                  <Input
                    placeholder="Write a message"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="icon"
            className="rounded-full bg-sky-500"
            variant="default"
          >
            <SendHorizonal
              strokeWidth={4}
              className="h-5 w-5 fill-white text-white"
            />
          </Button>
        </form>
      </Form>
    </div>
  );
}
