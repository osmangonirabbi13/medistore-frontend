"use server"

import { adminService } from "@/services/admin/admin.service";

export const getAllUsers = async () => {
  return await adminService.getAllUsers();
};

export const getAdminStats = async () => {
  return await adminService.getAdminStats();
};
export const getAllOrders = async () => {
  return await adminService.getAllOrders();
};

export const updateUserBanStatus = async (id: string, isBanned: boolean) => {
  return await adminService.updateUserBanStatus(id, isBanned);
};



export const approveSeller = async (sellerUserId: string) => {
  return await adminService.approveSeller(sellerUserId);
};