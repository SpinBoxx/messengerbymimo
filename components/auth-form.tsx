"use client";

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
                    <Input placeholder="Enter your email here..." {...field} />
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
