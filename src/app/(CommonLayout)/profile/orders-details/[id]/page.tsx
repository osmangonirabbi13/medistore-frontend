import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderDetails } from "../../../../../actions/order.action";

type PageProps = {
  params: Promise<{ id: string }>;
};

const toNumber = (v: any) => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, ""); // "৳2" -> "2"
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default async function OrdersDetailsPage({ params }: PageProps) {
  const { id: orderId } = await params;

  const res = await getOrderDetails(orderId);

  if (!res?.success) {
    return (
      <div className="p-6">
        <div className="mb-4 text-red-600">
          Failed to load order: {res?.message || "Unknown error"}
        </div>
        <Link href="/profile/orders-details">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    );
  }

  const order = res.data;
  const items = order?.items ?? [];

  // backend থেকে string আসলে convert
  const subtotal = toNumber(order?.subtotal);
  const shippingFee = toNumber(order?.shippingFee);
  const total = toNumber(order?.total);

  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-semibold">Order Details</h1>

            <p className="text-sm text-gray-600 mt-1 break-all">
              Order ID: {order?.id}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge>{order?.status}</Badge>
              <Badge variant="secondary">{order?.paymentMethod}</Badge>

              <span className="text-sm text-gray-600">
                {order?.placedAt ? new Date(order.placedAt).toLocaleString() : ""}
              </span>
            </div>
          </div>

          <Link href="/profile/orders-details">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {/* Items Card */}
      <div className="bg-white rounded-lg shadow-sm border p-5">
        <h2 className="font-semibold mb-4">Items ({items.length})</h2>

        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-gray-500">No items found</div>
          ) : (
            items.map((it: any, idx: number) => {
              const img =
                it?.imageUrl ||
                it?.medicine?.imageUrl ||
                it?.medicine?.image ||
                "/placeholder.png";

              const name =
                it?.medicineName ||
                it?.medicine?.name ||
                it?.name ||
                "Unknown item";

              const qty = toNumber(it?.quantity ?? it?.qty ?? 1);

              // ✅ price possible fields
              const price = toNumber(
                it?.price ??
                  it?.unitPrice ??
                  it?.priceAtPurchase ??
                  it?.medicinePrice ??
                  it?.medicine?.price ??
                  0
              );

              const lineTotal = price * qty;

              const stableKey =
                it?.id || it?.medicineId || `${order?.id}-item-${idx}`;

              return (
                <div
                  key={stableKey}
                  className="flex items-center gap-4 border rounded-lg p-3"
                >
                  <Image
                    src={img}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {qty} • Price: ৳{price}
                    </div>
                  </div>

                  <div className="font-semibold whitespace-nowrap">
                    ৳{lineTotal}
                  </div>
                </div>
              );
            })
          )}
        </div>

        
        
      </div>

      {/* Summary + Shipping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-5">
          <h2 className="font-semibold mb-4">Payment Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>৳{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span>৳{shippingFee}</span>
            </div>

            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-lg shadow-sm border p-5">
          <h2 className="font-semibold mb-4">Shipping Info</h2>

          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Name</span>
              <span className="text-right">{order?.shippingName || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Phone</span>
              <span className="text-right">{order?.shippingPhone || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Address</span>
              <span className="text-right">
                {order?.shippingAddressLine1 || "-"}
                {order?.shippingAddressLine2
                  ? `, ${order.shippingAddressLine2}`
                  : ""}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">City</span>
              <span className="text-right">{order?.shippingCity || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Postal Code</span>
              <span className="text-right">{order?.shippingPostalCode || "-"}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Country</span>
              <span className="text-right">{order?.shippingCountry || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
