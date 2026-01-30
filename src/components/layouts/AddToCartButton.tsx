"use client";

import { addTOCart } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import { AddToCartData } from "@/services/order/order.service";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

type Props = {
  medicineId: string;
  userId: string;
  disabled?: boolean;
};

export default function AddToCartButton({ medicineId, userId, disabled }: Props) {
  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    const addData: AddToCartData = { medicineId, userId, quantity: 1 };
    const toastId = toast.loading("Adding to cart...");

    try {
      const res = await addTOCart(addData);

      if ((res as any)?.error) {
        toast.error((res as any).error || "Failed to add to cart", { id: toastId });
        return;
      }

      toast.success("Product added to cart", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to add product", { id: toastId });
    }
  };

  return (
    <Button type="button" onClick={handleAddToCart} disabled={disabled} className="w-full md:w-auto">
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  );
}
