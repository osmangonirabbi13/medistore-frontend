"use server";

import { CategoryData, sellerService } from "@/services/seller/seller.service";
import { MedicineCreatePayload } from "@/types";


export const createMedicine = async (payload: MedicineCreatePayload) => {
  const res = await sellerService.createMedicine(payload);
  return res;
};

export const createCategory = async (CategoryDatas : CategoryData) =>{
    const res = await sellerService.createCategory(CategoryDatas)
    return res
}

export const getAllCategory = async () =>{
    const res = await sellerService.getAllCategory()
    return res
}

export const getAllMyMedicine = async () => {
  return await sellerService.getAllMyMedicine();
};