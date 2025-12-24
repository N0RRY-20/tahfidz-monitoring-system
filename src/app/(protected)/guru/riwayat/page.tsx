"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Pencil, Trash2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Record {
  id: string;
  santriName: string;
  santriClass: string;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
  colorStatus: "G" | "Y" | "R";
  type: "ziyadah" | "murajaah";
  notes: string | null;
  tags: string[];
  date: string;
  createdAt: string;
  canEdit: boolean;
}

function getColorBadge(status: "G" | "Y" | "R") {
  switch (status) {
    case "G":
      return <Badge className="bg-green-500">Hijau - Mutqin</Badge>;
    case "Y":
      return <Badge className="bg-yellow-500">Kuning - Jayyid</Badge>;
    case "R":
      return <Badge className="bg-red-500">Merah - Rasib</Badge>;
  }
}

export default function RiwayatPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/guru/riwayat");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data);
    } catch {
      setError("Gagal memuat riwayat. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (recordId: string) => {
    setDeleting(recordId);
    try {
      const res = await fetch(`/api/guru/delete-setoran/${recordId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus");
      }

      toast.success("Data berhasil dihapus");
      fetchRecords();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus data"
      );
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Input</h1>
        <p className="text-slate-600">
          Data setoran yang sudah Anda input hari ini
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

      {records.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            Belum ada riwayat input hari ini.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card
              key={record.id}
              className={!record.canEdit ? "opacity-75" : ""}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">
                        {record.santriName}
                      </h3>
                      <Badge variant="outline">{record.santriClass}</Badge>
                      <Badge variant="secondary">
                        {record.type === "ziyadah" ? "Ziyadah" : "Murajaah"}
                      </Badge>
                    </div>

                    <p className="text-slate-600">
                      <span className="font-medium">{record.surahName}</span>,
                      Ayat {record.ayatStart} - {record.ayatEnd}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {getColorBadge(record.colorStatus)}
                      {record.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {record.notes && (
                      <p className="text-sm text-slate-500 italic">
                        &quot;{record.notes}&quot;
                      </p>
                    )}

                    <p className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(record.createdAt), {
                        addSuffix: true,
                        locale: localeId,
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {record.canEdit ? (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Setoran</DialogTitle>
                            </DialogHeader>
                            <p className="text-sm text-slate-600">
                              Fitur edit akan segera tersedia. Untuk sementara,
                              Anda dapat menghapus data ini dan input ulang.
                            </p>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Tutup</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deleting === record.id}
                            >
                              {deleting === record.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Hapus
                                </>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus Data Setoran?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Data setoran {record.santriName} pada surat{" "}
                                {record.surahName} akan dihapus permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(record.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Tidak bisa diedit ({">"}24 jam)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
