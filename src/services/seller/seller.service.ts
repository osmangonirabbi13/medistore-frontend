import { cookies } from "next/headers";
import { MedicineCreatePayload } from "./../../types/product.type";
import { env } from "@/env";

const API_URL = env.API_URL;

export interface CategoryData {
  name: string;
  description: string;
  isActive: boolean;
}

export const sellerService = {
  createMedicine: async function (medicineData: MedicineCreatePayload) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(medicineData),
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Post not created." },
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
  createCategory: async function (categoryDatas: CategoryData) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/categories/add-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(categoryDatas),
      });

      const data = await res.json();

      if (data.error) {
        return {
          data: null,
          error: { message: "Error: Category not created." },
        };
      }

      return { data: data, error: null };
    } catch (error) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
  getAllCategory: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.error) {
        return {
          data: null,
          error: { message: data?.message || "Error: Categories not fetched." },
        };
      }

      return { data, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error?.message || "Something Went Wrong" },
      };
    }
  },
  getAllMyMedicine: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/my-medicines`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      console.log(data);

      console.log(data);
      if (!res.ok) {
        return {
          data: null,
          error: {
            message: data?.message || `Request failed (${res.status})`,
            status: res.status,
            raw: data,
          },
        };
      }

      if (data?.success === false) {
        return {
          data: null,
          error: {
            message: data?.message || "Failed to fetch medicines",
            status: res.status,
            raw: data,
          },
        };
      }

      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
      };
    }
  },
  deleteMedicine: async function (medicineId: string) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/medicines/${medicineId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        return {
          data: null,
          error: { message: data?.message || "Delete failed" },
        };
      }

      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
      };
    }
  },
  updateMedicine: async function (id: string, payload: any) {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/medicines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        return {
          data: null,
          error: { message: data?.message || `Update failed (${res.status})` },
        };
      }

      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
      };
    }
  },
  getOrders: async function () {
    try {
      const cookieStore = await cookies();

      const res = await fetch(`${API_URL}/api/seller/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        return {
          data: null,
          error: {
            message: data?.message || `Request failed (${res.status})`,
          },
        };
      }

      return { data, error: null };
    } catch (e: any) {
      return {
        data: null,
        error: { message: e?.message || "Something went wrong" },
      };
    }
  },
  updateOrderStatus: async function (id: string, status: string) {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${API_URL}/api/seller/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return { data: null, error: { message: data?.message || `Update failed (${res.status})` } };
    }

    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: { message: e?.message || "Something went wrong" } };
  }
},
};
