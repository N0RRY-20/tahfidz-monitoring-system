import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, BookOpen, Shield, GraduationCap } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Pengaturan
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Informasi dan konfigurasi sistem SIM-Tahfidz
        </p>
      </div>

      {/* System Info */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Informasi Sistem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Versi Aplikasi
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                SIM-Tahfidz v2.0
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Admin Login
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {session?.user.email}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Status Sistem
              </p>
              <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 mt-1">
                ● Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Info */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Sistem Role & Akses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Admin
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Super Admin dengan akses penuh ke semua fitur
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-500 hover:bg-blue-600">Admin</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-amber-500">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Guru
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Guru Tahfidz yang menginput setoran santri
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              >
                Guru
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    Wali Santri
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Akun untuk melihat perkembangan hafalan (read-only)
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-green-500 text-green-600 dark:text-green-400"
              >
                Wali
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mushaf Info */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            Standar Al-Qur&apos;an
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Sistem menggunakan standar{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Mushaf Utsmani Pojok 15 Baris
            </span>{" "}
            untuk kalkulasi halaman dan estimasi target khatam.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                114
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Surat
              </p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                30
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Juz</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                6.236
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ayat</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                604
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Halaman
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
