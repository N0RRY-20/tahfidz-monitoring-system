import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles, dailyRecords, classes } from "@/db/schema/tahfidz-schema";
import { eq, sql, and, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, BookOpen, TrendingUp, Calendar } from "lucide-react";

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
      classId: santriProfiles.classId,
      className: classes.name,
    })
    .from(santriProfiles)
    .leftJoin(classes, eq(santriProfiles.classId, classes.id))
    .where(eq(santriProfiles.assignedGuruId, session.user.id));

  // Get today's date for filtering
  const today = new Date().toISOString().split("T")[0];

  // Get today's records count
  const todayRecords = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(
      and(
        eq(dailyRecords.guruId, session.user.id),
        eq(dailyRecords.date, today)
      )
    );

  // Get total records this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const monthStart = startOfMonth.toISOString().split("T")[0];

  const monthRecords = await db
    .select({ count: sql<number>`count(*)` })
    .from(dailyRecords)
    .where(
      and(
        eq(dailyRecords.guruId, session.user.id),
        gte(dailyRecords.date, monthStart)
      )
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Assalamu&apos;alaikum, {session.user.name}
        </h1>
        <p className="text-slate-600">Selamat datang di Panel Guru Tahfidz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santri Binaan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{santriBinaan.length}</div>
            <p className="text-xs text-muted-foreground">Total santri</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setoran Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRecords[0]?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Input hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthRecords[0]?.count || 0}</div>
            <p className="text-xs text-muted-foreground">Total setoran</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Action</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link
              href="/guru/input"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white h-9 px-4 hover:bg-emerald-700 transition-colors"
            >
              Input Setoran
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Santri Binaan */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Daftar Santri Binaan</h2>
        {santriBinaan.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              Belum ada santri yang ditugaskan kepada Anda.
              <br />
              Hubungi Admin untuk mapping santri.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {santriBinaan.map((santri) => (
              <Card key={santri.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{santri.fullName}</h3>
                      <p className="text-sm text-slate-500">
                        Kelas: {santri.className || "-"}
                      </p>
                    </div>
                    <Badge variant="outline">{santri.className || "-"}</Badge>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/guru/input?santriId=${santri.id}`}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Input Setoran →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
