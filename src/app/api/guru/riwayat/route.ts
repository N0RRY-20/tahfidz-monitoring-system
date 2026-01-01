import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  dailyRecords,
  santriProfiles,
  quranMeta,
  recordTags,
  masterTags,
  classes,
} from "@/db/schema/tahfidz-schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { getJakartaDateString, getJakartaDateStringDaysAgo } from "@/lib/date";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get filter from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "7days";

    // Calculate date limit based on filter (using WIB timezone)
    let dateLimit: string;

    switch (filter) {
      case "today":
        dateLimit = getJakartaDateString();
        break;
      case "30days":
        dateLimit = getJakartaDateStringDaysAgo(30);
        break;
      case "7days":
      default:
        dateLimit = getJakartaDateStringDaysAgo(7);
        break;
    }

    const records = await db
      .select({
        id: dailyRecords.id,
        santriId: dailyRecords.santriId,
        surahId: dailyRecords.surahId,
        ayatStart: dailyRecords.ayatStart,
        ayatEnd: dailyRecords.ayatEnd,
        colorStatus: dailyRecords.colorStatus,
        type: dailyRecords.type,
        notes: dailyRecords.notesText,
        date: dailyRecords.date,
        createdAt: dailyRecords.createdAt,
        santriName: santriProfiles.fullName,
        santriClass: classes.name,
        surahName: quranMeta.surahName,
      })
      .from(dailyRecords)
      .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
      .leftJoin(classes, eq(santriProfiles.classId, classes.id))
      .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
      .where(
        and(
          eq(dailyRecords.guruId, session.user.id),
          gte(dailyRecords.date, dateLimit)
        )
      )
      .orderBy(desc(dailyRecords.createdAt));

    // Get tags for each record
    const recordIds = records.map((r) => r.id);
    const allTags =
      recordIds.length > 0
        ? await db
            .select({
              recordId: recordTags.recordId,
              tagText: masterTags.tagText,
            })
            .from(recordTags)
            .innerJoin(masterTags, eq(recordTags.tagId, masterTags.id))
        : [];

    // Map tags to records
    const tagsByRecord = allTags.reduce((acc, tag) => {
      if (!acc[tag.recordId]) {
        acc[tag.recordId] = [];
      }
      acc[tag.recordId].push(tag.tagText);
      return acc;
    }, {} as Record<string, string[]>);

    // Check if record can be edited (within 24 hours)
    const currentTime = new Date();
    const result = records.map((record) => {
      const createdAt = new Date(record.createdAt);
      const hoursDiff =
        (currentTime.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      const canEdit = hoursDiff <= 24;

      return {
        ...record,
        tags: tagsByRecord[record.id] || [],
        canEdit,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching riwayat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
