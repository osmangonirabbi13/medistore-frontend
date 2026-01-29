"use client"

import * as React from "react"


import { NavUser } from "@/components/layouts/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Roles } from "@/constants/roles"
import { adminRoutes } from "@/routes/adminRoutes"
import { sellerRoutes } from "@/routes/sellerRoutes"
import { Route } from "@/types"
import { House } from 'lucide-react';
import Link from "next/link"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  
  
}

export function AppSidebar({
  user,
  ...props
}: {
  user: { role: string } & React.ComponentProps<typeof Sidebar>;
}) {

  let routes: Route[] = [];

  switch (user.role) {
    case Roles.admin:
      routes = adminRoutes;
      break;
    case Roles.seller:
      routes = sellerRoutes;
      break;
    default:
      routes = [];
      break;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
               <Link href="/" className="flex items-center gap-2 font-medium">
            <div className=" flex size-6 items-center justify-center">
            </div>
            <button>
                <div className="flex justify-center gap-2  cursor-pointer outline-1 p-4  hover:bg-black hover:text-amber-50 dark:hover:bg-white dark:hover:text-black">
                    <div><House/></div>
                <div>Back To Home</div>
                </div>
                
            </button>
            
          </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
       <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
