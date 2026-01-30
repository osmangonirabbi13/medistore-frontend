import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyOrders } from "../../../../actions/order.action";

export default async function OrdersPage() {
  const res = await getMyOrders();

  if (!res?.success) {
    return (
      <div className="p-6">
        Failed to load orders: {res?.message || "Unknown error"}
      </div>
    );
  }

  const orders = res.data ?? [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and track all your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-gray-500">No orders found</div>
        ) : (
          orders.map((order: any) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Image
                    src={order.items?.[0]?.imageUrl || "/placeholder.png"}
                    alt="Product"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-md object-cover"
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{order.id}</h3>
                      <Badge>{order.status}</Badge>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 gap-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {order.placedAt
                          ? new Date(order.placedAt).toLocaleDateString()
                          : "-"}
                      </div>
                      <span>{order.items?.length ?? 0} items</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {order.items?.map((it: any) => it.medicineName).join(", ")}
                    </div>
                  </div>
                </div>

                <Link href={`/profile/orders-details/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
