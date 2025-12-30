"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useState } from "react";

interface KelasFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialData?: {
    name: string;
    description: string;
  };
  onSubmit: (data: { name: string; description: string }) => void;
  submitting: boolean;
}

export function KelasFormDialog({
  open,
  onOpenChange,
  title,
  initialData,
  onSubmit,
  submitting,
}: KelasFormProps) {
  // State initialized from props - parent should use key prop to reset when needed
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Nama kelas wajib diisi");
      return;
    }
    onSubmit({ name, description });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Kelas *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kelas A, Kelas B"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Kelas tingkat dasar"
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Spinner className="mr-2 h-4 w-4" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
