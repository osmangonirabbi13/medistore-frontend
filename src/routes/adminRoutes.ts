import { Route } from "@/types";

export const adminRoutes: Route[] = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Home",
        url: "/admin-dashboard",
      },
      {
        title: "updateUserBanStatus",
        url: "/admin-dashboard/update-status",
      },
      
      
    ],
  },
];
