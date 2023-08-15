import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useConversation from "@/hooks/use-conversation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useState } from "react";
import { toast } from "react-hot-toast";

interface Props {
  children: ReactNode;
}

export function ConfirmDialog({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { conversationId } = useConversation();
  const onDelete = useCallback(() => {
    setLoading(true);
    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Can't delete conversation"))
      .finally(() => setLoading(false));
  }, [conversationId, router]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete conversation ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            conversation and remove all messages from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-slate-800 text-white hover:bg-slate-900 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={onDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
