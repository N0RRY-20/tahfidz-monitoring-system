import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { dailyRecords, recordTags } from "@/db/schema/tahfidz-schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the record
    const record = await db
      .select()
      .from(dailyRecords)
      .where(
        and(
          eq(dailyRecords.id, id),
          eq(dailyRecords.guruId, session.user.id)
        )
      )
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // Check if within 24 hours
    const createdAt = new Date(record[0].createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: "Data tidak bisa dihapus karena sudah lebih dari 24 jam. Hubungi Admin untuk revisi." },
        { status: 403 }
      );
    }

    // Delete tags first (foreign key constraint)
    await db.delete(recordTags).where(eq(recordTags.recordId, id));

    // Delete record
    await db.delete(dailyRecords).where(eq(dailyRecords.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting setoran:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
