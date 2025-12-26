"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ReportsTableSkeleton } from "./partials/table-skeleton";
import { ReportData, Kelas, ReportStats } from "./partials/types";
import { ReportStatsCards } from "./partials/report-stats";
import { ReportsDataTable } from "./partials/data-table";
import { columns } from "./partials/columns";

export default function LaporanPage() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterClassId, setFilterClassId] = useState("all");
  const [kelasList, setKelasList] = useState<Kelas[]>([]);

  const fetchReport = async () => {
    try {
      const [reportRes, kelasRes] = await Promise.all([
        fetch("/api/admin/reports"),
        fetch("/api/kelas"),
      ]);
      if (!reportRes.ok || !kelasRes.ok) throw new Error("Failed to fetch");
      const [data, kelasData] = await Promise.all([
        reportRes.json(),
        kelasRes.json(),
      ]);
      setReportData(data.report);
      setKelasList(kelasData);
    } catch {
      toast.error("Gagal memuat laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const filteredData =
    filterClassId && filterClassId !== "all"
      ? reportData.filter((r) => r.classId === filterClassId)
      : reportData;

  // Calculate totals
  const stats: ReportStats = filteredData.reduce(
    (acc, r) => ({
      totalSetoran: acc.totalSetoran + r.totalSetoran,
      totalAyat: acc.totalAyat + r.totalAyat,
      greenCount: acc.greenCount + r.greenCount,
      yellowCount: acc.yellowCount + r.yellowCount,
      redCount: acc.redCount + r.redCount,
    }),
    {
      totalSetoran: 0,
      totalAyat: 0,
      greenCount: 0,
      yellowCount: 0,
      redCount: 0,
    }
  );

  if (loading) {
    return <ReportsTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Laporan
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Rekapitulasi hafalan santri
          </p>
        </div>
      </div>

      <ReportStatsCards stats={stats} totalSantri={filteredData.length} />

      <ReportsDataTable
        columns={columns}
        data={filteredData}
        kelasList={kelasList}
        filterClassId={filterClassId}
        setFilterClassId={setFilterClassId}
      />
    </div>
  );
}
