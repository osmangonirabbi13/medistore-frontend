import { getCart } from "@/actions/order.action";
import CartClient from "@/components/layouts/CartClient";

const CartPage = async () => {
  const res = await getCart();

  

  if (res?.error) {
    console.log("getCart error:", res.error);
  }

  const cart = (res as any)?.data?.data; 
  const cartItems = cart?.items;

 
  return <CartClient initialItems={cartItems} />;
};

export default CartPage;
