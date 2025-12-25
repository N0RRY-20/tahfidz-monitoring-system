"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconDashboard,
  IconUsers,
  IconSchool,
  IconUserPlus,
  IconLink,
  IconTags,
  IconReportAnalytics,
  IconSettings,
  IconBook,
  IconUserCheck,
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

const adminNavMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconDashboard,
  },
  {
    title: "Kelola User",
    url: "/admin/users",
    icon: IconUserCheck,
  },
  {
    title: "Kelola Guru",
    url: "/admin/guru",
    icon: IconUsers,
  },
  {
    title: "Kelola Santri",
    url: "/admin/santri",
    icon: IconSchool,
  },
  {
    title: "Kelola Kelas",
    url: "/admin/kelas",
    icon: IconUserPlus,
  },
  {
    title: "Mapping Santri",
    url: "/admin/mapping",
    icon: IconLink,
  },
  {
    title: "Bank Komentar",
    url: "/admin/tags",
    icon: IconTags,
  },
  {
    title: "Laporan",
    url: "/admin/reports",
    icon: IconReportAnalytics,
  },
  {
    title: "Pengaturan",
    url: "/admin/settings",
    icon: IconSettings,
  },
];

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <IconBook className="!size-5" />
                <span className="text-base font-semibold">SIM-Tahfidz</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={adminNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
