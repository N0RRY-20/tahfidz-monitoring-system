import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userRole, role } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
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

  // Check if user has no roles - redirect to onboarding
  if (userRoles.length === 0) {
    redirect("/onboarding");
  }

  // Check if user is admin - redirect to admin dashboard
  const isAdmin = userRoles.some((r) => r.roleName === "admin");
  if (isAdmin) {
    redirect("/admin");
  }

  // Check if user is guru - redirect to guru dashboard
  const isGuru = userRoles.some((r) => r.roleName === "guru");
  if (isGuru) {
    redirect("/guru");
  }

  // Check if user is santri/wali - redirect to santri dashboard
  const isSantri = userRoles.some((r) => r.roleName === "santri");
  if (isSantri) {
    redirect("/santri");
  }

  // For other roles, show the generic user dashboard
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          Welcome, {session.user.name}!
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-gray-600 dark:text-gray-300">
            Email: {session.user.email}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Roles: {userRoles.map((r) => r.roleName).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
