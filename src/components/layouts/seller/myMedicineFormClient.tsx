"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { deleteMedicine, getAllMyMedicine, updateMedicine } from "@/actions/seller.action";

type Medicine = {
  id: string;
  name: string;
  manufacturer?: string | null;
  description?: string | null;
  otcNote?: string | null;
  price: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  categoryId?: string;
  category?: { name: string };
};

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(amount);

export default function MyMedicineFormClient() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();


  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);


  const [editValues, setEditValues] = useState({
    name: "",
    manufacturer: "",
    description: "",
    otcNote: "",
    price: "",
    stock: 0,
    imageUrl: "",
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllMyMedicine();

      if ((res as any)?.error) {
        toast.error((res as any)?.error?.message || "Failed to load medicines");
        setItems([]);
        return;
      }

      const raw = (res as any)?.data?.data ?? (res as any)?.data ?? [];
      setItems(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);


  const openDelete = (m: Medicine) => {
    setDeleteTarget(m);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    startTransition(async () => {
      const toastId = toast.loading("Deleting...");

      try {
        const res = await deleteMedicine(deleteTarget.id);

        if ((res as any)?.error) {
          toast.error((res as any)?.error?.message || "Delete failed", { id: toastId });
          return;
        }

        toast.success("Deleted", { id: toastId });
        setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
        setDeleteOpen(false);
        setDeleteTarget(null);
      } catch {
        toast.error("Something went wrong", { id: toastId });
      }
    });
  };


  const openEdit = (m: Medicine) => {
    setEditTarget(m);
    setEditValues({
      name: m.name ?? "",
      manufacturer: m.manufacturer ?? "",
      description: m.description ?? "",
      otcNote: m.otcNote ?? "",
      price: String(m.price ?? ""),
      stock: Number(m.stock ?? 0),
      imageUrl: m.imageUrl ?? "",
      isActive: Boolean(m.isActive),
    });
    setEditOpen(true);
  };

  const submitEdit = () => {
    if (!editTarget) return;

    
    const payload = {
      name: editValues.name.trim(),
      manufacturer: editValues.manufacturer.trim() ? editValues.manufacturer.trim() : null,
      description: editValues.description.trim() ? editValues.description.trim() : null,
      otcNote: editValues.otcNote.trim() ? editValues.otcNote.trim() : null,
      price: String(editValues.price),
      stock: Number(editValues.stock || 0),
      imageUrl: editValues.imageUrl.trim() ? editValues.imageUrl.trim() : null,
      isActive: Boolean(editValues.isActive),
    };

    startTransition(async () => {
      const toastId = toast.loading("Updating...");

      try {
        const res = await updateMedicine(editTarget.id, payload);

        if ((res as any)?.error) {
          toast.error((res as any)?.error?.message || "Update failed", { id: toastId });
          return;
        }

        toast.success("Updated", { id: toastId });

        
        setItems((prev) =>
          prev.map((x) => (x.id === editTarget.id ? { ...x, ...payload } as any : x))
        );

        setEditOpen(false);
        setEditTarget(null);
      } catch {
        toast.error("Something went wrong", { id: toastId });
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle>My Medicines</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Update or delete your medicines from here.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No medicines found</CardTitle>
            <CardDescription>Create your first medicine to see it here.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((m) => {
            const priceNum = Number(m.price || 0);

            return (
              <Card key={m.id} className="overflow-hidden">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{m.name}</CardTitle>
                      <CardDescription>
                        Category: <span className="font-medium">{m.category?.name ?? "—"}</span>
                      </CardDescription>
                    </div>

                    <Badge variant={m.isActive ? "default" : "secondary"}>
                      {m.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="rounded-md border px-3 py-2">
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">{formatBDT(priceNum)}</div>
                    </div>

                    <div className="rounded-md border px-3 py-2">
                      <div className="text-muted-foreground">Stock</div>
                      <div className="font-medium">{m.stock}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                   
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEdit(m)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Update
                    </Button>

                    
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={isPending}
                      onClick={() => openDelete(m)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete medicine?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{deleteTarget?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" disabled={isPending} onClick={confirmDelete}>
              {isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>Update your medicine info and save.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editValues.name}
                onChange={(e) => setEditValues((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Manufacturer</label>
              <Input
                value={editValues.manufacturer}
                onChange={(e) => setEditValues((p) => ({ ...p, manufacturer: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editValues.description}
                onChange={(e) => setEditValues((p) => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">OTC Note</label>
              <Textarea
                value={editValues.otcNote}
                onChange={(e) => setEditValues((p) => ({ ...p, otcNote: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  inputMode="decimal"
                  value={editValues.price}
                  onChange={(e) => setEditValues((p) => ({ ...p, price: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Stock</label>
                <Input
                  type="number"
                  min={0}
                  value={Number(editValues.stock || 0)}
                  onChange={(e) =>
                    setEditValues((p) => ({ ...p, stock: Number(e.target.value || 0) }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input
                value={editValues.imageUrl}
                onChange={(e) => setEditValues((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editValues.isActive}
                onChange={(e) => setEditValues((p) => ({ ...p, isActive: e.target.checked }))}
              />
              Active
            </label>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isPending} onClick={submitEdit}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
