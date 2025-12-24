import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Database, Users, BookOpen } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-600">Konfigurasi sistem SIM-Tahfidz</p>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informasi Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Versi Aplikasi</p>
              <p className="font-medium">SIM-Tahfidz v2.0</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Framework</p>
              <p className="font-medium">Next.js 16 + Drizzle ORM</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Admin Login</p>
              <p className="font-medium">{session?.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Database menggunakan PostgreSQL dengan Drizzle ORM.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              <strong>Untuk menjalankan seed data:</strong>
            </p>
            <code className="block bg-slate-100 p-3 rounded text-sm">
              npm run db:seed-all
            </code>
            <p className="text-xs text-slate-500 mt-2">
              Ini akan menjalankan seed untuk roles, data Al-Qur&apos;an (114 surat), dan tags penilaian.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Role Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Sistem Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-sm text-slate-500">
                  Super Admin dengan akses penuh ke semua fitur
                </p>
              </div>
              <Badge>role_admin</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Guru</p>
                <p className="text-sm text-slate-500">
                  Guru Tahfidz yang menginput setoran santri
                </p>
              </div>
              <Badge variant="secondary">role_guru</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Santri</p>
                <p className="text-sm text-slate-500">
                  Akun untuk Wali Santri (read-only)
                </p>
              </div>
              <Badge variant="outline">role_santri</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mushaf Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Standar Al-Qur&apos;an
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Sistem menggunakan standar <strong>Mushaf Utsmani Pojok 15 Baris</strong> untuk
            kalkulasi halaman dan estimasi target khatam.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Total Surat</p>
              <p className="font-medium">114 Surat</p>
            </div>
            <div>
              <p className="text-slate-500">Total Juz</p>
              <p className="font-medium">30 Juz</p>
            </div>
            <div>
              <p className="text-slate-500">Total Ayat</p>
              <p className="font-medium">6.236 Ayat</p>
            </div>
            <div>
              <p className="text-slate-500">Total Halaman</p>
              <p className="font-medium">604 Halaman</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
