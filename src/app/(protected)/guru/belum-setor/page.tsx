"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconBook, IconRotate, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { getJakartaDateString } from "@/lib/date";

interface SantriStatus {
  santriId: string;
  santriName: string;
  santriClass: string;
  hasZiyadahToday: boolean;
  hasMurajaahToday: boolean;
}

type FilterType = "belum-ziyadah" | "belum-murajaah";

export default function BelumSetorPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SantriStatus[]>([]);
  const [filter, setFilter] = useState<FilterType>("belum-ziyadah");

  const todayWIB = getJakartaDateString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/guru/belum-setor");
        if (!res.ok) throw new Error("Gagal memuat data");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Gagal memuat data. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter data based on selected filter
  const filteredData = useMemo(() => {
    if (filter === "belum-ziyadah") {
      return data.filter((s) => !s.hasZiyadahToday);
    }
    return data.filter((s) => !s.hasMurajaahToday);
  }, [data, filter]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Belum Setor Hari Ini
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Tanggal: <span className="font-medium">{todayWIB}</span>
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterType)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="belum-ziyadah" className="gap-2">
            <IconBook className="h-4 w-4" />
            Belum Ziyadah
          </TabsTrigger>
          <TabsTrigger value="belum-murajaah" className="gap-2">
            <IconRotate className="h-4 w-4" />
            Belum Murajaah
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {filter === "belum-ziyadah" ? (
              <>
                <IconBook className="h-5 w-5 text-blue-500" />
                Santri yang Belum Ziyadah
              </>
            ) : (
              <>
                <IconRotate className="h-5 w-5 text-orange-500" />
                Santri yang Belum Murajaah
              </>
            )}
            <Badge variant="secondary" className="ml-2">
              {filteredData.length} santri
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p className="text-lg font-medium">
                🎉 Semua santri sudah setor!
              </p>
              <p className="text-sm mt-1">
                {filter === "belum-ziyadah"
                  ? "Semua santri sudah melakukan ziyadah hari ini."
                  : "Semua santri sudah melakukan murajaah hari ini."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Santri</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status Ziyadah</TableHead>
                    <TableHead>Status Murajaah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((santri) => (
                    <TableRow key={santri.santriId}>
                      <TableCell className="font-medium">
                        {santri.santriName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{santri.santriClass}</Badge>
                      </TableCell>
                      <TableCell>
                        {santri.hasZiyadahToday ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Sudah
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Belum
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {santri.hasMurajaahToday ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Sudah
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Belum
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          asChild
                        >
                          <Link href="/guru/input">
                            <IconPlus className="h-4 w-4 mr-1" />
                            Input
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
