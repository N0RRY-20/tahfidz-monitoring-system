"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Santri, Guru, Kelas } from "./partials/types";
import { SantriDataTable } from "./partials/data-table";
import { getColumns } from "./partials/columns";
import { SantriTableSkeleton } from "./partials/table-skeleton";
import { SantriFormDialog, CredentialDialog } from "./partials/santri-dialogs";
import { ConfirmDialog } from "./partials/santri-alerts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, School, GraduationCap, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function KelolaSantriPage() {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isMobile = useIsMobile();

  // Filter state
  const [filterClassId, setFilterClassId] = useState<string>("all");

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  // Detail Drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [viewingSantri, setViewingSantri] = useState<Santri | null>(null);

  // Credential results
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<{
    santriName: string;
    email: string;
    password: string;
  } | null>(null);

  // Alert states
  const [deleteData, setDeleteData] = useState<Santri | null>(null);
  const [resetData, setResetData] = useState<Santri | null>(null);

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

  const handleCreate = async (data: {
    fullName: string;
    classId: string;
    assignedGuruId: string;
    dob: string;
  }) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/santri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          classId: data.classId || null,
          assignedGuruId: data.assignedGuruId || null,
          dob: data.dob || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menambah santri");
      }

      const result = await res.json();
      setGeneratedCredentials({
        email: result.email,
        password: result.password,
      });

      toast.success("Santri berhasil ditambahkan");
      setCreateDialogOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah santri");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (data: {
    fullName: string;
    classId: string;
    assignedGuruId: string;
    dob: string;
  }) => {
    if (!editingSantri) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/santri/${editingSantri.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          classId: data.classId || null,
          assignedGuruId: data.assignedGuruId || null,
          dob: data.dob || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal mengupdate santri");
      }

      toast.success("Santri berhasil diupdate");
      setEditDialogOpen(false);
      setEditingSantri(null);
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengupdate santri"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/santri/${deleteData.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal menghapus santri");
      }

      toast.success("Santri berhasil dihapus");
      setDeleteData(null);
      fetchData();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus santri"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData) return;
    setResettingPassword(true);
    try {
      const res = await fetch(
        `/api/admin/santri/${resetData.id}/reset-password`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal reset password");
      }

      const result = await res.json();
      setResetPasswordResult({
        santriName: resetData.fullName,
        email: resetData.email,
        password: result.password,
      });
      setResetData(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleView = (santri: Santri) => {
    setViewingSantri(santri);
    setDetailDrawerOpen(true);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (santri) => {
          setEditingSantri(santri);
          setEditDialogOpen(true);
        },
        onDelete: (santri) => setDeleteData(santri),
        onResetPassword: (santri) => setResetData(santri),
        onView: handleView,
      }),
    []
  );

  const filteredSantris = useMemo(() => {
    if (filterClassId && filterClassId !== "all") {
      return santris.filter((s) => s.classId === filterClassId);
    }
    return santris;
  }, [santris, filterClassId]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Kelola Santri
            </h1>
            <p className="text-sm text-muted-foreground">
              Memuat data santri...
            </p>
          </div>
        </div>
        <SantriTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Kelola Santri
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Manajemen data santri
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              Total: {santris.length} Santri
            </span>
          </p>
        </div>
      </div>

      <SantriDataTable
        columns={columns}
        data={filteredSantris}
        onAddSantri={() => setCreateDialogOpen(true)}
        kelasList={kelasList}
        filterClassId={filterClassId}
        setFilterClassId={setFilterClassId}
      />

      {/* CREATE DIALOG */}
      <SantriFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Tambah Santri Baru"
        onSubmit={handleCreate}
        submitting={submitting}
        kelasList={kelasList}
        gurus={gurus}
      />

      {/* EDIT DIALOG */}
      <SantriFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title="Edit Santri"
        initialData={
          editingSantri
            ? {
                name: editingSantri.fullName,
                classId: editingSantri.classId || "none",
                guruId: editingSantri.guruId || "none",
                dob: "",
              }
            : undefined
        }
        onSubmit={handleEdit}
        submitting={submitting}
        kelasList={kelasList}
        gurus={gurus}
      />

      {/* SUCCESS CREATE CREDENTIALS */}
      <CredentialDialog
        open={!!generatedCredentials}
        onOpenChange={(open) => !open && setGeneratedCredentials(null)}
        title="Akun Santri Berhasil Dibuat"
        message="Akun santri berhasil dibuat! Silahkan simpan kredensial berikut."
        data={generatedCredentials}
      />

      {/* RESET PASSWORD RESULT */}
      <CredentialDialog
        open={!!resetPasswordResult}
        onOpenChange={(open) => !open && setResetPasswordResult(null)}
        title="Password Berhasil Direset"
        message="Password baru berhasil digenerate."
        data={
          resetPasswordResult
            ? {
                email: resetPasswordResult.email,
                password: resetPasswordResult.password,
                name: resetPasswordResult.santriName,
              }
            : null
        }
      />

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={!!deleteData}
        onOpenChange={(open) => !open && setDeleteData(null)}
        title="Hapus Santri?"
        description={
          <>
            Data santri <strong>{deleteData?.fullName}</strong> akan dihapus
            permanen beserta semua riwayat setoran.
          </>
        }
        onConfirm={handleDelete}
        confirmText="Hapus Santri"
        variant="destructive"
        submitting={deleting}
      />

      {/* CONFIRM RESET PASSWORD */}
      <ConfirmDialog
        open={!!resetData}
        onOpenChange={(open) => !open && setResetData(null)}
        title="Reset Password?"
        description={
          <>
            Password untuk <strong>{resetData?.fullName}</strong> akan direset
            ke password baru secara acak. Santri tidak akan bisa login dengan
            password lama.
          </>
        }
        onConfirm={handleResetPassword}
        confirmText="Reset Password"
        variant="default"
        submitting={resettingPassword}
      />

      {/* DRAWER FILTER */}
      <Drawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Detail Santri</DrawerTitle>
            <DrawerDescription>
              Informasi lengkap tentang santri
            </DrawerDescription>
          </DrawerHeader>
          {viewingSantri && (
            <div className="px-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewingSantri.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="size-4" />
                    {viewingSantri.email}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <School className="size-4" />
                    Kelas
                  </span>
                  <Badge variant="secondary">
                    {viewingSantri.className || "-"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <GraduationCap className="size-4" />
                    Guru Pembimbing
                  </span>
                  <span className="text-sm font-medium">
                    {viewingSantri.guruName || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-4" />
                    Tanggal Terdaftar
                  </span>
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        return format(
                          new Date(viewingSantri.createdAt),
                          "dd MMMM yyyy",
                          { locale: idLocale }
                        );
                      } catch {
                        return "-";
                      }
                    })()}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">ID Santri</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {viewingSantri.id}
                </code>
              </div>
            </div>
          )}
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (viewingSantri) {
                  setEditingSantri(viewingSantri);
                  setEditDialogOpen(true);
                  setDetailDrawerOpen(false);
                }
              }}
            >
              Edit Santri
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
