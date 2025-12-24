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
  FileInput,
  History,
} from "lucide-react";

function GuruSidebar() {
  return (
    <aside className="w-64 bg-emerald-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Panel Guru</h1>
        <p className="text-emerald-300 text-sm">Guru Tahfidz</p>
      </div>
      <nav className="space-y-2 flex-1">
        <Link
          href="/guru"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/guru/input"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <FileInput className="h-5 w-5" />
          Input Setoran
        </Link>
        <Link
          href="/guru/riwayat"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <History className="h-5 w-5" />
          Riwayat Input
        </Link>
      </nav>
      <div className="border-t border-emerald-800 pt-4">
        <LogoutButton className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-200" />
      </div>
    </aside>
  );
}

// Mobile Bottom Navigation
function GuruMobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-emerald-900 text-white flex justify-around py-3 z-50 border-t border-emerald-800">
      <Link href="/guru" className="flex flex-col items-center gap-1 px-4">
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/guru/input" className="flex flex-col items-center gap-1 px-4">
        <FileInput className="h-6 w-6" />
        <span className="text-xs">Input</span>
      </Link>
      <Link href="/guru/riwayat" className="flex flex-col items-center gap-1 px-4">
        <History className="h-6 w-6" />
        <span className="text-xs">Riwayat</span>
      </Link>
    </nav>
  );
}

export default async function GuruLayout({
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

  // Check if user is guru or admin
  const isGuru = userRoles.some((r) => r.roleName === "guru");
  const isAdmin = userRoles.some((r) => r.roleName === "admin");

  if (!isGuru && !isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <GuruSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-slate-50 pb-20 md:pb-6">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <GuruMobileNav />
    </div>
  );
}
