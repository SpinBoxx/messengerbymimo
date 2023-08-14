"use client";

import {
  AvatarDot,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar-dot";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  user: User;
}

export default function UserBox({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    axios
      .post("/api/conversations", {
        userId: user.id,
      })
      .then((response) => {
        router.push(`/conversations/${response.data.id}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, router]);

  return (
    <div
      onClick={handleClick}
      className="relative flex w-full items-center space-x-3 rounded-lg bg-white p-3 transition hover:cursor-pointer hover:bg-neutral-200"
    >
      <AvatarDot>
        <AvatarImage src={user.image || "/images/user-ano.jpg"} />
        <AvatarFallback>{user.name?.at(0)}</AvatarFallback>
      </AvatarDot>

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
