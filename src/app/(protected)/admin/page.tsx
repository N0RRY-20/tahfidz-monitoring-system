import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userRole, role } from "@/db/schema/auth-schema";
import {
  santriProfiles,
  dailyRecords,
  quranMeta,
} from "@/db/schema/tahfidz-schema";
import { eq, sql, gte } from "drizzle-orm";
import { getJakartaDateString, getJakartaMonthStartString } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Plus,
  Map,
  Tags,
  Activity,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get guru count
  const guruCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(eq(role.name, "guru"));

  // Get santri count
  const santriCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(santriProfiles);

  // Get total setoran
  const totalSetoran = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords);

  // Get today's setoran (WIB timezone)
  const today = getJakartaDateString();
  const todaySetoran = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(eq(dailyRecords.date, today));

  // Get this month's setoran (WIB timezone)
  const monthStart = getJakartaMonthStartString();
  const monthSetoran = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(gte(dailyRecords.date, monthStart));

  // Get recent records with surah name
  const recentRecords = await db
    .select({
      santriName: santriProfiles.fullName,
      date: dailyRecords.date,
      colorStatus: dailyRecords.colorStatus,
      surahName: quranMeta.surahName,
      ayatStart: dailyRecords.ayatStart,
      ayatEnd: dailyRecords.ayatEnd,
    })
    .from(dailyRecords)
    .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
    .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
    .orderBy(sql`${dailyRecords.createdAt} DESC`)
    .limit(5);

  const stats = [
    {
      label: "Total Guru",
      value: guruCount[0]?.count || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      link: "/admin/guru",
      linkText: "Kelola Guru",
    },
    {
      label: "Total Santri",
      value: santriCount[0]?.count || 0,
      icon: GraduationCap,
      color:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      link: "/admin/santri",
      linkText: "Kelola Santri",
    },
    {
      label: "Setoran Hari Ini",
      value: todaySetoran[0]?.count || 0,
      subValue: `Bulan ini: ${monthSetoran[0]?.count || 0}`,
      icon: Calendar,
      color:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    },
    {
      label: "Total Setoran",
      value: totalSetoran[0]?.count || 0,
      icon: BookOpen,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      link: "/admin/reports",
      linkText: "Lihat Laporan",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Dashboard Admin
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Selamat datang kembali, {session?.user.name}! Berikut ringkasan
          aktivitas pondok.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              {stat.subValue && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {stat.subValue}
                </p>
              )}
              {stat.link && (
                <Link
                  href={stat.link}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 mt-2"
                >
                  {stat.linkText} <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-slate-200 dark:border-slate-800 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                <Activity className="h-5 w-5" />
              </div>
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
            >
              <Link href="/admin/guru">
                <Plus className="mr-2 h-4 w-4" /> Tambah Guru
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
            >
              <Link href="/admin/santri">
                <Plus className="mr-2 h-4 w-4" /> Tambah Santri
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 dark:border-purple-800 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300"
            >
              <Link href="/admin/mapping">
                <Map className="mr-2 h-4 w-4" /> Mapping
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 dark:text-orange-300"
            >
              <Link href="/admin/tags">
                <Tags className="mr-2 h-4 w-4" /> Komentar
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-slate-200 dark:border-slate-800 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                <BookOpen className="h-5 w-5" />
              </div>
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500 dark:text-slate-400">
                <BookOpen className="h-10 w-10 mb-3 opacity-20" />
                <p>Belum ada aktivitas setoran</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRecords.map((record, idx) => {
                  let statusColor =
                    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                  let statusText = "-";

                  if (record.colorStatus === "G") {
                    statusColor =
                      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
                    statusText = "Mutqin";
                  } else if (record.colorStatus === "Y") {
                    statusColor =
                      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
                    statusText = "Jayyid";
                  } else if (record.colorStatus === "R") {
                    statusColor =
                      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
                    statusText = "Rasib";
                  }

                  return (
                    <div
                      key={idx}
                      className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {record.santriName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {record.surahName ? (
                            <>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {record.surahName}
                              </span>
                              <span className="mx-1">•</span>
                              Ayat {record.ayatStart}-{record.ayatEnd}
                            </>
                          ) : (
                            new Date(record.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })
                          )}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${statusColor} border`}
                      >
                        {statusText}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
