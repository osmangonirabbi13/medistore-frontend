"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react"; 
import { useMemo, useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { removeFromCart, updateQty } from "@/actions/order.action";
import { useRouter } from "next/navigation";

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

type ActionType = "inc" | "dec" | "remove" | null;

export default function CartClient({
  initialItems,
}: {
  initialItems: ServerCartItem[];
}) {
  const router = useRouter();

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

  useEffect(() => {
    setItems(normalizeItems(initialItems));
  }, [initialItems]);

 
  const [pendingMap, setPendingMap] = useState<Record<string, ActionType>>({});
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

  const grandTotal = subtotal + (items.length ? shippingCost : 0);

  const mutateQty = (cartItemId: string, action: "inc" | "dec") => {
   
    if (pendingMap[cartItemId]) return;

    startTransition(async () => {
      const prevItems = [...items];
      
      const target = items.find((x) => x.id === cartItemId);
      if (!target) return;

      if (action === "inc" && target.stock > 0 && target.qty >= target.stock) {
        toast.error("Stock limit reached");
        return;
      }

   
      setPendingMap((m) => ({ ...m, [cartItemId]: action }));

      // Optimistic Update
      setItems((cur) => {
        return cur.map((it) => {
          if (it.id !== cartItemId) return it;
          const nextQty = action === "inc" ? it.qty + 1 : it.qty - 1;
          return { ...it, qty: nextQty };
        }).filter((it) => it.qty > 0);
      });

      try {
        const res = await updateQty(cartItemId, action);
        if (!res?.success) throw new Error(res?.message || "Failed to update");
        
        router.refresh(); 
      } catch (e: any) {
        setItems(prevItems);
        toast.error(e?.message || "Failed to update");
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
      const prevItems = [...items];
      const target = items.find((x) => x.id === cartItemId);
      if (!target?.medicineId) return;

      
      setPendingMap((m) => ({ ...m, [cartItemId]: "remove" }));

      setItems((cur) => cur.filter((it) => it.id !== cartItemId));

      const toastId = toast.loading("Removing item...");

      try {
        const res = await removeFromCart(target.medicineId); 
        if (!res?.success) throw new Error(res?.message || "Failed to remove");

        toast.success("Removed from cart", { id: toastId });
        router.refresh();
      } catch (e: any) {
        setItems(prevItems);
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
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
         <ShoppingBag className="w-6 h-6" /> Your Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          <div className="rounded-2xl border bg-white dark:bg-card p-5 shadow-sm">
            {items.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p>Your cart is currently empty.</p>
                <Link href="/" className="text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => {
                 
                  const currentAction = pendingMap[item.id]; 
                  const isItemBusy = !!currentAction; 

                  return (
                    <div key={item.id} className={`flex gap-4 ${isItemBusy ? "opacity-70" : ""}`}>
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold line-clamp-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                             Unit Price: {formatBDT(item.price)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
                          <div className="flex items-center gap-3 bg-muted/30 p-1 rounded-full border">
                            
                            <button
                              type="button"
                              disabled={isPending || item.qty <= 1 || isItemBusy}
                              onClick={() => mutateQty(item.id, "dec")}
                              className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50"
                            >
                           
                              {currentAction === "dec" ? (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                              ) : (
                                <Minus className="h-3 w-3" />
                              )}
                            </button>

                            <span className="w-8 text-center font-medium text-sm">
                              {item.qty}
                            </span>

                          
                            <button
                              type="button"
                              disabled={isPending || (item.stock > 0 && item.qty >= item.stock) || isItemBusy}
                              onClick={() => mutateQty(item.id, "inc")}
                              className="h-8 w-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50"
                            >
                             
                              {currentAction === "inc" ? (
                                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                              ) : (
                                <Plus className="h-3 w-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-lg">
                              {formatBDT(item.price * item.qty)}
                            </span>
                            
                            {/* REMOVE BUTTON */}
                            <button
                              type="button"
                              disabled={isPending || isItemBusy}
                              onClick={() => handleRemove(item.id)}
                              className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                              title="Remove Item"
                            >
                             
                              {currentAction === "remove" ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Trash2 className="h-5 w-5" />
                              )}
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

        {/* RIGHT SUMMARY */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border bg-white dark:bg-card p-6 shadow-sm sticky top-20">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatBDT(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className="font-medium">
                  {items.length ? formatBDT(shippingCost) : formatBDT(0)}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t flex justify-between items-center">
                <span className="text-base font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  {formatBDT(grandTotal)}
                </span>
              </div>

              <Link
                href={items.length ? "/checkout" : "#"}
                className={`mt-6 flex w-full items-center justify-center rounded-xl py-3.5 font-semibold text-white transition-all ${
                  items.length
                    ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                onClick={(e) => !items.length && e.preventDefault()}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}