"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LogOut, Menu, CircleX, LayoutDashboard , ShoppingCart  } from "lucide-react";

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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: sessionData, isPending } = authClient.useSession();

 

  const user = sessionData?.user;
  const isLoggedIn = !!user;

  const role = user?.role; 
  
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
    } catch (e: any) {
      toast.error(e?.message || "Logout failed", { id: toastId });
    }
  };

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <header className="border-b bg-secondary w-full sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Mobile Toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md hover:bg-primary/10"
              aria-label="Toggle menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                <CircleX className="text-primary" size={20} />
              ) : (
                <Menu className="text-primary" size={20} />
              )}
            </button>

            <Link href="/" className="shrink-0">
              <div className="relative w-32 h-10 md:w-40 md:h-16">
                <Image
                  src="/medi-logo.png"
                  alt="Medi Store Logo"
                  fill
                  priority
                  className="object-contain dark:hidden"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <Image
                  src="/medi-dark.png"
                  alt="Medi Store Logo Dark"
                  fill
                  priority
                  className="object-contain hidden dark:block"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-primary font-medium hover:opacity-80">
              Home
            </Link>
            <Link
              href="/products"
              className="text-primary font-medium hover:opacity-80"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-primary font-medium hover:opacity-80"
            >
              About Us
            </Link>
          </div>

          
          <nav className="flex items-center gap-2">
            <ModeToggle />

             <Link
    href="/cart"
    className="flex mr-2 items-center gap-1 text-primary font-medium hover:opacity-80"
  >
    <ShoppingCart className="h-5 w-5" />
    Cart
  </Link>

            {isPending ? null : isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button aria-label="Open account menu" type="button">
                    <Avatar>
                      <AvatarFallback className="text-lg font-bold bg-indigo-500 text-white cursor-pointer">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="min-w-52">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                 
                  <DropdownMenuItem asChild>
                    <Link href={accountLink} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {accountLabel}
                    </Link>
                  </DropdownMenuItem>

                  
                  {!isAdminOrSeller && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile/orders-details">Order Details</Link>
                      </DropdownMenuItem>
                      
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="text-red-500 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button
                  variant="outline"
                  className="rounded-full bg-primary text-secondary font-semibold hover:text-primary hover:bg-secondary hover:border-primary dark:text-primary cursor-pointer"
                >
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pb-4 pt-2 flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-primary font-medium hover:bg-primary/10"
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-primary font-medium hover:bg-primary/10"
            >
              Products
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-primary font-medium hover:bg-primary/10"
            >
              About Us
            </Link>

            {/* Mobile login button (only when logged out) */}
            {!isPending && !isLoggedIn && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="sm:hidden"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-primary text-secondary font-semibold"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile quick link for logged in user */}
            {!isPending && isLoggedIn && (
              <Link
                href={accountLink}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-primary font-medium hover:bg-primary/10 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                {accountLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <button
          className="md:hidden fixed inset-0 top-16 bg-black/20"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu overlay"
          type="button"
        />
      )}
    </header>
  );
}