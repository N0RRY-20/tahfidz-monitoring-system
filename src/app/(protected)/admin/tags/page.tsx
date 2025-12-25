"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { IconPlus, IconTrash, IconTags } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Tag {
  id: string;
  category: string;
  tagText: string;
}

const CATEGORIES = [
  {
    name: "Makhraj",
    color:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  {
    name: "Tajwid",
    color:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  {
    name: "Kelancaran",
    color:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  {
    name: "Lagu",
    color:
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  {
    name: "Umum",
    color:
      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  },
];

function TagsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function BankKomentarPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasFetched = useRef(false);

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
    if (hasFetched.current) return;
    hasFetched.current = true;
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

  const getCategoryStyle = (categoryName: string) => {
    return CATEGORIES.find((c) => c.name === categoryName)?.color || "";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bank Komentar</h1>
            <p className="text-muted-foreground">
              Kelola tags penilaian untuk guru
            </p>
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <TagsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bank Komentar</h1>
          <p className="text-muted-foreground">
            Kelola tags penilaian untuk guru
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="size-4 mr-2" />
          Tambah Tag
        </Button>
      </div>

      {/* Tags Summary */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <IconTags className="size-4" />
        <span>
          Total {tags.length} tag dalam {Object.keys(tagsByCategory).length}{" "}
          kategori
        </span>
      </div>

      {/* Tags by Category */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const categoryTags = tagsByCategory[category.name] || [];
          return (
            <Card key={category.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="font-normal">
                    {categoryTags.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoryTags.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Belum ada tag</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categoryTags.map((tag) => (
                      <div
                        key={tag.id}
                        className={`group flex items-center gap-1 rounded-full border px-3 py-1 text-sm ${getCategoryStyle(
                          category.name
                        )}`}
                      >
                        <span>{tag.tagText}</span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
                            >
                              <IconTrash className="size-3 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tag <strong>&quot;{tag.tagText}&quot;</strong>{" "}
                                akan dihapus dari bank komentar.
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

      {/* Add Tag Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Tag Baru</DialogTitle>
            <DialogDescription>
              Tambahkan tag komentar baru ke bank komentar
            </DialogDescription>
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
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
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
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
