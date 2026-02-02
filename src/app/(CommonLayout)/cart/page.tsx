import { getCart } from "@/actions/order.action";
import CartClient from "@/components/layouts/CartClient";


export const dynamic = "force-dynamic";

const CartPage = async () => {
  let cartItems: any[] = [];

  try {
    const res = await getCart();
    if (res?.data) {
       cartItems = res.data.items || res.data.data?.items || [];
    }
  } catch (error) {
    console.error("Failed to load cart:", error);
  }

  return <CartClient initialItems={cartItems} />;
};

export default CartPage;