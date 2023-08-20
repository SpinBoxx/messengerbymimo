import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  image: string;
}

export function ModalImage({ children, image }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 sm:max-w-[425px]">
        <Image
          src={image}
          height="288"
          width="288"
          alt="Image message"
          className="h-full w-full cursor-pointer object-cover "
        />
      </DialogContent>
    </Dialog>
  );
}
