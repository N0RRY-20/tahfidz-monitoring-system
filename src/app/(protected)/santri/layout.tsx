import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userRole, role } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { SantriHeader } from "./partials/santri-header";

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

  if (!isSantri) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SantriHeader userName={session.user.name || undefined} />

      {/* Main Content - with padding top for fixed header */}
      <main className="pt-20 px-4 pb-6 md:px-6 lg:px-8 max-w-6xl mx-auto">
        {children}
      </main>
    </div>
  );
}
