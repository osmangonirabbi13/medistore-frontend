import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

const cookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export interface AddToCartData {
  medicineId: string;
  userId: string;
  quantity: number;
}

export const orderService = {
  getCart: async (options?: ServiceOptions) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/cart`, {
        headers: { Cookie: cookie },
        cache: options?.cache ?? "no-store",
        next: {
          tags: ["cart"],
          ...(typeof options?.revalidate === "number"
            ? { revalidate: options.revalidate }
            : {}),
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message || `Request failed (${res.status})` },
        };
      }

      return { data: data.data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
      };
    }
  },

  addToCart: async (payload: AddToCartData) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message || `Request failed (${res.status})` },
          status: res.status,
        };
      }

      return { data, error: null, status: res.status };
    } catch (e: any) {
      console.error("Add to cart service error:", e);
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
        status: 500,
      };
    }
  },

  updateQty: async (cartItemId: string, action: "inc" | "dec") => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify({ action }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok)
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
        };

      return data;
    } catch (e: any) {
      return { success: false, message: e?.message || "Something went wrong" };
    }
  },

  removeFromCart: async (medicineId: string) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/${medicineId}`, {
        method: "DELETE",
        headers: { Cookie: cookie },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok)
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
        };

      return data;
    } catch (e: any) {
      return { success: false, message: e?.message || "Something went wrong" };
    }
  },

  checkoutFromCart: async (payload: any) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok)
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
        };

      return data;
    } catch (e: any) {
      return { success: false, message: e?.message || "Something went wrong" };
    }
  },

  getMyOrders: async () => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/my-orders`, {
        method: "GET",
        headers: { Cookie: cookie },
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

  getOrderDetails: async (orderId: string) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "GET",
        headers: { Cookie: cookie },
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
};
