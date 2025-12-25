"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { IconMail, IconCalendar, IconUsers } from "@tabler/icons-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { GuruDataTable } from "./partials/data-table";
import { getColumns, type Guru } from "./partials/columns";
import { GuruTableSkeleton } from "./partials/table-skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function KelolaGuruPage() {
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Detail state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [viewingGuru, setViewingGuru] = useState<Guru | null>(null);

  // Add form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  const fetchGurus = async () => {
    try {
      const res = await fetch("/api/admin/guru");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGurus(data);
    } catch {
      toast.error("Gagal memuat data guru");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGurus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/guru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menambah guru");
      }

      toast.success("Guru berhasil ditambahkan");
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      setDialogOpen(false);
      fetchGurus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah guru");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/guru/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus guru");
      }

      toast.success("Guru berhasil dihapus");
      fetchGurus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus guru");
    }
  };

  const handleEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setEditName(guru.name);
    setEditEmail(guru.email);
    setEditPassword("");
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuru) return;
    if (!editName || !editEmail) {
      toast.error("Nama dan email wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/guru/${editingGuru.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          ...(editPassword && { password: editPassword }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengupdate guru");
      }

      toast.success("Data guru berhasil diupdate");
      setEditDialogOpen(false);
      setEditingGuru(null);
      fetchGurus();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengupdate guru");
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = (guru: Guru) => {
    setViewingGuru(guru);
    setDetailDrawerOpen(true);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onDelete: handleDelete,
        onEdit: handleEdit,
        onView: handleView,
      }),
    []
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Guru</h1>
          <p className="text-muted-foreground">Manajemen akun guru tahfidz</p>
        </div>
        <GuruTableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Guru</h1>
        <p className="text-muted-foreground">Manajemen akun guru tahfidz</p>
      </div>

      <GuruDataTable
        columns={columns}
        data={gurus}
        onAddGuru={() => setDialogOpen(true)}
      />

      {/* Dialog Tambah Guru */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Guru Baru</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk menambahkan guru baru
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Masukkan nama guru"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Guru */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Guru</DialogTitle>
            <DialogDescription>
              Ubah informasi guru. Kosongkan password jika tidak ingin mengubah.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Nama Lengkap</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Masukkan nama guru"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Password Baru (Opsional)</Label>
              <Input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Drawer Detail Guru */}
      <Drawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Detail Guru</DrawerTitle>
            <DrawerDescription>
              Informasi lengkap tentang guru
            </DrawerDescription>
          </DrawerHeader>
          {viewingGuru && (
            <div className="px-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold">
                  {viewingGuru.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{viewingGuru.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <IconMail className="size-4" />
                    {viewingGuru.email}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <IconUsers className="size-4" />
                    Santri Binaan
                  </span>
                  <Badge variant="secondary">
                    {viewingGuru.santriCount} santri
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <IconCalendar className="size-4" />
                    Tanggal Daftar
                  </span>
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        return format(
                          new Date(viewingGuru.createdAt),
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
                <h4 className="text-sm font-medium mb-2">ID Guru</h4>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {viewingGuru.id}
                </code>
              </div>
            </div>
          )}
          <DrawerFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (viewingGuru) {
                  handleEdit(viewingGuru);
                  setDetailDrawerOpen(false);
                }
              }}
            >
              Edit Guru
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
