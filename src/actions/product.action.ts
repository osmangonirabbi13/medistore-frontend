"use server";

import { productService } from "@/services/Products/products.service";


export const getMedicine = async () => {
  return await  productService.getAllProduct();
};

