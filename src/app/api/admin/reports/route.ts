import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";
import { santriProfiles, dailyRecords, classes } from "@/db/schema/tahfidz-schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all santri profiles
    const santris = await db
      .select({
        id: santriProfiles.id,
        fullName: santriProfiles.fullName,
        classId: santriProfiles.classId,
        guruId: santriProfiles.assignedGuruId,
      })
      .from(santriProfiles);

    // Get guru names
    const guruIds = santris.map((s) => s.guruId).filter(Boolean) as string[];
    const gurus =
      guruIds.length > 0
        ? await db.select({ id: user.id, name: user.name }).from(user)
        : [];
    const guruMap = new Map(gurus.map((g) => [g.id, g.name]));

    // Get class names
    const classIds = santris.map((s) => s.classId).filter(Boolean) as string[];
    const allClasses =
      classIds.length > 0
        ? await db.select({ id: classes.id, name: classes.name }).from(classes)
        : [];
    const classMap = new Map(allClasses.map((c) => [c.id, c.name]));

    // Get aggregated records per santri
    const recordStats = await db
      .select({
        santriId: dailyRecords.santriId,
        totalSetoran: sql<number>`count(*)`,
        totalAyat: sql<number>`sum(${dailyRecords.ayatEnd} - ${dailyRecords.ayatStart} + 1)`,
        greenCount: sql<number>`sum(case when ${dailyRecords.colorStatus} = 'G' then 1 else 0 end)`,
        yellowCount: sql<number>`sum(case when ${dailyRecords.colorStatus} = 'Y' then 1 else 0 end)`,
        redCount: sql<number>`sum(case when ${dailyRecords.colorStatus} = 'R' then 1 else 0 end)`,
      })
      .from(dailyRecords)
      .groupBy(dailyRecords.santriId);

    const statsMap = new Map(
      recordStats.map((s) => [
        s.santriId,
        {
          totalSetoran: Number(s.totalSetoran),
          totalAyat: Number(s.totalAyat) || 0,
          greenCount: Number(s.greenCount),
          yellowCount: Number(s.yellowCount),
          redCount: Number(s.redCount),
        },
      ])
    );

    // Build report
    const report = santris.map((santri) => {
      const stats = statsMap.get(santri.id) || {
        totalSetoran: 0,
        totalAyat: 0,
        greenCount: 0,
        yellowCount: 0,
        redCount: 0,
      };

      return {
        santriId: santri.id,
        santriName: santri.fullName,
        classId: santri.classId,
        className: santri.classId ? classMap.get(santri.classId) || null : null,
        guruName: santri.guruId ? guruMap.get(santri.guruId) || null : null,
        ...stats,
      };
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
