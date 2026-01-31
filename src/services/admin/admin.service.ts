import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

export const adminService = {
  getAllUsers: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
          data: null,
        };
      }

      return data;
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || "Something went wrong",
        data: null,
      };
    }
  },
  getAdminStats : async function(){
    const cookieStore = await cookies();

     const res = await fetch(`${API_URL}/api/admin/stats`, {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
          data: null,
        };
      }

      return data;

  },
  getAllOrders : async function(){
    const cookieStore = await cookies();

     const res = await fetch(`${API_URL}/api/admin/orders`, {
        method: "GET",
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
          data: null,
        };
      }

      return data;

  }
  
};
