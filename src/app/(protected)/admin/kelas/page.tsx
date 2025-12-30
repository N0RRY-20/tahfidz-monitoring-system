"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Kelas } from "./partials/types";
import { KelasDataTable } from "./partials/data-table";
import { getColumns } from "./partials/columns";
import { KelasTableSkeleton } from "./partials/table-skeleton";
import { KelasFormDialog } from "./partials/kelas-dialogs";
import { DeleteAlert } from "./partials/kelas-alerts";

export default function KelolaKelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [deleteData, setDeleteData] = useState<Kelas | null>(null);

  const fetchKelas = async () => {
    try {
      const res = await fetch("/api/admin/kelas");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setKelasList(data);
    } catch {
      toast.error("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  const handleCreate = async (data: { name: string; description: string }) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/kelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menambah kelas");
      }

      toast.success("Kelas berhasil ditambahkan");
      setCreateDialogOpen(false);
      fetchKelas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah kelas");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (data: { name: string; description: string }) => {
    if (!editingKelas) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/kelas/${editingKelas.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate kelas");
      }

      toast.success("Kelas berhasil diupdate");
      setEditDialogOpen(false);
      setEditingKelas(null);
      fetchKelas();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengupdate kelas"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/kelas/${deleteData.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus kelas");
      }

      toast.success("Kelas berhasil dihapus");
      setDeleteData(null);
      fetchKelas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus kelas");
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (kelas) => {
          setEditingKelas(kelas);
          setEditDialogOpen(true);
        },
        onDelete: (kelas) => setDeleteData(kelas),
      }),
    []
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Kelola Kelas
            </h1>
            <p className="text-sm text-muted-foreground">
              Memuat data kelas...
            </p>
          </div>
        </div>
        <KelasTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Kelola Kelas
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Manajemen data kelas
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              Total: {kelasList.length} Kelas
            </span>
          </p>
        </div>
      </div>

      <KelasDataTable
        columns={columns}
        data={kelasList}
        onAddKelas={() => setCreateDialogOpen(true)}
      />

      {/* CREATE DIALOG */}
      <KelasFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Tambah Kelas Baru"
        onSubmit={handleCreate}
        submitting={submitting}
      />

      {/* EDIT DIALOG */}
      <KelasFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Kelas"
        initialData={
          editingKelas
            ? {
                name: editingKelas.name,
                description: editingKelas.description || "",
              }
            : undefined
        }
        onSubmit={handleEdit}
        submitting={submitting}
      />

      {/* DELETE ALERT */}
      <DeleteAlert
        open={!!deleteData}
        onOpenChange={(open) => !open && setDeleteData(null)}
        data={deleteData}
        onConfirm={handleDelete}
        submitting={deleting}
      />
    </div>
  );
}
