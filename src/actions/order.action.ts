"use server"

import { AddToCartData, orderService } from "@/services/order/order.service";


export const addTOCart = async (data : AddToCartData) => {
  const res =  await orderService.addToCart(data);
  return res
};