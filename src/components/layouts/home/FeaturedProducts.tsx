import { productService } from "@/services/Products/products.service";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Product = {
  id?: string;
  _id?: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  price?: string | number | null;
  stock?: number | null;
  category?: {
    id: string;
    name: string;
  } | null;
  seller?: {
    id: string;
    name: string;
  } | null;
};

const FeaturedProducts = async () => {
  const res = await productService.getAllProduct({
    page: "1",
    limit: "6",
  });

  const products: Product[] = res?.data ?? [];

  return (
    <section className="bg-white/50 pt-12 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold md:text-3xl">Featured Medicines</h2>

          <Button asChild variant="outline">
            <Link href="/products">View All</Link>
          </Button>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="rounded-xl border bg-background p-8 text-center text-muted-foreground">
            No medicines found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, 6).map((product) => {
              const inStock = (product.stock ?? 0) > 0;
              const productId = product.id ?? product._id ?? "";
              const price =
                product.price === null || product.price === undefined
                  ? "—"
                  : String(product.price);

              return (
                <div
                  key={productId || product.name}
                  className="group flex h-full flex-col rounded-xl border bg-background p-4 shadow-sm transition hover:shadow-md"
                >
                  {/* Image (fixed height) */}
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                    <Image
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    />

                    {/* Stock badge */}
                    <div className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                      {inStock ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* Content (flex-grow যাতে height equal থাকে) */}
                  <div className="mt-4 flex flex-1 flex-col">
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    {product.category?.name ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Category: {product.category.name}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">Category: —</p>
                    )}

                    {/* Description (2 lines max) */}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {product.description || "No description available."}
                    </p>

                    {/* Price */}
                    <div className="mt-3 text-base font-bold text-primary">
                      ৳ {price}
                    </div>

                    {/* Action (always bottom) */}
                    <Button asChild className="mt-auto w-full">
                      <Link href={productId ? `/products/${productId}` : "/products"}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
