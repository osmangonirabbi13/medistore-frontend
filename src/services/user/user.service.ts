import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;
const API_URL = env.API_URL;

const cookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export const userService = {
  getSession: async function () {
    try {
      const cookie = await cookieHeader();

      if (!cookie) {
        return { data: null, error: { message: "No cookie" } };
      }

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookie,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null, error: { message: "Failed to fetch session" } };
      }

      const session = await res.json().catch(() => null);

      if (!session?.user) {
        return { data: null, error: { message: "Session missing user" } };
      }

      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  getMyProfile: async () => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/profile/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
          Origin: env.AUTH_URL,
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

  updateMyProfile: async (payload: { name?: string; phone?: string }) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/profile/me`, {
        method: "PATCH",
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

  becomeSeller: async (pharmacyName: string) => {
    try {
      const cookie = await cookieHeader();

      const res = await fetch(`${API_URL}/api/seller/become-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        body: JSON.stringify({ pharmacyName }),
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
