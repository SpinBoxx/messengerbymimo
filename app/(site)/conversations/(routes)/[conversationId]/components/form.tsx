"use client";

import useConversation from "@/hooks/use-conversation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
import { Image, Loader2, Plane, SendHorizonal } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "react-hot-toast";

export default function FormComponent() {
  const { conversationId } = useConversation();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    axios
      .post("/api/messages", {
        ...values,
        conversationId,
      })
      .then((response) => {
        if (response.status !== 201) {
          toast.error(response.data.message);
        } else {
          form.reset();
          setLoading(false);
        }
      });
  }

  const handleUpload = (result: any) => {
    axios
      .post("/api/messages", {
        image: result.info.secure_url,
        conversationId,
      })
      .then((response) => {
        if (response.status !== 201) {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex w-full items-center gap-2 border-t bg-white p-4 lg:gap-4">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="cq7k3a5q"
      >
        <Image className="h-7 w-7 text-sky-500" />
      </CldUploadButton>

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
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Button
              size="icon"
              className="h-10 w-10 flex-none rounded-full bg-sky-500"
              variant="default"
              type="submit"
              disabled={loading}
            >
              <SendHorizonal
                // strokeWidth={4}
                className="h-4 w-4 fill-white text-white"
              />
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
