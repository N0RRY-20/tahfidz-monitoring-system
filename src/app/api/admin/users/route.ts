import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole, role } from "@/db/schema/auth-schema";
import { eq, desc } from "drizzle-orm";

// GET all users with their roles
export async function GET() {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users with their roles
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt));

    // Get roles for each user
    const usersWithRoles = await Promise.all(
      users.map(async (u) => {
        const roles = await db
          .select({
            roleId: role.id,
            roleName: role.name,
          })
          .from(userRole)
          .innerJoin(role, eq(userRole.roleId, role.id))
          .where(eq(userRole.userId, u.id));

        return {
          ...u,
          roles: roles.map((r) => ({ id: r.roleId, name: r.roleName })),
        };
      })
    );

    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
