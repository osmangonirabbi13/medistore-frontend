import "better-auth";
import "better-auth/client";

declare module "better-auth" {
  interface User {
    role?: "CUSTOMER" | "SELLER" | "ADMIN";
    phone?: string | null;
  }
}

declare module "better-auth/client" {
  interface User {
    role?: "CUSTOMER" | "SELLER" | "ADMIN";
    phone?: string | null;
  }
}