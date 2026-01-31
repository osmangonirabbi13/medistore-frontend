import { Route } from "@/types";

export const sellerRoutes: Route[] = [
  {
    title: "Seller Management",
    items: [
      {
        title: "Home",
        url: "/seller-dashboard",
      },
      {
        title: "Create Product",
        url: "/seller-dashboard/create-product",
      },
      {
        title: "Create Category",
        url: "/seller-dashboard/create-category",
      },
      {
        title: "My Medicine",
        url: "/seller-dashboard/my-medicines",
      },
      {
        title: "Get Orders",
        url: "/seller-dashboard/get-orders",
      },
    ],
  },
];
