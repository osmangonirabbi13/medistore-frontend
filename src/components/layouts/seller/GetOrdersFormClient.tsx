"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { getOrders, updateOrderStatus } from "@/actions/seller.action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderUser = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type OrderInfo = {
  id: string;
  placedAt?: string;
  user?: OrderUser | null;
};

type MedicineInfo = {
  name?: string | null;
};

type OrderItem = {
  id: string; // orderItemId
  status: string;
  order?: OrderInfo;
  medicine?: MedicineInfo;
};

const STATUS_OPTIONS = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const formatDT = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

export default function GetOrdersFormClient() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // ✅ modal states
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<OrderItem | null>(null);
  const [nextStatus, setNextStatus] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getOrders();

      if ((res as any)?.error) {
        toast.error((res as any)?.error?.message || "Failed to load orders");
        setItems([]);
        return;
      }

      const raw = (res as any)?.data?.data ?? (res as any)?.data ?? [];
      setItems(Array.isArray(raw) ? raw : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openUpdateModal = (item: OrderItem) => {
    setActiveItem(item);
    setNextStatus(item.status); // default current
    setOpen(true);
  };

  const saveStatus = () => {
    if (!activeItem) return;

    const prevItems = items;
    // optimistic update
    setItems((p) => p.map((x) => (x.id === activeItem.id ? { ...x, status: nextStatus } : x)));

    startTransition(async () => {
      const toastId = toast.loading("Updating status...");

      try {
        const res = await updateOrderStatus(activeItem.id, nextStatus);

        if ((res as any)?.error) {
          toast.error((res as any)?.error?.message || "Update failed", { id: toastId });
          setItems(prevItems); // rollback
          return;
        }

        if ((res as any)?.success === false) {
          toast.error((res as any)?.message || "Update failed", { id: toastId });
          setItems(prevItems); // rollback
          return;
        }

        toast.success("Status updated", { id: toastId });
        setOpen(false);
        setActiveItem(null);
      } catch {
        toast.error("Something went wrong", { id: toastId });
        setItems(prevItems); // rollback
      }
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Loading...</CardContent>
      </Card>
    );
  }

  if (!items.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">No orders found.</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Click update to change status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const buyer = item.order?.user;
          const medicineName = item.medicine?.name ?? "—";
          const placedAt = formatDT(item.order?.placedAt);

          return (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">{medicineName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Order: <span className="font-medium">{item.order?.id ?? "—"}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Placed: {placedAt}</p>
                    <p className="text-sm text-muted-foreground">
                      Buyer:{" "}
                      <span className="font-medium">
                        {buyer?.name || buyer?.email || "—"}
                      </span>
                    </p>
                    {buyer?.phone ? (
                      <p className="text-sm text-muted-foreground">Phone: {buyer.phone}</p>
                    ) : null}
                  </div>

                  <Badge variant="secondary" className="shrink-0">
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => openUpdateModal(item)}
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ✅ Update Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              OrderItem: <span className="font-medium">{activeItem?.id ?? "—"}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="text-sm font-medium">Select Status</div>
            <Select value={nextStatus} onValueChange={setNextStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isPending || !nextStatus} onClick={saveStatus}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
