"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Key, Copy, Pencil } from "lucide-react";
import { toast } from "sonner";

interface Santri {
  id: string;
  fullName: string;
  classId: string | null;
  className: string | null;
  email: string;
  guruId: string | null;
  guruName: string | null;
  createdAt: string;
}

interface Guru {
  id: string;
  name: string;
}

interface Kelas {
  id: string;
  name: string;
  description: string | null;
}

export default function KelolaSantriPage() {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterClassId, setFilterClassId] = useState<string>("all");
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordResult, setResetPasswordResult] = useState<{
    santriName: string;
    email: string;
    password: string;
  } | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formClassId, setFormClassId] = useState("");
  const [formGuruId, setFormGuruId] = useState("");
  const [formDob, setFormDob] = useState("");

  const fetchData = async () => {
    try {
      const [santriRes, guruRes, kelasRes] = await Promise.all([
        fetch("/api/admin/santri"),
        fetch("/api/admin/guru"),
        fetch("/api/kelas"),
      ]);
      if (!santriRes.ok || !guruRes.ok || !kelasRes.ok) throw new Error("Failed to fetch");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      toast.error("Nama santri wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/santri", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formName,
          classId: formClassId && formClassId !== "none" ? formClassId : null,
          assignedGuruId: formGuruId && formGuruId !== "none" ? formGuruId : null,
          dob: formDob || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menambah santri");
      }

      const data = await res.json();
      setGeneratedCredentials({
        email: data.email,
        password: data.password,
      });

      toast.success("Santri berhasil ditambahkan");
      setFormName("");
      setFormClassId("");
      setFormGuruId("");
      setFormDob("");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah santri");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/santri/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus santri");
      }

      toast.success("Santri berhasil dihapus");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus santri");
    }
  };

  const handleResetPassword = async (id: string, santriName: string, email: string) => {
    try {
      const res = await fetch(`/api/admin/santri/${id}/reset-password`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal reset password");
      }

      const data = await res.json();
      setResetPasswordResult({
        santriName,
        email,
        password: data.password,
      });
      setResetPasswordDialogOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal reset password");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSantri || !formName) {
      toast.error("Nama santri wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/santri/${editingSantri.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formName,
          classId: formClassId && formClassId !== "none" ? formClassId : null,
          assignedGuruId: formGuruId && formGuruId !== "none" ? formGuruId : null,
          dob: formDob || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengupdate santri");
      }

      toast.success("Santri berhasil diupdate");
      setFormName("");
      setFormClassId("");
      setFormGuruId("");
      setFormDob("");
      setEditDialogOpen(false);
      setEditingSantri(null);
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengupdate santri");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (santri: Santri) => {
    setEditingSantri(santri);
    setFormName(santri.fullName);
    setFormClassId(santri.classId || "none");
    setFormGuruId(santri.guruId || "none");
    setFormDob("");
    setEditDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard");
  };

  // Filter santris
  const filteredSantris = filterClassId && filterClassId !== "all"
    ? santris.filter((s) => s.classId === filterClassId)
    : santris;

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
          <h1 className="text-2xl font-bold text-slate-900">Kelola Santri</h1>
          <p className="text-slate-600">Manajemen data santri</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Santri
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Santri Baru</DialogTitle>
            </DialogHeader>
            {generatedCredentials ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-medium text-green-800 mb-2">
                    Akun santri berhasil dibuat!
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Email:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm">
                          {generatedCredentials.email}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedCredentials.email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Password:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-white px-2 py-1 rounded text-sm">
                          {generatedCredentials.password}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(generatedCredentials.password)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setGeneratedCredentials(null);
                      setDialogOpen(false);
                    }}
                  >
                    Selesai
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nama Lengkap *</Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Masukkan nama santri"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Kelas</Label>
                  <Select value={formClassId} onValueChange={setFormClassId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih kelas (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      {kelasList.map((kelas) => (
                        <SelectItem key={kelas.id} value={kelas.id}>
                          {kelas.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tanggal Lahir</Label>
                  <Input
                    type="date"
                    value={formDob}
                    onChange={(e) => setFormDob(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Guru Pembimbing</Label>
                  <Select value={formGuruId} onValueChange={setFormGuruId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih guru (opsional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      {gurus.map((guru) => (
                        <SelectItem key={guru.id} value={guru.id}>
                          {guru.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-slate-500">
                  Username dan password akan digenerate otomatis
                </p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Santri</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Nama Lengkap *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Masukkan nama santri"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Kelas</Label>
              <Select value={formClassId} onValueChange={setFormClassId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih kelas (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {kelasList.map((kelas) => (
                    <SelectItem key={kelas.id} value={kelas.id}>
                      {kelas.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tanggal Lahir</Label>
              <Input
                type="date"
                value={formDob}
                onChange={(e) => setFormDob(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Guru Pembimbing</Label>
              <Select value={formGuruId} onValueChange={setFormGuruId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih guru (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {gurus.map((guru) => (
                    <SelectItem key={guru.id} value={guru.id}>
                      {guru.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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

      <Card>
        <CardContent className="pt-6">
          {filteredSantris.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Belum ada data santri.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Guru</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSantris.map((santri) => (
                  <TableRow key={santri.id}>
                    <TableCell className="font-medium">{santri.fullName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{santri.className || "-"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {santri.email}
                    </TableCell>
                    <TableCell>{santri.guruName || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(santri)}
                          title="Edit Santri"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              title="Reset Password"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Password untuk <span className="font-medium">{santri.fullName}</span> akan direset ke password baru secara acak.
                                Santri tidak akan bisa login dengan password lama.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleResetPassword(santri.id, santri.fullName, santri.email)}
                                className="bg-amber-600 hover:bg-amber-700"
                              >
                                Ya, Reset Password
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Santri?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Data santri {santri.fullName} akan dihapus permanen beserta semua riwayat setoran.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(santri.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reset Password Result Dialog */}
      <Dialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Berhasil Direset</DialogTitle>
          </DialogHeader>
          {resetPasswordResult && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-medium text-amber-800 mb-2">
                  Password baru untuk {resetPasswordResult.santriName}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Email:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded text-sm">
                        {resetPasswordResult.email}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(resetPasswordResult.email)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Password Baru:</span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded text-sm font-bold">
                        {resetPasswordResult.password}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(resetPasswordResult.password)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Pastikan Anda menyimpan password ini karena tidak akan ditampilkan lagi.
              </p>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setResetPasswordResult(null);
                    setResetPasswordDialogOpen(false);
                  }}
                >
                  Selesai
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
