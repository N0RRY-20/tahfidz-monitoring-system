import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles, dailyRecords, classes } from "@/db/schema/tahfidz-schema";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { ProgressChart } from "./progress-chart";

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
          <CardContent className="py-8 text-center text-slate-500">
            Profil santri belum dibuat. Hubungi Admin.
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
  records.forEach(record => {
    const month = record.date.substring(0, 7); // YYYY-MM
    const ayatCount = record.ayatEnd - record.ayatStart + 1;
    monthlyData[month] = (monthlyData[month] || 0) + ayatCount;
  });

  // Convert to chart data (cumulative)
  const sortedMonths = Object.keys(monthlyData).sort();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  
  const chartData = sortedMonths.reduce<{ month: string; ayat: number }[]>((acc, month) => {
    const prevTotal = acc.length > 0 ? acc[acc.length - 1].ayat : 0;
    const newTotal = prevTotal + monthlyData[month];
    const [year, monthNum] = month.split("-");
    acc.push({
      month: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}`,
      ayat: newTotal,
    });
    return acc;
  }, []);

  // Calculate stats
  const totalAyat = records.reduce((sum, r) => sum + (r.ayatEnd - r.ayatStart + 1), 0);
  const totalSetoran = records.length;
  const greenRecords = records.filter(r => r.colorStatus === "G").length;

  // Estimate completion (total ayat in Quran = 6236)
  const totalQuranAyat = 6236;
  const progressPercent = Math.round((totalAyat / totalQuranAyat) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Santri</h1>
        <p className="text-slate-600">Informasi dan statistik hafalan</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Santri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Nama Lengkap</p>
              <p className="font-medium">{santriData.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kelas</p>
              <p className="font-medium">{santriData.className || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Tanggal Lahir</p>
              <p className="font-medium">{santriData.dob || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Guru Pembimbing</p>
              <p className="font-medium">{santriData.guruName || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSetoran}</div>
            <p className="text-xs text-muted-foreground">Kali setor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ayat</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAyat}</div>
            <p className="text-xs text-muted-foreground">Ayat disetor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mutqin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{greenRecords}</div>
            <p className="text-xs text-muted-foreground">Setoran hijau</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progressPercent}%</div>
            <p className="text-xs text-muted-foreground">Menuju khatam</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Grafik Progress Hafalan
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ProgressChart data={chartData} />
          ) : (
            <p className="text-center text-slate-500 py-8">
              Belum ada data untuk ditampilkan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
