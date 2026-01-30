import { redirect } from "next/navigation";

export default function sellerDashboard() {
  return redirect("/seller-dashboard/create-product");
}