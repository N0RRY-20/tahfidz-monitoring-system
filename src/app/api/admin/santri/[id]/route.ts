import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole, session, account } from "@/db/schema/auth-schema";
import { santriProfiles, dailyRecords, recordTags } from "@/db/schema/tahfidz-schema";
import { eq, inArray } from "drizzle-orm";

export async function PUT(
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
    const { fullName, classId, assignedGuruId, dob } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "Nama santri wajib diisi" },
        { status: 400 }
      );
    }

    // Check if santri exists
    const santri = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.id, id))
      .limit(1);

    if (santri.length === 0) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    // Update santri profile
    await db
      .update(santriProfiles)
      .set({
        fullName,
        classId: classId || null,
        assignedGuruId: assignedGuruId || null,
        dob: dob || null,
        updatedAt: new Date(),
      })
      .where(eq(santriProfiles.id, id));

    // Update user name as well
    await db
      .update(user)
      .set({ name: fullName, updatedAt: new Date() })
      .where(eq(user.id, santri[0].userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating santri:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Get santri profile to find userId
    const santri = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.id, id))
      .limit(1);

    if (santri.length === 0) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    const userId = santri[0].userId;

    // Get all daily records for this santri
    const records = await db
      .select({ id: dailyRecords.id })
      .from(dailyRecords)
      .where(eq(dailyRecords.santriId, id));

    const recordIds = records.map((r) => r.id);

    // Delete record tags
    if (recordIds.length > 0) {
      await db.delete(recordTags).where(inArray(recordTags.recordId, recordIds));
    }

    // Delete daily records
    await db.delete(dailyRecords).where(eq(dailyRecords.santriId, id));

    // Delete santri profile
    await db.delete(santriProfiles).where(eq(santriProfiles.id, id));

    // Delete user data
    await db.delete(userRole).where(eq(userRole.userId, userId));
    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting santri:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
