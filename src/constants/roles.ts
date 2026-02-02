export const Roles = {
  admin: "ADMIN",
  seller: "SELLER",
  customer: "CUSTOMER",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
