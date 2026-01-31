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
  getAdminStats: async function () {
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
  getAllOrders: async function () {
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
  },

  updateUserBanStatus: async function (id: string, isBanned: boolean) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ isBanned }),
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

      return {
        success: true,
        message: data?.message || "User status updated",
        data: data?.data ?? null,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || "Something went wrong",
        data: null,
      };
    }
  },
  getSellerRequests: async (params: { status?: string }) => {
    try {
      const cookieStore = await cookies();

      const status = params.status ?? "PENDING";
      const res = await fetch(`${API_URL}/api/seller/requests?status=${status}`, {
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
          data: [],
        };
      }

      return data; 
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || "Something went wrong",
        data: [],
      };
    }
  },

  approveSeller: async (sellerUserId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/${sellerUserId}/approve`, {
        method: "PATCH",
        headers: {
          Cookie: cookieStore.toString(),
          "Content-Type": "application/json",
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
  }
};
