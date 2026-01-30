import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { productService } from "@/services/Products/products.service";
import AddToCartButton from "@/components/layouts/AddToCartButton";
import { userService } from "@/services/user/user.service";

export default async function ProductDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await productService.getProductId(id);
  if (!res?.data?.data) notFound();

  const product = res.data.data;
  const price = Number(product.price || 0);
  const outOfStock = product.stock <= 0;

  
  const session = await userService.getSession(); 
  const userId = session?.data?.user?.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full h-80 md:h-125 rounded-lg overflow-hidden border">
          <Image
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.manufacturer}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge>{product.category?.name}</Badge>
            {product.isActive ? <Badge>Available</Badge> : <Badge variant="secondary">Inactive</Badge>}
          </div>

          <div className="text-2xl font-semibold text-primary">৳ {price.toFixed(2)}</div>

          <div className="text-sm text-muted-foreground">
            {outOfStock ? (
              <span className="text-red-500 font-medium">Out of Stock</span>
            ) : (
              <span>Stock Available: {product.stock}</span>
            )}
          </div>

          <AddToCartButton
            medicineId={product.id}
            userId={userId || ""}
            disabled={outOfStock || !product.isActive || !userId}
          />
        </div>
      </div>
    </div>
  );
}
