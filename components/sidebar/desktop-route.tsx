"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

export default function DesktopRoute({
  label,
  icon: Icon,
  href,
  active,
  onClick,
}: Props) {
  const handleClick = () => {
    if (onClick) return onClick();
  };
  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          "groud flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-500 hover:bg-gray-100 hover:text-black",
          active && "bg-gray-300 text-black"
        )}
      >
        <Icon className="h-6 w-9 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}
