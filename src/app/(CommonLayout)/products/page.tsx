import ProductCard from "@/components/products/ProductCard";
import SortByPrice from "@/components/products/SortByPrice";
import PaginationControls from "@/components/ui/pagination-controls";
import { productService } from "@/services/Products/products.service";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page = params?.page ?? "1";
  const limit = params?.limit ?? "12";
  const search = params?.search ?? "";
  const sortBy = params?.sortBy ?? "createdAt";
  const sortOrder = params?.sortOrder ?? "desc";

  const res = await productService.getAllProduct({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  });

  const products = Array.isArray(res?.data) ? res.data : [];
  const pagination = res?.pagination;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Products</h1>

        
        <SortByPrice />
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <PaginationControls meta={pagination} />
    </div>
  );
}
