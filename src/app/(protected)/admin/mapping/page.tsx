"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Santri, Guru, Kelas } from "./partials/types";
import { MappingDataTable } from "./partials/data-table";
import { columns } from "./partials/columns";
import { MappingTableSkeleton } from "./partials/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function MappingSantriPage() {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [santriRes, guruRes, kelasRes] = await Promise.all([
        fetch("/api/admin/santri"),
        fetch("/api/admin/guru"),
        fetch("/api/kelas"),
      ]);
      if (!santriRes.ok || !guruRes.ok || !kelasRes.ok)
        throw new Error("Failed to fetch");
      const [santriData, guruData, kelasData] = await Promise.all([
        santriRes.json(),
        guruRes.json(),
        kelasRes.json(),
      ]);
      setSantris(santriData);
      setGurus(guruData);
      setKelasList(kelasData);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBulkAssign = async (santriIds: string[], guruId: string) => {
    if (santriIds.length === 0) {
      toast.error("Pilih santri terlebih dahulu");
      return;
    }
    if (!guruId) {
      toast.error("Pilih guru tujuan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          santriIds,
          guruId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mapping santri");
      }

      toast.success(`${santriIds.length} santri berhasil di-mapping`);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mapping santri");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Mapping Santri
            </h1>
            <p className="text-sm text-muted-foreground">
              Memuat data santri...
            </p>
          </div>
        </div>
        <MappingTableSkeleton />
      </div>
    );
  }

  const unassignedCount = santris.filter((s) => !s.guruId).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Mapping Santri
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Assign santri ke guru pembimbing
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              Belum Mapping: {unassignedCount} Santri
            </span>
          </p>
        </div>
      </div>

      {/* Guru Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {gurus.map((guru) => (
          <Card key={guru.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{guru.name}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{guru.santriCount}</div>
              <p className="text-xs text-muted-foreground">Santri Binaan</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Data Santri</h2>
        </div>
        <MappingDataTable
          columns={columns}
          data={santris}
          gurus={gurus}
          kelasList={kelasList}
          onBulkAssign={handleBulkAssign}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
