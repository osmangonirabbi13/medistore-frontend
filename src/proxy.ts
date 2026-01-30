import { NextRequest, NextResponse } from "next/server";

import { Roles } from "./constants/roles";
import { userService } from "./services/user/user.service";

const ROLE_HOME: Record<string, string> = {
  [Roles.admin]: "/admin-dashboard",
  [Roles.seller]: "/seller-dashboard",
  [Roles.customer]: "/profile",
};

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/seller-dashboard") ||
    pathname.startsWith("/profile")
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

 
  if (!isProtectedPath(pathname)) return NextResponse.next();

  const { data } = await userService.getSession();

  if (!data?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = data.user.role;
  const home = ROLE_HOME[role] ?? "/profile"; 

  
  const isAdminArea = pathname.startsWith("/admin-dashboard");
  const isSellerArea = pathname.startsWith("/seller-dashboard");
  const isCustomerArea = pathname.startsWith("/profile");

  if (role === Roles.admin) {
    if (!isAdminArea) return NextResponse.redirect(new URL(home, request.url));
    return NextResponse.next();
  }

  if (role === Roles.seller) {
    if (!isSellerArea) return NextResponse.redirect(new URL(home, request.url));
    return NextResponse.next();
  }


  if (!isCustomerArea) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/seller-dashboard",
    "/seller-dashboard/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
