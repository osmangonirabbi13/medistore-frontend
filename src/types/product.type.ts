export type Category = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Seller = {
  id: string;
  name: string;
};

export type Medicine = {
  id: string;
  sellerId: string;
  categoryId: string;

  name: string;
  manufacturer?: string | null;
  description?: string | null;
  otcNote?: string | null;

  price: string | number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;

  
  category?: Category | null;
  seller?: Seller | null;
};

export type MedicineCreatePayload = Omit<
  Medicine,
  "id" | "createdAt" | "updatedAt" | "category"
>;
