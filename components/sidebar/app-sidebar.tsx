"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconInnerShadowTop,
  IconForms,
} from "@tabler/icons-react";
import { NavServices } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "User",
      url: "/user",
      icon: IconDashboard,
    },
    {
      title: "Forms",
      url: "/forms",
      icon: IconForms,
    },
  ],
  services: [
    {
      name: "Contratação",
      url: "/user/contratacao",
      icon: IconDatabase,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavServices items={data.services} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  />
      </SidebarFooter>
    </Sidebar>
  );
}
