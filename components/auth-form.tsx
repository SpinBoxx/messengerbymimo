"use client";

import { Github, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Separator } from "./ui/separator";
import axios from "axios";
import toast from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  const [variant, setvariant] = useState<Variant>("LOGIN");
  const submitLabel = variant === "LOGIN" ? "Sign in" : "Sign up";

  const toggleVariant = () => {
    if (variant === "LOGIN") {
      setvariant("REGISTER");
    } else {
      setvariant("LOGIN");
    }
  };

  const formSchema = z.object({
    name: z.string().max(50).optional(),
    email: z.string().min(2).max(50),
    password: z.string().min(1),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (variant === "REGISTER") {
      axios
        .post("/api/register", values)
        .then((response) => {
          toast.success("Account created with success.");
        })
        .catch((error) => {
          console.log(error.response.data.message);

          toast.error(error.response.data.message);
        });
    } else {
    }
  }
  return (
    <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <CardContent className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {variant === "REGISTER" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name here..." {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email here..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password here..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {submitLabel}
            </Button>
          </form>
        </Form>
        <div>
          <div className="my-4 flex flex-row items-center justify-between text-center">
            <Separator className="w-2/5 justify-start" /> Or
            <Separator className="w-2/5 justify-self-end" />
          </div>
          <div className="flex justify-around">
            <Button className="w-1/3 bg-slate-800">
              <Github className="mr-2 h-5 w-5" /> Github
            </Button>
            <Button className="w-1/3 bg-slate-800">
              <svg
                className="mr-2 h-5 w-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              Google
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 px-2 text-sm text-gray-500">
          <span>
            {variant === "LOGIN"
              ? "New to messenger ?"
              : "Aleardy have an account ?"}
          </span>
          <span className="cursor-pointer underline" onClick={toggleVariant}>
            {" "}
            {variant === "LOGIN"
              ? "New to messenger ?"
              : "Aleardy have an account ?"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
