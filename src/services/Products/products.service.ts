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
 getAllProduct: async ({
  page,
  limit,
  search,
  sortBy,
  sortOrder,
}: {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const query = new URLSearchParams({
    page: page ?? "1",
    limit: limit ?? "12",
    ...(search && { search }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  const res = await fetch(`${API_URL}/api/medicines?${query}`, {
    cache: "no-store",
  });

  return res.json();
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
