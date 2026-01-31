"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import  UpdateUserBanStatusModal, { ModalUser } from "./UpdateUserBanStatusModal";

export type User = {
  id?: string;
  name?: string;
  email?: string;
  isBanned?: boolean;
  banned?: boolean; 
};

type Props = {
  user?: User;
  onUserUpdated?: (updated: any) => void;
};

export default function UserRow({ user, onUserUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ModalUser | null>(null);

  if (!user) return null;

 
  const id = user.id || "";
  const name = user.name ?? "Unknown user";
  const isBanned = !!(user.isBanned ?? user.banned);

  const handleUpdateClick = () => {
    if (!id) return;

    setSelectedUser({ id, name, isBanned });
    setOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <p className="font-medium">{name}</p>
          {user.email ? (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          ) : null}

          <p className="text-xs mt-1">
            Status:{" "}
            <span className={isBanned ? "text-red-600" : "text-green-600"}>
              {isBanned ? "Banned" : "Active"}
            </span>
          </p>
        </div>

        <Button variant="outline" onClick={handleUpdateClick} disabled={!id}>
          Update
        </Button>
      </div>

      <UpdateUserBanStatusModal
        open={open}
        onClose={() => setOpen(false)}
        user={selectedUser}
        onUpdated={onUserUpdated}
      />
    </>
  );
}
