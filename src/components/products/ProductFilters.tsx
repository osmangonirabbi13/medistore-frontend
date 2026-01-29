"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryOption = { id: string; name: string };

export default function ProductFilters({
  categories = [],
}: {
  categories?: CategoryOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initial = useMemo(() => sp.get("search") ?? "", [sp]);
  const [search, setSearch] = useState(initial);

  const apply = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(sp.toString());

    Object.entries(updates).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });

    
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const onSearch = () => apply({ search: search.trim() || null });

  const clearAll = () => router.push(pathname);

  return (
    <div className="w-full rounded-lg border bg-background p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="flex w-full gap-2 lg:max-w-xl">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine by name or manufacturer..."
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          <Button onClick={onSearch}>Search</Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          {/* Category */}
          <Select
            defaultValue={sp.get("categoryId") ?? ""}
            onValueChange={(v) => apply({ categoryId: v || null })}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Active */}
          <Select
            defaultValue={sp.get("isActive") ?? ""}
            onValueChange={(v) => apply({ isActive: v || null })}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            defaultValue={sp.get("sortBy") ?? "createdAt"}
            onValueChange={(v) => apply({ sortBy: v })}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="isActive">Active</SelectItem>
            </SelectContent>
          </Select>

          {/* Order */}
          <Select
            defaultValue={sp.get("sortOrder") ?? "desc"}
            onValueChange={(v) => apply({ sortOrder: v })}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">DESC</SelectItem>
              <SelectItem value="asc">ASC</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
