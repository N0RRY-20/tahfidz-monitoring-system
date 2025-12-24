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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  id: string;
  category: string;
  tagText: string;
}

const CATEGORIES = ["Makhraj", "Tajwid", "Kelancaran", "Lagu", "Umum"];

export default function BankKomentarPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formCategory, setFormCategory] = useState("");
  const [formTagText, setFormTagText] = useState("");

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTags(data);
    } catch {
      toast.error("Gagal memuat data tags");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory || !formTagText) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formCategory,
          tagText: formTagText,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menambah tag");
      }

      toast.success("Tag berhasil ditambahkan");
      setFormCategory("");
      setFormTagText("");
      setDialogOpen(false);
      fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambah tag");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/tags/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus tag");
      }

      toast.success("Tag berhasil dihapus");
      fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus tag");
    }
  };

  // Group tags by category
  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bank Komentar</h1>
          <p className="text-slate-600">Kelola tags penilaian untuk guru</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Tag Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Kategori</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Teks Komentar</Label>
                <Input
                  value={formTagText}
                  onChange={(e) => setFormTagText(e.target.value)}
                  placeholder="Contoh: Kurang Dengung"
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
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags by Category */}
      {CATEGORIES.map((category) => {
        const categoryTags = tagsByCategory[category] || [];
        return (
          <Card key={category}>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">{category}</h3>
              {categoryTags.length === 0 ? (
                <p className="text-slate-500 text-sm">Belum ada tag</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categoryTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center gap-2 bg-slate-100 rounded-full pl-4 pr-2 py-1"
                    >
                      <span className="text-sm">{tag.tagText}</span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tag &quot;{tag.tagText}&quot; akan dihapus dari bank komentar.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(tag.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
