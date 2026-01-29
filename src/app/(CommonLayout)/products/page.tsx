import ProductCard from "@/components/products/ProductCard";
import ProductFilters from "@/components/products/ProductFilters";
import PaginationControls from "@/components/ui/pagination-controls";
import { productService } from "@/services/Products/products.service";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
    limit: string;
    search: string;
  };
}) {
  const {page} =await  searchParams;
  const {limit} = await  searchParams;
  const {search} = await searchParams;
 
  const data = await productService.getAllProduct({
    page,
    limit,
    search,
    
});

  const products = data.data?.data || [];
  const pagination = data.data?.pagination || {
    limit,
    page,
    total: 0,
    totalPages: 1,
  };

  
  const categories = []; 

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">All Products</h1>
          <p className="text-sm text-muted-foreground">
            Browse medicines with search & filters.
          </p>
        </div>
      </div>

      {/* <ProductFilters categories={categories} /> */}

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

      <div className="pt-2">
        <PaginationControls meta={pagination} />
      </div>
    </div>
  );
}
