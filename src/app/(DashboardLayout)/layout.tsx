import React from "react";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Roles } from "@/constants/roles";
import { userService } from "@/services/user/user.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DashboardLayoutProps = {
  children: React.ReactNode; 
  admin: React.ReactNode;
  seller: React.ReactNode;
};

export default async function DashboardLayout({
  admin,
  seller,
}: DashboardLayoutProps) {
  const { data, error } = await userService.getSession();

  if (!data?.user) {
 
    redirect("/login");
  }

  const userInfo = data.user;


  const role = userInfo?.role ?? Roles.customer;

  return (
    <SidebarProvider>
      <AppSidebar user={userInfo} />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard Management</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

       
        {role === Roles.admin ? admin : seller}
      </SidebarInset>
    </SidebarProvider>
  );
}
