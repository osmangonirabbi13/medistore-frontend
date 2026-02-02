"use client";

import { addTOCart } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import { AddToCartData } from "@/services/order/order.service";
import { ShoppingCart, Minus, Plus, Loader2 } from "lucide-react"; // আইকন ইম্পোর্ট
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  medicineId: string;
  userId: string;
  stock: number; // ✅ Stock prop যোগ করা হয়েছে লিমিট চেক করার জন্য
  disabled?: boolean;
};

export default function AddToCartButton({ medicineId, userId, stock, disabled }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  
  // ✅ লোকাল কোয়ান্টিটি স্টেট (ডিফল্ট ১)
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // কোয়ান্টিটি বাড়ানো
  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Max stock limit reached");
    }
  };

  // কোয়ান্টিটি কমানো
  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Adding to cart...");

    // লগিন চেক দরকার নেই, সার্ভার একশনই হ্যান্ডেল করবে (আগের ফিক্স অনুযায়ী)
    const safeUserId = userId || "";

    const addData: AddToCartData = { 
        medicineId, 
        userId: safeUserId, 
        quantity: quantity // ✅ সিলেক্ট করা কোয়ান্টিটি পাঠানো হচ্ছে
    };

    try {
      const res = await addTOCart(addData);

      if ((res as any)?.error) {
        const errorMessage = (res as any).error.message || "";
        
        if (errorMessage.toLowerCase().includes("unauthorized") || errorMessage.includes("login")) {
             toast.dismiss(toastId);
             toast.error("Please login to add items");
             router.push(`/login?redirect=${pathname}`);
             return;
        }

        toast.error(errorMessage || "Failed to add to cart", { id: toastId });
        return;
      }

      toast.success(`${quantity} item(s) added to cart`, { id: toastId });
      router.refresh(); 
      // সফল হলে কোয়ান্টিটি আবার ১ এ রিসেট করতে পারেন
      setQuantity(1); 

    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Quantity Selector UI */}
      {!disabled && (
        <div className="flex items-center border rounded-md">
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1 || isLoading}
            className="p-3 hover:bg-muted disabled:opacity-50 transition-colors"
            type="button"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-10 text-center font-semibold">{quantity}</span>
          
          <button
            onClick={increaseQty}
            disabled={quantity >= stock || isLoading}
            className="p-3 hover:bg-muted disabled:opacity-50 transition-colors"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button 
        type="button" 
        onClick={handleAddToCart} 
        disabled={disabled || isLoading} 
        className="w-full md:w-auto min-w-35"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        Add to Cart
      </Button>
    </div>
  );
}