"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Calendar,
  TrendingUp,
  Plus,
  BookOpen,
  RotateCcw,
} from "lucide-react";

interface StatsCardsProps {
  santriCount: number;
  todayZiyadah: number;
  todayMurajaah: number;
  monthTotal: number;
}

export function StatsCards({
  santriCount,
  todayZiyadah,
  todayMurajaah,
  monthTotal,
}: StatsCardsProps) {
  const todayTotal = todayZiyadah + todayMurajaah;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Santri Binaan
          </CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {santriCount}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Total santri
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950 dark:to-emerald-900/50 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Setoran Hari Ini
          </CardTitle>
          <Calendar className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
            {todayTotal}
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-blue-600 dark:text-blue-400">
              <BookOpen className="h-3 w-3 inline mr-0.5" />
              {todayZiyadah}
            </span>
            <span className="text-orange-600 dark:text-orange-400">
              <RotateCcw className="h-3 w-3 inline mr-0.5" />
              {todayMurajaah}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Bulan Ini
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {monthTotal}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Total setoran
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950 dark:to-amber-900/50 border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Quick Action
          </CardTitle>
          <Plus className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <Link href="/guru/input">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Input Setoran
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
