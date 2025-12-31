import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { dailyRecords } from "@/db/schema/tahfidz-schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
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
    const body = await request.json();
    const { colorStatus, notesText, ayatStart, ayatEnd } = body;

    // Verify ownership and get record
    const record = await db
      .select()
      .from(dailyRecords)
      .where(
        and(eq(dailyRecords.id, id), eq(dailyRecords.guruId, session.user.id))
      )
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check 24 hour limit
    const createdAt = new Date(record[0].createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json(
        { error: "Data tidak bisa diedit (lebih dari 24 jam)" },
        { status: 403 }
      );
    }

    // Validate colorStatus
    if (!["G", "Y", "R"].includes(colorStatus)) {
      return NextResponse.json(
        { error: "Status warna tidak valid" },
        { status: 400 }
      );
    }

    // Validate ayat range
    if (ayatStart !== undefined && ayatEnd !== undefined) {
      if (ayatStart < 1 || ayatEnd < ayatStart) {
        return NextResponse.json(
          { error: "Range ayat tidak valid" },
          { status: 400 }
        );
      }
    }

    await db
      .update(dailyRecords)
      .set({
        colorStatus,
        notesText: notesText || null,
        ...(ayatStart !== undefined && { ayatStart }),
        ...(ayatEnd !== undefined && { ayatEnd }),
      })
      .where(eq(dailyRecords.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
