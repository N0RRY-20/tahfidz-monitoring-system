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
  BookOpen,
  User,
} from "lucide-react";

function SantriSidebar() {
  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Panel Wali Santri</h1>
        <p className="text-blue-300 text-sm">Monitoring Hafalan</p>
      </div>
      <nav className="space-y-2 flex-1">
        <Link
          href="/santri"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/santri/logbook"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <BookOpen className="h-5 w-5" />
          Logbook
        </Link>
        <Link
          href="/santri/profil"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
        >
          <User className="h-5 w-5" />
          Profil & Grafik
        </Link>
      </nav>
      <div className="border-t border-blue-800 pt-4">
        <LogoutButton className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-red-200" />
      </div>
    </aside>
  );
}

// Mobile Bottom Navigation
function SantriMobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-900 text-white flex justify-around py-3 z-50 border-t border-blue-800">
      <Link href="/santri" className="flex flex-col items-center gap-1 px-4">
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-xs">Dashboard</span>
      </Link>
      <Link href="/santri/logbook" className="flex flex-col items-center gap-1 px-4">
        <BookOpen className="h-6 w-6" />
        <span className="text-xs">Logbook</span>
      </Link>
      <Link href="/santri/profil" className="flex flex-col items-center gap-1 px-4">
        <User className="h-6 w-6" />
        <span className="text-xs">Profil</span>
      </Link>
    </nav>
  );
}

export default async function SantriLayout({
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

  // Check if user is santri or admin
  const isSantri = userRoles.some((r) => r.roleName === "santri");
  const isAdmin = userRoles.some((r) => r.roleName === "admin");

  if (!isSantri && !isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SantriSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-slate-50 pb-20 md:pb-6">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <SantriMobileNav />
    </div>
  );
}
