"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortByPrice() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "low") {
      params.set("sortBy", "price");
      params.set("sortOrder", "asc");
    } else if (value === "high") {
      params.set("sortBy", "price");
      params.set("sortOrder", "desc");
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      onChange={(e) => handleSort(e.target.value)}
      className="border rounded-md px-3 py-2 text-sm"
      defaultValue=""
    >
      <option value="">Sort By</option>
      <option value="low">Price: Low to High</option>
      <option value="high">Price: High to Low</option>
    </select>
  );
}
