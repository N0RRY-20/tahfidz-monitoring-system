import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  dailyRecords,
  santriProfiles,
  quranMeta,
} from "@/db/schema/tahfidz-schema";
import { eq, desc } from "drizzle-orm";

interface LastSetoranRecord {
  santriId: string;
  date: string;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
  colorStatus: "G" | "Y" | "R";
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all setoran for santris assigned to this guru
    const allSetoran = await db
      .select({
        santriId: dailyRecords.santriId,
        date: dailyRecords.date,
        type: dailyRecords.type,
        surahName: quranMeta.surahName,
        ayatStart: dailyRecords.ayatStart,
        ayatEnd: dailyRecords.ayatEnd,
        colorStatus: dailyRecords.colorStatus,
        createdAt: dailyRecords.createdAt,
      })
      .from(dailyRecords)
      .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
      .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
      .where(eq(santriProfiles.assignedGuruId, session.user.id))
      .orderBy(desc(dailyRecords.createdAt));

    // Separate into lastZiyadah and lastMurajaah per santri
    const result: {
      santriId: string;
      lastZiyadah: LastSetoranRecord | null;
      lastMurajaah: LastSetoranRecord | null;
    }[] = [];

    const santriMap = new Map<
      string,
      {
        lastZiyadah: LastSetoranRecord | null;
        lastMurajaah: LastSetoranRecord | null;
      }
    >();

    for (const record of allSetoran) {
      if (!santriMap.has(record.santriId)) {
        santriMap.set(record.santriId, {
          lastZiyadah: null,
          lastMurajaah: null,
        });
      }

      const data = santriMap.get(record.santriId)!;

      if (record.type === "ziyadah" && !data.lastZiyadah) {
        data.lastZiyadah = {
          santriId: record.santriId,
          date: record.date,
          surahName: record.surahName,
          ayatStart: record.ayatStart,
          ayatEnd: record.ayatEnd,
          colorStatus: record.colorStatus,
        };
      } else if (record.type === "murajaah" && !data.lastMurajaah) {
        data.lastMurajaah = {
          santriId: record.santriId,
          date: record.date,
          surahName: record.surahName,
          ayatStart: record.ayatStart,
          ayatEnd: record.ayatEnd,
          colorStatus: record.colorStatus,
        };
      }
    }

    santriMap.forEach((value, santriId) => {
      result.push({
        santriId,
        lastZiyadah: value.lastZiyadah,
        lastMurajaah: value.lastMurajaah,
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching last setoran:", error);
    return NextResponse.json(
      { error: "Failed to fetch last setoran data" },
      { status: 500 }
    );
  }
}
