import { env } from "@/env";

const API_URL = env.API_URL;

interface ServiceOptions {
  cache?: RequestCache;
  revalidate?: number;
}

export interface GetAllMedicineParams {
  page?: string;      
  limit?: string;
  search?: string;
  isActive?: string;  
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  skip?: string;     
}

export const productService = {
  getAllProduct: async function (
    params?: GetAllMedicineParams,
    options?: ServiceOptions,
  ) {
    try {
      const url = new URL(`${API_URL}/api/medicines`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          url.searchParams.set(key, String(value));
        });
      }

      const config: RequestInit = {
        cache: options?.cache,
        next: {
          tags: ["productPost"],
          ...(typeof options?.revalidate === "number"
            ? { revalidate: options.revalidate }
            : {}),
        },
      };

      const res = await fetch(url.toString(), config);
      const data = await res.json();

      if (!res.ok) {
        return {
          data: null,
          error: { message: data?.message || "Failed to fetch products" },
        };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
   getProductId: async function (id: string) {
    try {
      const res = await fetch(`${API_URL}/api/medicines/${id}`);

      const data = await res.json();

      return { data: data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
