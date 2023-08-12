import getUsers from "@/actions/get-users";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";
import UsersList from "./components/user-list";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <Sidebar>
      <div className="h-full">
        <UsersList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
