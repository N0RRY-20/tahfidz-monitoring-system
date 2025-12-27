import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  dailyRecords,
  santriProfiles,
  quranMeta,
} from "@/db/schema/tahfidz-schema";
import { eq, sql, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last setoran for each santri assigned to this guru
    const lastSetoranData = await db
      .select({
        santriId: dailyRecords.santriId,
        date: dailyRecords.date,
        surahName: quranMeta.surahName,
        colorStatus: dailyRecords.colorStatus,
      })
      .from(dailyRecords)
      .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
      .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
      .where(eq(santriProfiles.assignedGuruId, session.user.id))
      .orderBy(desc(dailyRecords.createdAt));

    // Get only the latest record for each santri
    const latestByStudent: Record<string, (typeof lastSetoranData)[0]> = {};
    for (const record of lastSetoranData) {
      if (!latestByStudent[record.santriId]) {
        latestByStudent[record.santriId] = record;
      }
    }

    return NextResponse.json(Object.values(latestByStudent));
  } catch (error) {
    console.error("Error fetching last setoran:", error);
    return NextResponse.json(
      { error: "Failed to fetch last setoran data" },
      { status: 500 }
    );
  }
}
