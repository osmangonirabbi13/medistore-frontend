"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Medicine } from "@/types";


type MedicineWithRelations = Medicine & {
  category?: { id: string; name: string } | null;
  seller?: { id: string; name: string } | null;
};

export default function ProductCard({
  product,
}: {
  product: MedicineWithRelations;
}) {
  const priceNumber =
    typeof product.price === "string"
      ? Number(product.price)
      : Number(product.price ?? 0);

  const price = Number.isFinite(priceNumber) ? priceNumber : 0;

  const imageSrc =
    product.imageUrl && product.imageUrl.trim().length > 0
      ? product.imageUrl
      : "/regi.png";

  const productName =
    product.name && product.name.trim().length > 0
      ? product.name
      : "Unnamed product";

  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock <= 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-44 w-full sm:h-48">
          <Image
            src={imageSrc}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
           
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target?.src && !target.src.includes("/regi.png")) {
                target.src = "/regi.png";
              }
            }}
          />

          <div className="absolute left-2 top-2 flex flex-wrap gap-2">
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>

            {isOutOfStock ? (
              <Badge variant="destructive">Out of stock</Badge>
            ) : (
              <Badge variant="outline">Stock: {stock}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 font-semibold leading-tight">
              {productName}
            </h3>

            <p className="line-clamp-1 text-sm text-muted-foreground">
              {product.manufacturer?.trim() || "Unknown manufacturer"}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-semibold">৳ {price.toFixed(2)}</div>

            <div className="text-xs text-muted-foreground">
              {product.category?.name?.trim() || "Uncategorized"}
            </div>
          </div>
        </div>

        {product.description?.trim() ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        ) : null}

        {product.seller?.name?.trim() ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Seller:{" "}
            <span className="font-medium">{product.seller.name}</span>
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild className="w-full" disabled={!product.id}>
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
