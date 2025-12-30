"use client";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { SUGGESTED_CATEGORIES } from "./types";

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formCategory: string;
  setFormCategory: (value: string) => void;
  formTagText: string;
  setFormTagText: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export function TagFormDialog({
  open,
  onOpenChange,
  formCategory,
  setFormCategory,
  formTagText,
  setFormTagText,
  onSubmit,
  submitting,
}: TagFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Tag Baru</DialogTitle>
          <DialogDescription>
            Tambahkan tag komentar baru ke bank komentar
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Kategori</Label>
            <Input
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              placeholder="Ketik kategori manual..."
              className="mt-1"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {SUGGESTED_CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => setFormCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Klik saran di atas atau ketik kategori baru.
            </p>
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
  );
}

interface TagDeleteAlertProps {
  tagText: string;
  onConfirm: () => void;
  children: React.ReactNode;
}

export function TagDeleteAlert({
  tagText,
  onConfirm,
  children,
}: TagDeleteAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tag?</AlertDialogTitle>
          <AlertDialogDescription>
            Tag <strong>&quot;{tagText}&quot;</strong> akan dihapus dari bank
            komentar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
