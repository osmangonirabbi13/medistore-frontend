"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  updateQty as updateQtyAction,
  removeFromCart as removeFromCartAction,
} from "../../actions/order.action";

type ServerCartItem = {
  id: string; 
  quantity: number;
  isSelected: boolean;

  medicine: {
    id: string; 
    name: string;
    price: number | string;
    stock: number;
    imageUrl: string | null;
  };
};

type NormalizedCartItem = {
  id: string; 
  medicineId: string; 
  name: string;
  stock: number;
  price: number;
  qty: number;
  image: string;
};

export default function CartClient({
  initialItems,
}: {
  initialItems: ServerCartItem[];
}) {
  const normalizeItems = (data: ServerCartItem[]): NormalizedCartItem[] => {
    return (data || []).map((item) => ({
      id: item.id,
      medicineId: item.medicine?.id ?? "",
      name: item.medicine?.name ?? "Unknown Product",
      stock: Number(item.medicine?.stock ?? 0),
      price: Number(item.medicine?.price ?? 0),
      qty: Number(item.quantity ?? 1),
      image: item.medicine?.imageUrl ?? "/placeholder.png",
    }));
  };

  const [items, setItems] = useState<NormalizedCartItem[]>(
    normalizeItems(initialItems)
  );

  const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  const shippingCost = 120;

  const formatBDT = (amount: unknown) => {
    const value = Number(amount ?? 0);
    return `BDT ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );

  const discount = 0;
  const grandTotal = subtotal - discount + (items.length ? shippingCost : 0);

  
  const mutateQty = (cartItemId: string, action: "inc" | "dec") => {
    if (pendingMap[cartItemId]) return;

    startTransition(async () => {
      const prev = items.map((x) => ({ ...x }));
      const target = items.find((x) => x.id === cartItemId);
      if (!target) return;

      
      if (action === "inc" && target.stock > 0 && target.qty >= target.stock) {
        toast.error("Stock limit reached");
        return;
      }

      setPendingMap((m) => ({ ...m, [cartItemId]: true }));

     
      setItems((cur) => {
        const next = cur.map((it) => {
          if (it.id !== cartItemId) return it;
          const nextQty = action === "inc" ? it.qty + 1 : it.qty - 1;
          return { ...it, qty: nextQty };
        });

       
        return next.filter((it) => it.qty > 0);
      });

      const toastId = toast.loading("Updating quantity...");

      try {
        const res = await updateQtyAction(cartItemId, action);

        if (!res?.success) throw new Error(res?.message || "Failed to update");

        
        if (res?.data === null) {
          setItems((cur) => cur.filter((it) => it.id !== cartItemId));
        }

        toast.success(res?.message || "Quantity updated", { id: toastId });
      } catch (e: any) {
        setItems(prev);
        toast.error(e?.message || "Failed to update", { id: toastId });
      } finally {
        setPendingMap((m) => {
          const copy = { ...m };
          delete copy[cartItemId];
          return copy;
        });
      }
    });
  };

 
  const handleRemove = (cartItemId: string) => {
    if (pendingMap[cartItemId]) return;

    startTransition(async () => {
      const prev = items.map((x) => ({ ...x }));
      const target = items.find((x) => x.id === cartItemId);
      if (!target?.medicineId) return;

      setPendingMap((m) => ({ ...m, [cartItemId]: true }));

     
      setItems((cur) => cur.filter((it) => it.id !== cartItemId));

      const toastId = toast.loading("Removing item...");

      try {
        const res = await removeFromCartAction(target.medicineId);

        if (!res?.success) throw new Error(res?.message || "Failed to remove");

        toast.success("Removed from cart", { id: toastId });
      } catch (e: any) {
        setItems(prev);
        toast.error(e?.message || "Failed to remove", { id: toastId });
      } finally {
        setPendingMap((m) => {
          const copy = { ...m };
          delete copy[cartItemId];
          return copy;
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <section className="lg:col-span-7">
          <div className="rounded-2xl border bg-white dark:bg-background p-5">
            {items.length === 0 ? (
              <div className="py-14 text-center text-muted-foreground">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                  const itemPending = !!pendingMap[item.id];

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{item.name}</h3>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-semibold">
                              {formatBDT(item.price)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Quantity
                            </span>

                            <div className="flex items-center gap-2 rounded-full border px-2 py-1">
                              <button
                                type="button"
                                disabled={isPending || itemPending || item.qty <= 1}
                                onClick={() => mutateQty(item.id, "dec")}
                                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted disabled:opacity-50"
                              >
                                <Minus className="h-4 w-4" />
                              </button>

                              <span className="w-6 text-center font-semibold">
                                {item.qty}
                              </span>

                              <button
                                type="button"
                                disabled={
                                  isPending ||
                                  itemPending ||
                                  (item.stock > 0 && item.qty >= item.stock)
                                }
                                onClick={() => mutateQty(item.id, "inc")}
                                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted disabled:opacity-50"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              disabled={isPending || itemPending}
                              onClick={() => handleRemove(item.id)}
                              className="grid h-9 w-9 place-items-center rounded-full border text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border bg-white dark:bg-background p-5">
            <h3 className="text-xl font-semibold">Payment Details</h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatBDT(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-semibold">{formatBDT(discount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipment Cost</span>
                <span className="font-semibold">
                  {formatBDT(items.length ? shippingCost : 0)}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t flex items-center justify-between">
                <span className="text-muted-foreground">Grand Total</span>
                <span className="text-base font-bold">
                  {formatBDT(grandTotal)}
                </span>
              </div>

              <Link
                href="/checkout"
                className={`mt-4 block w-full text-center rounded-full py-3 font-semibold ${
                  items.length
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                }`}
              >
                Checkout
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
