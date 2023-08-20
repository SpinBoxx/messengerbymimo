import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useState } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Props {
  users: User[];
}

export function DialogAddGroupChat({ users }: Props) {
  const animatedComponents = makeAnimated();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    name: z.string().min(2).max(50),
    members: z.object({ value: z.string(), label: z.string() }).array().min(2),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const { watch, setValue } = form;

  const members = watch("members");

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    axios
      .post("/api/conversations", {
        ...values,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        toast.success("Conversation created !");
        form.reset();
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer rounded-full bg-gray-100 p-2 text-gray-600 transition hover:opacity-75">
          <UserPlus2 />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a group chat</DialogTitle>
          <DialogDescription>
            Create a group chat with more than 2 people
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="The name of the group chat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <Select
                      components={animatedComponents}
                      onChange={(value) => {
                        const mutableArray: { value: string; label: string }[] =
                          value as { value: string; label: string }[];
                        setValue("members", mutableArray, {
                          shouldValidate: true,
                        });
                      }}
                      options={users.map((user) => ({
                        value: user.id,
                        label: user.name!,
                      }))}
                      isMulti
                      value={members}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto flex">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create conversation"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
