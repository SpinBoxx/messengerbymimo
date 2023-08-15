"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  currentUser: User;
}

export function ModalProfile({ children, currentUser }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formSchema = z.object({
    name: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser.name!,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    axios
      .post("/api/settings", values)
      .then(() => {
        router.refresh();
        toast.success("Profile updated with success.");
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setLoading(false));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Make changes to your public profile here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <CldUploadButton
                      className="z-[99]"
                      options={{ maxFiles: 1 }}
                      onUpload={handleUpload}
                      uploadPreset="cq7k3a5q"
                    >
                      <Image
                        src={
                          image ||
                          currentUser?.image ||
                          "/images/placeholder.jpg"
                        }
                        className="h-8 w-8 rounded-full"
                        width="10"
                        height="10"
                        alt="user-image"
                      />
                    </CldUploadButton>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button type="submit" className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Save changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
