"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export default function SellerStatusTabs() {
  const router = useRouter();
  const sp = useSearchParams();

  const active = sp.get("status") || "PENDING";

  const setStatus = (status: string) => {
    const params = new URLSearchParams(sp.toString());
    params.set("status", status);
    params.set("page", "1"); 
    router.push(`?${params.toString()}`);
  };

  const getActiveStyle = (status: string) => {
    if (status === "PENDING")
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-900/60";
    if (status === "APPROVED")
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/60";
    if (status === "REJECTED")
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/60";
    return "";
  };

  return (
    <div className="flex gap-2">
      {STATUSES.map((s) => {
        const isActive = active === s;

        return (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={[
              "rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200",
              "border-gray-300 dark:border-gray-600",
              "bg-white dark:bg-gray-800",
              "text-gray-700 dark:text-gray-200",
              "hover:shadow-md",
              isActive && getActiveStyle(s),
            ].join(" ")}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
