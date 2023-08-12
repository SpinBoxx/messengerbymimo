"use client";

import useConversation from "@/hooks/use-conversation";
import useRoutes from "@/hooks/use-routes";
import MobileRoute from "./mobile-route";

export default function MobileFooter() {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) return null;

  return (
    <div className="fixed bottom-0 z-40 flex w-full items-center justify-between border-t bg-white lg:hidden">
      {routes.map((route) => (
        <MobileRoute
          key={route.href}
          href={route.href}
          label={route.label}
          icon={route.icon}
          active={route.active}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}
