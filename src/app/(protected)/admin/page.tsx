import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { userRole, role } from "@/db/schema/auth-schema";
import { santriProfiles, dailyRecords } from "@/db/schema/tahfidz-schema";
import { eq, sql, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

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

  // Get today's setoran
  const today = new Date().toISOString().split("T")[0];
  const todaySetoran = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(eq(dailyRecords.date, today));

  // Get this month's setoran
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthStart = startOfMonth.toISOString().split("T")[0];
  const monthSetoran = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(gte(dailyRecords.date, monthStart));

  // Get recent records
  const recentRecords = await db
    .select({
      santriName: santriProfiles.fullName,
      date: dailyRecords.date,
      colorStatus: dailyRecords.colorStatus,
    })
    .from(dailyRecords)
    .innerJoin(santriProfiles, eq(dailyRecords.santriId, santriProfiles.id))
    .orderBy(sql`${dailyRecords.createdAt} DESC`)
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
        <p className="text-slate-600">
          Selamat datang, {session?.user.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guruCount[0]?.count || 0}</div>
            <Link href="/admin/guru" className="text-xs text-blue-600 hover:underline">
              Kelola Guru →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{santriCount[0]?.count || 0}</div>
            <Link href="/admin/santri" className="text-xs text-blue-600 hover:underline">
              Kelola Santri →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setoran Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaySetoran[0]?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Bulan ini: {monthSetoran[0]?.count || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSetoran[0]?.count || 0}</div>
            <Link href="/admin/reports" className="text-xs text-blue-600 hover:underline">
              Lihat Laporan →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/admin/guru"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white h-9 px-4 hover:bg-blue-700 transition-colors"
          >
            + Tambah Guru
          </Link>
          <Link
            href="/admin/santri"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-green-600 text-white h-9 px-4 hover:bg-green-700 transition-colors"
          >
            + Tambah Santri
          </Link>
          <Link
            href="/admin/mapping"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-purple-600 text-white h-9 px-4 hover:bg-purple-700 transition-colors"
          >
            Mapping Santri
          </Link>
          <Link
            href="/admin/tags"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-orange-600 text-white h-9 px-4 hover:bg-orange-700 transition-colors"
          >
            Bank Komentar
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecords.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Belum ada aktivitas</p>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{record.santriName}</p>
                    <p className="text-sm text-slate-500">{record.date}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      record.colorStatus === "G"
                        ? "bg-green-500"
                        : record.colorStatus === "Y"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {record.colorStatus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
