"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";
import { Tag } from "./partials/types";
import { TagsSkeleton } from "./partials/tags-skeleton";
import { TagFormDialog } from "./partials/tags-dialogs";
import { TagsList } from "./partials/tags-list";

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Bank Komentar
            </h1>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            Bank Komentar
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola tags penilaian untuk guru
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="size-4 mr-2" />
          Tambah Tag
        </Button>
      </div>

      <TagsList
        tags={tags}
        onDelete={handleDelete}
        setDialogOpen={setDialogOpen}
      />

      <TagFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formTagText={formTagText}
        setFormTagText={setFormTagText}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
