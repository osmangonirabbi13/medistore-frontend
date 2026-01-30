"use server";

import { userService } from "@/services/user/user.service";

export const getMyProfile = async () => {
  return await userService.getMyProfile();
};


export const updateMyProfile = async (payload: {
  name: string;
  email: string;
  phone: string;
}) => {
  return await userService.updateMyProfile(payload);
};
