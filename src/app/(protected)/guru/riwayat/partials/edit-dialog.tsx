"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RiwayatData } from "./columns";

interface EditDialogProps {
  record: RiwayatData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditDialog({
  record,
  open,
  onOpenChange,
  onSuccess,
}: EditDialogProps) {
  const [colorStatus, setColorStatus] = useState<"G" | "Y" | "R">("G");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync state when record changes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && record) {
      setColorStatus(record.colorStatus);
      setNotes(record.notes || "");
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async () => {
    if (!record) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/guru/edit-setoran/${record.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorStatus,
          notesText: notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengupdate");
      }

      toast.success("Data berhasil diupdate");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengupdate data");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Setoran</DialogTitle>
        </DialogHeader>
        {record && (
          <div className="space-y-4">
            {/* Info (Read-only) */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-1">
              <p className="font-medium">{record.santriName}</p>
              <p className="text-sm text-muted-foreground">
                {record.surahName}, Ayat {record.ayatStart} - {record.ayatEnd}
              </p>
              <Badge variant="secondary">
                {record.type === "ziyadah" ? "Ziyadah" : "Murajaah"}
              </Badge>
            </div>

            {/* Status Warna */}
            <div>
              <Label>Status Penilaian</Label>
              <Select
                value={colorStatus}
                onValueChange={(v) => setColorStatus(v as "G" | "Y" | "R")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      Hijau - Mutqin
                    </div>
                  </SelectItem>
                  <SelectItem value="Y">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      Kuning - Jayyid
                    </div>
                  </SelectItem>
                  <SelectItem value="R">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      Merah - Rasib
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Catatan */}
            <div>
              <Label>Catatan (Opsional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan..."
                className="mt-1"
                rows={3}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
