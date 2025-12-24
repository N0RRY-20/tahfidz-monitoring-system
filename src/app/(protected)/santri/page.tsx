import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles, dailyRecords, quranMeta, classes } from "@/db/schema/tahfidz-schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, TrendingUp, Calendar } from "lucide-react";

// Get color class based on status
function getColorClass(status: string | null) {
  switch (status) {
    case "G":
      return "bg-green-500";
    case "Y":
      return "bg-yellow-500";
    case "R":
      return "bg-red-500";
    default:
      return "bg-gray-300";
  }
}

// Get status label
function getStatusLabel(status: string | null) {
  switch (status) {
    case "G":
      return "Mutqin";
    case "Y":
      return "Jayyid";
    case "R":
      return "Rasib";
    default:
      return "Belum";
  }
}

export default async function SantriDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  // Get santri profile with class name
  const santri = await db
    .select({
      id: santriProfiles.id,
      userId: santriProfiles.userId,
      fullName: santriProfiles.fullName,
      classId: santriProfiles.classId,
      className: classes.name,
      assignedGuruId: santriProfiles.assignedGuruId,
    })
    .from(santriProfiles)
    .leftJoin(classes, eq(santriProfiles.classId, classes.id))
    .where(eq(santriProfiles.userId, session.user.id))
    .limit(1);

  if (santri.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Assalamu&apos;alaikum, {session.user.name}
          </h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            Profil santri belum dibuat. Hubungi Admin.
          </CardContent>
        </Card>
      </div>
    );
  }

  const santriData = santri[0];

  // Get all records for this santri
  const records = await db
    .select({
      surahId: dailyRecords.surahId,
      colorStatus: dailyRecords.colorStatus,
      date: dailyRecords.date,
      ayatStart: dailyRecords.ayatStart,
      ayatEnd: dailyRecords.ayatEnd,
    })
    .from(dailyRecords)
    .where(eq(dailyRecords.santriId, santriData.id))
    .orderBy(desc(dailyRecords.date));

  // Get all surahs
  const surahs = await db.select().from(quranMeta).orderBy(quranMeta.id);

  // Calculate status per surah (based on latest record)
  const surahStatusMap = new Map<number, string>();
  records.forEach((record) => {
    if (!surahStatusMap.has(record.surahId)) {
      surahStatusMap.set(record.surahId, record.colorStatus);
    }
  });

  // Group surahs by Juz
  const juzMap = new Map<number, typeof surahs>();
  surahs.forEach((surah) => {
    if (!juzMap.has(surah.juzNumber)) {
      juzMap.set(surah.juzNumber, []);
    }
    juzMap.get(surah.juzNumber)?.push(surah);
  });

  // Calculate juz status (lowest status of all surahs in juz)
  const getJuzStatus = (juzNumber: number) => {
    const juzSurahs = juzMap.get(juzNumber) || [];
    let hasRed = false;
    let hasYellow = false;
    let hasGreen = false;

    juzSurahs.forEach((surah) => {
      const status = surahStatusMap.get(surah.id);
      if (status === "R") hasRed = true;
      else if (status === "Y") hasYellow = true;
      else if (status === "G") hasGreen = true;
    });

    if (hasRed) return "R";
    if (hasYellow) return "Y";
    if (hasGreen) return "G";
    return null;
  };

  // Calculate total ayat memorized
  const totalAyat = records.reduce((sum, r) => sum + (r.ayatEnd - r.ayatStart + 1), 0);

  // Calculate total surahs with green status
  const greenSurahs = Array.from(surahStatusMap.values()).filter((s) => s === "G").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Assalamu&apos;alaikum, {santriData.fullName}
        </h1>
        <p className="text-slate-600">Kelas: {santriData.className || "-"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">Kali setoran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ayat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAyat}</div>
            <p className="text-xs text-muted-foreground">Ayat disetor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surat Mutqin</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{greenSurahs}</div>
            <p className="text-xs text-muted-foreground">Dari 114 surat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((greenSurahs / 114) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Menuju Khatam</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Juz */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Heatmap Juz 1-30</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const status = getJuzStatus(juz);
            return (
              <Link
                key={juz}
                href={`/santri/logbook?juz=${juz}`}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg ${getColorClass(
                  status
                )} hover:opacity-80 transition-opacity text-white font-medium`}
              >
                <span className="text-lg">{juz}</span>
                <span className="text-[10px]">{getStatusLabel(status)}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span>Mutqin (Hijau)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500"></div>
          <span>Jayyid (Kuning)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span>Rasib (Merah)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-300"></div>
          <span>Belum Disetor</span>
        </div>
      </div>

      {/* Recent Records */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Setoran Terakhir</h2>
        {records.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              Belum ada riwayat setoran.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {records.slice(0, 5).map((record, idx) => {
              const surah = surahs.find((s) => s.id === record.surahId);
              return (
                <Card key={idx}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{surah?.surahName}</p>
                      <p className="text-sm text-slate-500">
                        Ayat {record.ayatStart} - {record.ayatEnd}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{record.date}</span>
                      <div
                        className={`w-8 h-8 rounded-full ${getColorClass(
                          record.colorStatus
                        )} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {record.colorStatus}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
