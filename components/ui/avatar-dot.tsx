"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import useActiveList from "@/hooks/user-active-list";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";

type AvatarDotProps = {
  user: User;
} & React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

const AvatarDot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarDotProps
>(({ className, user, ...props }, ref) => {
  const { members } = useActiveList();

  const isActive = members.indexOf(user?.email!) !== -1;
  return (
    <div className="relative">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
      {isActive && (
        <span className="absolute -right-0 -top-0.5 h-3 w-3 rounded-full border border-white bg-green-500"></span>
      )}
    </div>
  );
});
AvatarDot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarDot, AvatarImage, AvatarFallback };
