"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  santriId: string;
  santriName: string;
  classId: string | null;
  className: string | null;
  guruName: string | null;
  totalSetoran: number;
  totalAyat: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
}

interface Kelas {
  id: string;
  name: string;
}

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

  const filteredData = filterClassId && filterClassId !== "all"
    ? reportData.filter((r) => r.classId === filterClassId)
    : reportData;

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, r) => ({
      totalSetoran: acc.totalSetoran + r.totalSetoran,
      totalAyat: acc.totalAyat + r.totalAyat,
      greenCount: acc.greenCount + r.greenCount,
      yellowCount: acc.yellowCount + r.yellowCount,
      redCount: acc.redCount + r.redCount,
    }),
    { totalSetoran: 0, totalAyat: 0, greenCount: 0, yellowCount: 0, redCount: 0 }
  );

  const handleExportCSV = () => {
    const headers = [
      "Nama Santri",
      "Kelas",
      "Guru",
      "Total Setoran",
      "Total Ayat",
      "Hijau",
      "Kuning",
      "Merah",
    ];

    const rows = filteredData.map((r) => [
      r.santriName,
      r.className || "-",
      r.guruName || "-",
      r.totalSetoran,
      r.totalAyat,
      r.greenCount,
      r.yellowCount,
      r.redCount,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-tahfidz-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Laporan berhasil diexport");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laporan</h1>
          <p className="text-slate-600">Rekapitulasi hafalan santri</p>
        </div>
        <Button onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Total Santri</p>
            <p className="text-2xl font-bold">{filteredData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Total Setoran</p>
            <p className="text-2xl font-bold">{totals.totalSetoran}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Hijau (Mutqin)</p>
            <p className="text-2xl font-bold text-green-600">{totals.greenCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Kuning (Jayyid)</p>
            <p className="text-2xl font-bold text-yellow-600">{totals.yellowCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-500">Merah (Rasib)</p>
            <p className="text-2xl font-bold text-red-600">{totals.redCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={filterClassId} onValueChange={setFilterClassId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {kelasList.map((kelas) => (
              <SelectItem key={kelas.id} value={kelas.id}>
                {kelas.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Report Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredData.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Tidak ada data untuk ditampilkan
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Santri</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Guru</TableHead>
                  <TableHead className="text-center">Setoran</TableHead>
                  <TableHead className="text-center">Ayat</TableHead>
                  <TableHead className="text-center">H</TableHead>
                  <TableHead className="text-center">K</TableHead>
                  <TableHead className="text-center">M</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.santriId}>
                    <TableCell className="font-medium">{row.santriName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{row.className || "-"}</Badge>
                    </TableCell>
                    <TableCell>{row.guruName || "-"}</TableCell>
                    <TableCell className="text-center">{row.totalSetoran}</TableCell>
                    <TableCell className="text-center">{row.totalAyat}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-500">{row.greenCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-yellow-500">{row.yellowCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-red-500">{row.redCount}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
