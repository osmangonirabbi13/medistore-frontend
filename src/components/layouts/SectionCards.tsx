import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Pill,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAdminStats } from "@/actions/admin.action";

export async function SectionCards() {
  const res = await getAdminStats();
  const stats = res?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Total Sales */}
      <Card>
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <DollarSign className="size-5 text-primary" />
            ৳{Number(stats?.totalSales || 0)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-4" />
              Revenue
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Total completed sales
        </CardFooter>
      </Card>

      {/* Total Orders */}
      <Card>
        <CardHeader>
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            {stats?.totalOrders || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-4" />
              Orders
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Recent Orders: {stats?.recentOrders?.length || 0}
        </CardFooter>
      </Card>

      {/* Total Users */}
      <Card>
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Users className="size-5 text-primary" />
            {stats?.totalUsers || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-4" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Active: {stats?.activeUsers || 0} | Banned: {stats?.bannedUsers || 0}
        </CardFooter>
      </Card>

      {/* Total Medicines */}
      <Card>
        <CardHeader>
          <CardDescription>Total Medicines</CardDescription>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Pill className="size-5 text-primary" />
            {stats?.totalMedicines || 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-4" />
              Products
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Categories: {stats?.totalCategories || 0}
        </CardFooter>
      </Card>
    </div>
  );
}
