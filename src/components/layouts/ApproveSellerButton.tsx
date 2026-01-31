"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveSeller } from "@/actions/admin.action";

export default function ApproveSellerButton({
  sellerUserId,
}: {
  sellerUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveSeller(sellerUserId);

      if (res?.success) {
        toast.success("Seller Approved ");
        router.refresh();
      } else {
        toast.error(res?.message || "Approval failed");
      }
    });
  };

  return (
    <Button
      onClick={handleApprove}
      disabled={isPending}
      className="
        bg-green-600 hover:bg-green-700 
        text-white 
        dark:bg-green-500 dark:hover:bg-green-600
        transition-colors duration-200
      "
    >
      {isPending ? "Approving..." : "Approve"}
    </Button>
  );
}
