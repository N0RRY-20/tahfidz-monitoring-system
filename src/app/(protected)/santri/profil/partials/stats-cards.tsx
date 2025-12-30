"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Award, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalSetoran: number;
  totalAyat: number;
  greenRecords: number;
  yellowRecords: number;
  redRecords: number;
}

export function StatsCards({
  totalSetoran,
  totalAyat,
  greenRecords,
  yellowRecords,
  redRecords,
}: StatsCardsProps) {
  const total = greenRecords + yellowRecords + redRecords;
  const greenPercent = total > 0 ? Math.round((greenRecords / total) * 100) : 0;
  const yellowPercent =
    total > 0 ? Math.round((yellowRecords / total) * 100) : 0;
  const redPercent = total > 0 ? Math.round((redRecords / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Setoran
          </CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {totalSetoran}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">Kali setor</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Total Ayat
          </CardTitle>
          <BookOpen className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            {totalAyat.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            Ayat disetor
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/30 border-green-200 dark:border-green-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Mutqin
          </CardTitle>
          <Award className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {greenRecords}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            Setoran lancar
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/30 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Distribusi Nilai
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Stacked Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted">
            {greenPercent > 0 && (
              <div
                className="h-full bg-green-500"
                style={{ width: `${greenPercent}%` }}
              />
            )}
            {yellowPercent > 0 && (
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${yellowPercent}%` }}
              />
            )}
            {redPercent > 0 && (
              <div
                className="h-full bg-red-500"
                style={{ width: `${redPercent}%` }}
              />
            )}
          </div>
          {/* Legend - vertical di mobile, horizontal di desktop */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 shrink-0 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Mutqin ({greenRecords})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 shrink-0 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Jayyid ({yellowRecords})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 shrink-0 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Rasib ({redRecords})</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
