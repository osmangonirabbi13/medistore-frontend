export interface Medicine {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  manufacturer: string | null;
  description: string | null;
  otcNote: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
  };
}


export type MedicineCreatePayload = Omit<
  Medicine,
  "id" | "createdAt" | "updatedAt" | "category"
>;
