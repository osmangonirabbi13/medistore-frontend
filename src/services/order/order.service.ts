import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export interface AddToCartData {
  userId: string;
  medicineId: string;
  quantity: number;
}

export const orderService = {
  getCart: async function (options?: ServiceOptions) {
    try {
      const cookieStore = await cookies();

      const config: RequestInit = {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: options?.cache,
        next: {
          tags: ["cart"],
          ...(typeof options?.revalidate === "number"
            ? { revalidate: options.revalidate }
            : {}),
        },
      };

      const res = await fetch(`${API_URL}/api/orders/cart`, config);
      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message || "Server error" },
        };
      }

      if (!data.success) {
        return { data: null, error: { message: data.message } };
      }

      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err?.message || "Something went wrong" },
      };
    }
  },

  addToCart: async function (addToCartData: AddToCartData) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(addToCartData),
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Post not created." },
        };
      }

      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

    updateQty: async (cartItemId: string, action: "inc" | "dec") => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/orders/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(), 
        },
        body: JSON.stringify({ action }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
        };
      }

      return data;
    } catch (e: any) {
      return { success: false, message: e?.message || "Something went wrong" };
    }
  },

  removeFromCart: async (medicineId: string) => {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/orders/remove-from-cart`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ medicineId }),
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        return {
          success: false,
          message: data?.message || `Request failed (${res.status})`,
        };
      }

      return data;
    } catch (e: any) {
      return { success: false, message: e?.message || "Something went wrong" };
    }
  },
};
