"use server"

import { AddToCartData, orderService } from "@/services/order/order.service";
import { updateTag } from "next/cache";


export const addTOCart = async (data : AddToCartData) => {
  const res =  await orderService.addToCart(data);
   updateTag("cart")
  return res
};

export const getCart = async() =>{
    const res = await orderService.getCart()
    return res
}

export const updateQty = async (cartItemId: string, action: "inc" | "dec") => {
  return await orderService.updateQty(cartItemId, action);
};


export const removeFromCart = async (medicineId: string) => {
  return await orderService.removeFromCart(medicineId);
};