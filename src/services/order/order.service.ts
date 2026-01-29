import { env } from "@/env";
import { cookies } from "next/headers";

const API_URL = env.API_URL;


export interface AddToCartData {
  userId: string,
  medicineId: string,
  quantity: number ,
}

export const orderService = {
    addToCart : async function (addToCartData : AddToCartData) {
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
    }
}