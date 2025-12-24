import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userRole, role } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Link2,
  Tags,
  FileText,
  Settings,
  School,
} from "lucide-react";

// Admin Sidebar Component
function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">SIM-Tahfidz</h1>
        <p className="text-slate-400 text-sm">Panel Admin</p>
      </div>
      <nav className="space-y-1 flex-1">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/admin/guru"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Users className="h-4 w-4" />
          Kelola Guru
        </Link>
        <Link
          href="/admin/santri"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <GraduationCap className="h-4 w-4" />
          Kelola Santri
        </Link>
        <Link
          href="/admin/kelas"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <School className="h-4 w-4" />
          Kelola Kelas
        </Link>
        <Link
          href="/admin/mapping"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Link2 className="h-4 w-4" />
          Mapping Santri
        </Link>
        <Link
          href="/admin/tags"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Tags className="h-4 w-4" />
          Bank Komentar
        </Link>
        <Link
          href="/admin/reports"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Laporan
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Settings className="h-4 w-4" />
          Pengaturan
        </Link>
      </nav>
      <div className="border-t border-slate-800 pt-4">
        <LogoutButton className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-red-200" />
      </div>
    </aside>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Get user's roles
  const userRoles = await db
    .select({
      roleName: role.name,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(eq(userRole.userId, session.user.id));

  // Check if user is admin
  const isAdmin = userRoles.some((r) => r.roleName === "admin");

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-slate-50">{children}</main>
    </div>
  );
}
