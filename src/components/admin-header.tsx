"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Map pathname to page title
const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Kelola User",
  "/admin/guru": "Kelola Guru",
  "/admin/santri": "Kelola Santri",
  "/admin/kelas": "Kelola Kelas",
  "/admin/mapping": "Mapping Santri",
  "/admin/tags": "Bank Komentar",
  "/admin/reports": "Laporan",
  "/admin/settings": "Pengaturan",
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Admin Panel";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {/* Add any header actions here */}
        </div>
      </div>
    </header>
  );
}
