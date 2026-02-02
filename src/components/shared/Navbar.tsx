"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  ShoppingBag, 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/layouts/ModeToggle";
import { authClient } from "@/lib/auth-client";
import { Roles } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type SessionUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: string;
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: sessionData, isPending } = authClient.useSession();

  const user = sessionData?.user as SessionUser | undefined;
  const isLoggedIn = !!user;

  const role = user?.role as string | undefined;

  // Role Based Links Logic
  const accountLink = useMemo(() => {
    if (!role) return "/profile";
    if (role === Roles.admin) return "/admin-dashboard";
    if (role === Roles.seller) return "/seller-dashboard";
    return "/profile";
  }, [role]);

  const accountLabel = useMemo(() => {
    if (!role) return "Profile";
    if (role === Roles.admin) return "Admin Dashboard";
    if (role === Roles.seller) return "Seller Dashboard";
    return "Profile";
  }, [role]);

  const isAdminOrSeller = role === Roles.admin || role === Roles.seller;

  const handleLogOut = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await authClient.signOut();
      toast.success("Logged out", { id: toastId });
      setIsMobileMenuOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Logout failed", { id: toastId });
    }
  };

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="border-b bg-background w-full sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md hover:bg-muted focus:outline-none"
              type="button"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link href="/" className="relative w-32 h-10 md:w-40 md:h-14">
              <Image
                src="/medi-logo.png"
                alt="Medi Store"
                fill
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/" label="Home" />
            <NavLink href="/products" label="Products" />
            <NavLink href="/about" label="About Us" />
          </div>

          {/* Right: Icons & Auth */}
          <nav className="flex items-center gap-2">
            <ModeToggle />

            <Link
              href="/cart"
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 hover:bg-muted",
                pathname === "/cart" && "bg-muted"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">Cart</span>
            </Link>

            {isPending ? null : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="rounded-full focus:outline-none">
                    <Avatar>
                      <AvatarFallback className="bg-indigo-500 text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={accountLink} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {accountLabel}
                    </Link>
                  </DropdownMenuItem>

                  {!isAdminOrSeller && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile/orders-details" className="cursor-pointer">
                          
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Order Details
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg z-40 animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 rounded-md hover:bg-muted transition-all",
                pathname === "/" && "bg-muted font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={cn(
                "px-3 py-2 rounded-md hover:bg-muted transition-all",
                pathname === "/products" && "bg-muted font-medium"
              )}
            >
              Products
            </Link>
            <Link
              href="/about"
              className={cn(
                "px-3 py-2 rounded-md hover:bg-muted transition-all",
                pathname === "/about" && "bg-muted font-medium"
              )}
            >
              About Us
            </Link>

            <div className="h-px bg-border my-2" />

            {!isPending && isLoggedIn && (
              <>
                <Link
                  href={accountLink}
                  className="px-3 py-2 rounded-md hover:bg-muted flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {accountLabel}
                </Link>

                {!isAdminOrSeller && (
                  <Link
                    href="/profile/orders-details"
                    className="px-3 py-2 rounded-md hover:bg-muted flex items-center gap-2"
                  >
                   
                    <ShoppingBag className="h-4 w-4" />
                    Order Details
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogOut}
                  className="px-3 py-2 rounded-md text-left hover:bg-red-50 text-red-500 flex items-center gap-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            )}

            {!isPending && !isLoggedIn && (
              <Link
                href="/login"
                className="px-3 py-2 rounded-md hover:bg-muted font-medium block text-center border"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}