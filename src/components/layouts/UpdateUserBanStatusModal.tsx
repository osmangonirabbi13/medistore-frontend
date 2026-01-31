"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserBanStatus } from "@/actions/admin.action";


export type ModalUser = {
  id: string;
  name: string;
  isBanned: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: ModalUser | null;
  onUpdated?: (updatedUser: any) => void; 
};

export default function UpdateUserBanStatusModal({
  open,
  onClose,
  user,
  onUpdated,
}: Props) {
  const [isPending, startTransition] = useTransition();

  if (!user) return null;

  const handleConfirm = () => {
    startTransition(async () => {
      const toastId = toast.loading("Updating user...");

      const res = await updateUserBanStatus(user.id, !user.isBanned);

      if (!res?.success) {
        toast.error(res?.message || "Failed", { id: toastId });
        return;
      }

      toast.success(
        `User ${!user.isBanned ? "banned" : "unbanned"} successfully`,
        { id: toastId }
      );

      
      onUpdated?.(res.data);

      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.isBanned ? "Unban User" : "Ban User"}</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground">
          Are you sure you want to{" "}
          <span className="font-semibold text-black">
            {user.isBanned ? "unban" : "ban"}
          </span>{" "}
          <span className="font-medium text-black">{user.name}</span>?
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>

          <Button
            variant={user.isBanned ? "secondary" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {user.isBanned ? "Unban" : "Ban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
