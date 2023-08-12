import React, { ReactNode } from "react";
import DesktopSidebar from "./desktop-sidebar";
import MobileFooter from "./mobile-footer";
import getCurrentUser from "@/actions/get-current-user";

interface Props {
  children: ReactNode;
}

export default async function Sidebar({ children }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full bg-slate-400">
      <DesktopSidebar user={currentUser!} />
      <MobileFooter />
      <main className="h-full lg:pl-20">{children}</main>
    </div>
  );
}
