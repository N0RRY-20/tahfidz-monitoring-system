import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole, session, account } from "@/db/schema/auth-schema";
import { santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

// GET single guru
export async function GET(
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

    const guru = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (guru.length === 0) {
      return NextResponse.json({ error: "Guru not found" }, { status: 404 });
    }

    return NextResponse.json(guru[0]);
  } catch (error) {
    console.error("Error fetching guru:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH update guru
export async function PATCH(
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
    const body = await request.json();
    const { name, email, password } = body;

    // Check if guru exists
    const existingGuru = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (existingGuru.length === 0) {
      return NextResponse.json({ error: "Guru not found" }, { status: 404 });
    }

    // Build update object
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Update user
    await db.update(user).set(updateData).where(eq(user.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating guru:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE guru
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
