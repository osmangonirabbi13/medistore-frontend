"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Medicine } from "@/types";


export default function ProductCard({ product }: { product: Medicine }) {
  const price = Number(product.price || 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-44 sm:h-48">
          <Image
            src={product.imageUrl || "/regi.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute left-2 top-2 flex gap-2">
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
            {product.stock <= 0 ? (
              <Badge variant="destructive">Out of stock</Badge>
            ) : (
              <Badge variant="outline">Stock: {product.stock}</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.manufacturer || "Unknown manufacturer"}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-semibold">৳ {price.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">
              {product.category?.name || "Uncategorized"}
            </div>
          </div>
        </div>

        {product.description ? (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        ) : null}

        {product.seller?.name ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Seller: <span className="font-medium">{product.seller.name}</span>
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
