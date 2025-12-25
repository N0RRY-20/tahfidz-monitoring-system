"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { UserPlus, Mail, Clock, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  async function checkVerificationStatus() {
    setIsChecking(true);

    try {
      // Fetch user roles from API
      const response = await fetch("/api/user/roles");
      const data = await response.json();

      if (data.roles && data.roles.length > 0) {
        toast.success("Akun telah diverifikasi!", {
          description: `Role Anda: ${data.roles.join(
            ", "
          )}. Mengalihkan ke dashboard...`,
        });
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.info("Masih menunggu verifikasi", {
          description: "Admin belum menetapkan role untuk akun Anda.",
        });
      }
    } catch {
      toast.error("Gagal memeriksa status", {
        description: "Silahkan coba lagi nanti.",
      });
    } finally {
      setIsChecking(false);
    }
  }

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Datang! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Akun Anda berhasil dibuat. Silahkan tunggu verifikasi dari Admin.
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6 border-2 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
                  Menunggu Verifikasi
                </CardTitle>
                <CardDescription className="text-amber-700 dark:text-amber-300">
                  Akun Anda sedang dalam proses verifikasi
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Admin akan segera meninjau dan menetapkan role untuk akun Anda.
              Proses ini biasanya memakan waktu 1-2 hari kerja.
            </p>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                  <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-base">Siapa Anda?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Wali Santri:</span>
                  <span>Pantau perkembangan hafalan anak Anda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">Guru:</span>
                  <span>Kelola setoran dan evaluasi santri</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-base">Butuh Bantuan?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Hubungi admin pondok pesantren jika Anda memerlukan bantuan atau
                ingin mempercepat proses verifikasi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Logout & Kembali ke Login
          </Button>
          <Button
            onClick={checkVerificationStatus}
            disabled={isChecking}
            className="w-full sm:w-auto"
          >
            {isChecking && <Spinner />}
            {isChecking ? "Memeriksa..." : "Cek Status Verifikasi"}
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Halaman ini akan otomatis mengarahkan Anda ke dashboard setelah akun
          diverifikasi.
        </p>
      </div>
    </div>
  );
}
