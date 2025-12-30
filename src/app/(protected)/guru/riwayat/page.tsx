"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Clock,
  Filter,
  AlertCircle,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { getColumns, type RiwayatData } from "./partials/columns";
import { RiwayatTable } from "./partials/riwayat-table";
import { EditDialog } from "./partials/edit-dialog";
import { DeleteDialog } from "./partials/delete-dialog";
import { RiwayatSkeleton } from "./partials/skeleton";

export default function RiwayatPage() {
  const [records, setRecords] = useState<RiwayatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"today" | "7days" | "30days">(
    "7days"
  );

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RiwayatData | null>(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState<RiwayatData | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/guru/riwayat?filter=${dateFilter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data);
      setError(null);
    } catch {
      setError("Gagal memuat riwayat. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  // Handlers
  const handleEdit = (record: RiwayatData) => {
    setEditingRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record: RiwayatData) => {
    setDeletingRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingRecord) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/guru/delete-setoran/${deletingRecord.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus");
      }

      toast.success("Data berhasil dihapus");
      setDeleteDialogOpen(false);
      setDeletingRecord(null);
      fetchRecords();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get columns with callbacks
  const columns = useMemo(
    () => getColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    []
  );

  if (loading) {
    return <RiwayatSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Riwayat Input
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Data setoran yang sudah Anda input
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Anda hanya bisa mengedit atau menghapus data dalam waktu 24 jam
          setelah input. Untuk revisi data historis, hubungi Admin.
        </AlertDescription>
      </Alert>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-slate-500" />
        <Select
          value={dateFilter}
          onValueChange={(v) => setDateFilter(v as typeof dateFilter)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Tanggal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="7days">7 Hari Terakhir</SelectItem>
            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {records.length} data ditemukan
        </span>
      </div>

      <Tabs defaultValue="ziyadah" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ziyadah" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Ziyadah ({records.filter((r) => r.type === "ziyadah").length})
          </TabsTrigger>
          <TabsTrigger value="murajaah" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Murajaah ({records.filter((r) => r.type === "murajaah").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ziyadah">
          <Card>
            <CardHeader>
              <CardTitle>Setoran Ziyadah (Hafalan Baru)</CardTitle>
            </CardHeader>
            <CardContent>
              <RiwayatTable
                columns={columns}
                data={records.filter((r) => r.type === "ziyadah")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="murajaah">
          <Card>
            <CardHeader>
              <CardTitle>Setoran Murajaah (Pengulangan)</CardTitle>
            </CardHeader>
            <CardContent>
              <RiwayatTable
                columns={columns}
                data={records.filter((r) => r.type === "murajaah")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <EditDialog
        record={editingRecord}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchRecords}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        record={deletingRecord}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
