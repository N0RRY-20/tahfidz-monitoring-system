import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { dailyRecords, recordTags, santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { santriId, type, surahId, ayatStart, ayatEnd, colorStatus, tagIds, notes } = body;

    // Validate required fields
    if (!santriId || !surahId || !ayatStart || !ayatEnd || !colorStatus || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate color status
    if (!["G", "Y", "R"].includes(colorStatus)) {
      return NextResponse.json(
        { error: "Invalid color status" },
        { status: 400 }
      );
    }

    // Validate type
    if (!["ziyadah", "murajaah"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    // Check if santri is assigned to this guru
    const santri = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.id, santriId))
      .limit(1);

    if (santri.length === 0) {
      return NextResponse.json(
        { error: "Santri not found" },
        { status: 404 }
      );
    }

    if (santri[0].assignedGuruId !== session.user.id) {
      return NextResponse.json(
        { error: "Santri is not assigned to you" },
        { status: 403 }
      );
    }

    // Create record
    const recordId = randomUUID();
    const today = new Date().toISOString().split("T")[0];

    await db.insert(dailyRecords).values({
      id: recordId,
      santriId,
      guruId: session.user.id,
      date: today,
      surahId,
      ayatStart,
      ayatEnd,
      colorStatus,
      type,
      notesText: notes || null,
    });

    // Insert tags if any
    if (tagIds && tagIds.length > 0) {
      await db.insert(recordTags).values(
        tagIds.map((tagId: string) => ({
          recordId,
          tagId,
        }))
      );
    }

    return NextResponse.json({ success: true, id: recordId });
  } catch (error) {
    console.error("Error creating setoran:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
