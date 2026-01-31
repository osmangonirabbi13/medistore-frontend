"use client";

import { useMemo, useState } from "react";
import UserRow, { User } from "./UserRow";

export default function UsersClient({ initialUsers }: { initialUsers?: User[] }) {
  
  const [users, setUsers] = useState<User[]>(Array.isArray(initialUsers) ? initialUsers : []);

  const normalized = useMemo(() => {
    return users.map((u) => ({
      ...u,
      id: u.id ?? "",
      name: u.name ?? "Unknown user",
      isBanned: u.isBanned ?? u.banned ?? false,
    }));
  }, [users]);

  const handleUserUpdated = (updated: any) => {
    if (!updated?.id) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    );
  };

  if (!normalized.length) {
    return <div className="p-4 text-sm text-muted-foreground">No users found.</div>;
  }

  return (
    <div className="space-y-3">
      {normalized.map((u) => (
        <UserRow key={u.id} user={u} onUserUpdated={handleUserUpdated} />
      ))}
    </div>
  );
}
