export type CartItem = {
  id: string;
  quantity: number;
  isSelected: boolean;
  medicine: {
    id: string;
    name: string;
    price: string;
    imageUrl: string | null;
    stock: number;
    isActive: boolean;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
};

export  interface AddToCartData {
  userId: string;
  medicineId: string;
  quantity: number;
}