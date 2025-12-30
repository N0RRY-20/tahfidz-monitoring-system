import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  santriProfiles,
  dailyRecords,
  quranMeta,
  classes,
} from "@/db/schema/tahfidz-schema";
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
          <h1 className="text-2xl font-bold text-foreground">
            Assalamu&apos;alaikum, {session.user.name}
          </h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
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

  // Calculate juz status - juz hijau hanya jika SEMUA surat di juz sudah hijau
  const getJuzStatus = (juzNumber: number) => {
    const juzSurahs = juzMap.get(juzNumber) || [];
    if (juzSurahs.length === 0) return null;

    let allGreen = true;
    let hasAnyRecord = false;
    let hasRed = false;
    let hasYellow = false;

    juzSurahs.forEach((surah) => {
      const status = surahStatusMap.get(surah.id);
      if (status) {
        hasAnyRecord = true;
        if (status !== "G") allGreen = false;
        if (status === "R") hasRed = true;
        else if (status === "Y") hasYellow = true;
      } else {
        allGreen = false;
      }
    });

    if (!hasAnyRecord) return null;
    if (allGreen) return "G";
    if (hasRed) return "R";
    if (hasYellow) return "Y";
    return null;
  };

  // Calculate total ayat memorized
  const totalAyat = records.reduce(
    (sum, r) => sum + (r.ayatEnd - r.ayatStart + 1),
    0
  );

  // Calculate total surahs with green status
  const greenSurahs = Array.from(surahStatusMap.values()).filter(
    (s) => s === "G"
  ).length;

  // Calculate total surahs yang sudah pernah disetor
  const suratDisetor = surahStatusMap.size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Assalamu&apos;alaikum, {santriData.fullName}
        </h1>
        <p className="text-muted-foreground">
          Kelas: {santriData.className || "-"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Surat Disetor</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{suratDisetor}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Dari 114 surat</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Ayat</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalAyat}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Ayat disetor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Surat Mutqin</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {greenSurahs}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Hafalan lancar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {Math.round((greenSurahs / 114) * 100)}%
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Menuju Khatam</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Juz */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl">Heatmap Juz 1-30</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 md:gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
              const status = getJuzStatus(juz);
              const isGray = !status;
              return (
                <Link
                  key={juz}
                  href={`/santri/logbook?juz=${juz}`}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all
                    ${isGray 
                      ? "bg-muted border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 text-muted-foreground" 
                      : `${getColorClass(status)} text-white shadow-sm hover:shadow-md hover:scale-105`
                    }`}
                >
                  <span className="text-base md:text-lg font-semibold">{juz}</span>
                  <span className="text-[9px] md:text-[10px]">{getStatusLabel(status)}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-green-500"></div>
          <span>Mutqin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-yellow-500"></div>
          <span>Jayyid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-500"></div>
          <span>Rasib</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded border-2 border-dashed border-muted-foreground/30 bg-muted"></div>
          <span>Belum</span>
        </div>
      </div>

      {/* Recent Records */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg md:text-xl">Setoran Terakhir</CardTitle>
          {records.length > 5 && (
            <Link 
              href="/santri/logbook" 
              className="text-sm text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              Belum ada riwayat setoran.
            </div>
          ) : (
            <div className="space-y-2">
              {records.slice(0, 5).map((record, idx) => {
                const surah = surahs.find((s) => s.id === record.surahId);
                return (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${getColorClass(
                          record.colorStatus
                        )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                      >
                        {record.colorStatus}
                      </div>
                      <div>
                        <p className="font-medium text-sm md:text-base">{surah?.surahName}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Ayat {record.ayatStart} - {record.ayatEnd}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {record.date}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
