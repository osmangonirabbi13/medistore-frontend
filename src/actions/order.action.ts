"use server";

import { AddToCartData, orderService } from "@/services/order/order.service";
import { updateTag } from "next/cache";


export const addTOCart = async (payload: AddToCartData) => {
  const res = await orderService.addToCart(payload);

  updateTag("cart")
  return res;
};

export const getCart = async () => {
  return await orderService.getCart({ cache: "no-store" });
};

export const updateQty = async (cartItemId: string, action: "inc" | "dec") => {
  const res = await orderService.updateQty(cartItemId, action);
   updateTag("cart")
  return res;
};

export const removeFromCart = async (medicineId: string) => {
  const res = await orderService.removeFromCart(medicineId);
   updateTag("cart")
  return res;
};

export const checkoutFromCart = async (payload: any) => {
  const res = await orderService.checkoutFromCart(payload);
  updateTag("cart")
  return res;
};

export const getMyOrders = async () => {
  return await orderService.getMyOrders();
};

export const getOrderDetails = async (orderId: string) => {
  return await orderService.getOrderDetails(orderId);
};
