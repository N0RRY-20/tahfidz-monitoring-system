"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconDashboard,
  IconHistory,
  IconBook,
  Icon123,
} from "@tabler/icons-react";

import { AdminNavMain } from "@/components/admin-nav-main";
import { AdminNavUser } from "@/components/admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const guruNavMain = [
  {
    title: "Dashboard",
    url: "/guru",
    icon: IconDashboard,
  },
  {
    title: "Input Setoran",
    url: "/guru/input",
    icon: Icon123,
  },
  {
    title: "Riwayat Input",
    url: "/guru/riwayat",
    icon: IconHistory,
  },
];

interface GuruSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function GuruSidebar({ user, ...props }: GuruSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/guru">
                <IconBook className="!size-5" />
                <span className="text-base font-semibold">Panel Guru</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={guruNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
