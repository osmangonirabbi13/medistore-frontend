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
      const cookieStore = await cookies();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      if (session === null) {
        return { data: null, error: { message: "Session is missing " } };
      }

      return { data: session, error: null };
    } catch (error) {
      console.error(error);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
  getMyProfile: async () => {
    const Cookie = await cookieHeader();

    const res = await fetch(`${API_URL}/api/profile/me`, {
      method: "GET",
      headers: { Cookie },
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
  updateMyProfile: async (payload: {
  name: string;
  email: string;
  phone: string;
}) => {
  try {
    const Cookie = await cookieHeader();

    const res = await fetch(`${API_URL}/api/profile/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie,
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
};
