import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole, session, account } from "@/db/schema/auth-schema";
import { santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Unassign santri from this guru
    await db
      .update(santriProfiles)
      .set({ assignedGuruId: null })
      .where(eq(santriProfiles.assignedGuruId, id));

    // Delete user role
    await db.delete(userRole).where(eq(userRole.userId, id));

    // Delete sessions
    await db.delete(session).where(eq(session.userId, id));

    // Delete accounts
    await db.delete(account).where(eq(account.userId, id));

    // Delete user
    await db.delete(user).where(eq(user.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guru:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
