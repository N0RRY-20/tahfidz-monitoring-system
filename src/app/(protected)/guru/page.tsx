import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  santriProfiles,
  dailyRecords,
  classes,
  quranMeta,
} from "@/db/schema/tahfidz-schema";
import { eq, sql, and, gte, desc } from "drizzle-orm";
import { StatsCards } from "./partials/stats-cards";
import { SantriList } from "./partials/santri-list";

interface LastSetoranInfo {
  santriId: string;
  type: string;
  surahName: string;
  colorStatus: "G" | "Y" | "R";
  date: string;
}

export default async function GuruDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Get santri binaan (assigned to this guru) with class name
  const santriBinaan = await db
    .select({
      id: santriProfiles.id,
      fullName: santriProfiles.fullName,
      className: classes.name,
    })
    .from(santriProfiles)
    .leftJoin(classes, eq(santriProfiles.classId, classes.id))
    .where(eq(santriProfiles.assignedGuruId, session.user.id));

  // Get last setoran for all santri (both ziyadah and murajaah)
  const lastSetoranData = await db
    .select({
      santriId: dailyRecords.santriId,
      type: dailyRecords.type,
      surahName: quranMeta.surahName,
      colorStatus: dailyRecords.colorStatus,
      date: dailyRecords.date,
    })
    .from(dailyRecords)
    .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
    .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
    .where(eq(santriProfiles.assignedGuruId, session.user.id))
    .orderBy(desc(dailyRecords.createdAt));

  // Build map of last ziyadah and murajaah per santri
  const lastSetoranMap: Record<
    string,
    { ziyadah: LastSetoranInfo | null; murajaah: LastSetoranInfo | null }
  > = {};

  for (const record of lastSetoranData) {
    if (!lastSetoranMap[record.santriId]) {
      lastSetoranMap[record.santriId] = { ziyadah: null, murajaah: null };
    }
    const data = lastSetoranMap[record.santriId];
    if (record.type === "ziyadah" && !data.ziyadah) {
      data.ziyadah = record as LastSetoranInfo;
    } else if (record.type === "murajaah" && !data.murajaah) {
      data.murajaah = record as LastSetoranInfo;
    }
  }

  // Get today's date for filtering
  const today = new Date().toISOString().split("T")[0];

  // Get today's records count (separate ziyadah and murajaah)
  const todayZiyadah = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(dailyRecords)
    .where(
      and(
        eq(dailyRecords.guruId, session.user.id),
        eq(dailyRecords.date, today),
        eq(dailyRecords.type, "ziyadah")
      )
    );

  const todayMurajaah = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(dailyRecords)
    .where(
      and(
        eq(dailyRecords.guruId, session.user.id),
        eq(dailyRecords.date, today),
        eq(dailyRecords.type, "murajaah")
      )
    );

  // Get total records this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthStart = startOfMonth.toISOString().split("T")[0];

  const monthRecords = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(dailyRecords)
    .where(
      and(
        eq(dailyRecords.guruId, session.user.id),
        gte(dailyRecords.date, monthStart)
      )
    );

  // Prepare santri list data with last setoran
  const santriListData = santriBinaan.map((santri) => {
    const setoranInfo = lastSetoranMap[santri.id];
    return {
      id: santri.id,
      fullName: santri.fullName,
      className: santri.className,
      lastZiyadah: setoranInfo?.ziyadah
        ? {
            surahName: setoranInfo.ziyadah.surahName,
            colorStatus: setoranInfo.ziyadah.colorStatus,
          }
        : null,
      lastMurajaah: setoranInfo?.murajaah
        ? {
            surahName: setoranInfo.murajaah.surahName,
            colorStatus: setoranInfo.murajaah.colorStatus,
          }
        : null,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Assalamu&apos;alaikum, {session.user.name}
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di Panel Guru Tahfidz
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards
        santriCount={santriBinaan.length}
        todayZiyadah={Number(todayZiyadah[0]?.count || 0)}
        todayMurajaah={Number(todayMurajaah[0]?.count || 0)}
        monthTotal={Number(monthRecords[0]?.count || 0)}
      />

      {/* Santri List */}
      <SantriList santriList={santriListData} />
    </div>
  );
}
