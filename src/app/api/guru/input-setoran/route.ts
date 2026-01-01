import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  dailyRecords,
  recordTags,
  santriProfiles,
} from "@/db/schema/tahfidz-schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getJakartaDateString } from "@/lib/date";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      santriId,
      type,
      surahId,
      ayatStart,
      ayatEnd,
      colorStatus,
      tagIds,
      notes,
    } = body;

    // Validate required fields
    if (
      !santriId ||
      !surahId ||
      !ayatStart ||
      !ayatEnd ||
      !colorStatus ||
      !type
    ) {
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
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Check if santri is assigned to this guru
    const santri = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.id, santriId))
      .limit(1);

    if (santri.length === 0) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    if (santri[0].assignedGuruId !== session.user.id) {
      return NextResponse.json(
        { error: "Santri is not assigned to you" },
        { status: 403 }
      );
    }

    const today = getJakartaDateString();

    // Check if record already exists for this santri, type, and date
    const existingRecord = await db
      .select({
        id: dailyRecords.id,
        surahId: dailyRecords.surahId,
        ayatStart: dailyRecords.ayatStart,
        ayatEnd: dailyRecords.ayatEnd,
        notesText: dailyRecords.notesText,
      })
      .from(dailyRecords)
      .where(
        and(
          eq(dailyRecords.santriId, santriId),
          eq(dailyRecords.type, type),
          eq(dailyRecords.date, today)
        )
      )
      .limit(1);

    // MERGE/UPSERT LOGIC
    if (existingRecord.length > 0) {
      const existing = existingRecord[0];

      // Phase 1: Hanya support surat yang sama
      if (existing.surahId !== surahId) {
        return NextResponse.json(
          {
            error: `Santri sudah memiliki setoran ${
              type === "ziyadah" ? "Ziyadah" : "Murajaah"
            } hari ini dengan surat berbeda. Nyicil lintas surat belum didukung (akan hadir di Phase 2).`,
          },
          { status: 409 }
        );
      }

      // Merge logic: MIN ayatStart, MAX ayatEnd, gabung notes
      const mergedAyatStart = Math.min(existing.ayatStart, ayatStart);
      const mergedAyatEnd = Math.max(existing.ayatEnd, ayatEnd);

      // Gabung catatan (abaikan yang kosong/null)
      let mergedNotes: string | null = null;
      if (existing.notesText && notes) {
        mergedNotes = `${existing.notesText}\n${notes}`;
      } else if (existing.notesText) {
        mergedNotes = existing.notesText;
      } else if (notes) {
        mergedNotes = notes;
      }

      // Update existing record
      await db
        .update(dailyRecords)
        .set({
          ayatStart: mergedAyatStart,
          ayatEnd: mergedAyatEnd,
          colorStatus, // Warna terakhir
          notesText: mergedNotes,
        })
        .where(eq(dailyRecords.id, existing.id));

      // Update tags: hapus yang lama, masukkan yang baru
      await db.delete(recordTags).where(eq(recordTags.recordId, existing.id));
      if (tagIds && tagIds.length > 0) {
        await db.insert(recordTags).values(
          tagIds.map((tagId: string) => ({
            recordId: existing.id,
            tagId,
          }))
        );
      }

      return NextResponse.json({
        success: true,
        id: existing.id,
        merged: true,
        mergedRange: { ayatStart: mergedAyatStart, ayatEnd: mergedAyatEnd },
      });
    }

    // CREATE new record (belum ada hari ini)
    const recordId = randomUUID();

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

    return NextResponse.json({ success: true, id: recordId, merged: false });
  } catch (error) {
    console.error("Error creating setoran:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
