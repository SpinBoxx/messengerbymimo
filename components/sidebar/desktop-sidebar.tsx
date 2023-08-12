"use client";

import useRoutes from "@/hooks/use-routes";
import { useState } from "react";
import DesktopRoute from "./desktop-route";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

interface Props {
  user: User;
}

export default function DesktopSidebar({ user }: Props) {
  const routes = useRoutes();
  const [open, setOpen] = useState(false);
  console.log({ user });

  return (
    <div className="hidden justify-between lg:fixed lg:inset-0 lg:left-0 lg:z-40 lg:flex lg:w-20 lg:flex-col lg:overflow-y-auto lg:border-r lg:bg-white lg:px-6 lg:pb-4">
      <nav className="mt-4 flex flex-col justify-between">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {routes.map((route) => (
            <DesktopRoute
              key={route.href}
              href={route.href}
              label={route.label}
              icon={route.icon}
              active={route.active}
              onClick={route.onClick}
            />
          ))}
        </ul>
      </nav>
      <nav className="mt-4 flex flex-col items-center justify-between">
        <div
          onClick={() => setOpen(true)}
          className="relative transition hover:cursor-pointer hover:opacity-75"
        >
          <Avatar className="relative">
            <AvatarImage src={user.image || "/images/user-ano.jpg"} />
            <AvatarFallback>{user.name?.at(0)}</AvatarFallback>
          </Avatar>
          <span className="absolute -right-0 top-0 h-3 w-3 rounded-full border border-white bg-green-500"></span>
        </div>
      </nav>
    </div>
  );
}
