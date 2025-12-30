import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  santriProfiles,
  dailyRecords,
  classes,
} from "@/db/schema/tahfidz-schema";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, TrendingUp } from "lucide-react";
import { ProfileCard } from "./partials/profile-card";
import { StatsCards } from "./partials/stats-cards";
import { ProgressChart } from "./partials/progress-chart";

export default async function ProfilPage() {
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
      fullName: santriProfiles.fullName,
      dob: santriProfiles.dob,
      className: classes.name,
      createdAt: santriProfiles.createdAt,
      guruName: user.name,
    })
    .from(santriProfiles)
    .leftJoin(user, eq(santriProfiles.assignedGuruId, user.id))
    .leftJoin(classes, eq(santriProfiles.classId, classes.id))
    .where(eq(santriProfiles.userId, session.user.id))
    .limit(1);

  if (santri.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Profil santri belum dibuat. Hubungi Admin.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const santriData = santri[0];

  // Get all records
  const records = await db
    .select({
      id: dailyRecords.id,
      date: dailyRecords.date,
      ayatStart: dailyRecords.ayatStart,
      ayatEnd: dailyRecords.ayatEnd,
      colorStatus: dailyRecords.colorStatus,
      surahId: dailyRecords.surahId,
    })
    .from(dailyRecords)
    .where(eq(dailyRecords.santriId, santriData.id))
    .orderBy(dailyRecords.date);

  // Calculate monthly progress for chart
  const monthlyData: Record<string, number> = {};
  records.forEach((record) => {
    const month = record.date.substring(0, 7); // YYYY-MM
    const ayatCount = record.ayatEnd - record.ayatStart + 1;
    monthlyData[month] = (monthlyData[month] || 0) + ayatCount;
  });

  // Convert to chart data (cumulative)
  const sortedMonths = Object.keys(monthlyData).sort();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const chartData = sortedMonths.reduce<{ month: string; ayat: number }[]>(
    (acc, month) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].ayat : 0;
      const newTotal = prevTotal + monthlyData[month];
      const [year, monthNum] = month.split("-");
      acc.push({
        month: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
        ayat: newTotal,
      });
      return acc;
    },
    []
  );

  // Calculate stats
  const totalAyat = records.reduce(
    (sum, r) => sum + (r.ayatEnd - r.ayatStart + 1),
    0
  );
  const totalSetoran = records.length;
  const greenRecords = records.filter((r) => r.colorStatus === "G").length;
  const yellowRecords = records.filter((r) => r.colorStatus === "Y").length;
  const redRecords = records.filter((r) => r.colorStatus === "R").length;

  // Estimate completion (total ayat in Quran = 6236)
  const totalQuranAyat = 6236;
  const progressPercent = Math.round((totalAyat / totalQuranAyat) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Profil Santri
        </h1>
        <p className="text-muted-foreground">Informasi dan statistik hafalan</p>
      </div>

      {/* Profile Card */}
      <ProfileCard
        fullName={santriData.fullName}
        className={santriData.className}
        guruName={santriData.guruName}
        dob={santriData.dob}
        createdAt={santriData.createdAt}
        progressPercent={progressPercent}
        totalAyat={totalAyat}
      />

      {/* Stats Cards */}
      <StatsCards
        totalSetoran={totalSetoran}
        totalAyat={totalAyat}
        greenRecords={greenRecords}
        yellowRecords={yellowRecords}
        redRecords={redRecords}
      />

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            Grafik Progress Hafalan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ProgressChart data={chartData} />
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada data untuk ditampilkan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
