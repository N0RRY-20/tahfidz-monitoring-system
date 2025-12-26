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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Loader2, CheckCircle2, User, Key, Mail } from "lucide-react";
import { toast } from "sonner";
import { Guru, Kelas } from "./types";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Dialog Form Create / Edit ---

interface SantriFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialData?: {
    name: string;
    classId: string;
    guruId: string;
    dob: string;
  };
  onSubmit: (data: {
    fullName: string;
    classId: string;
    assignedGuruId: string;
    dob: string;
  }) => void;
  submitting: boolean;
  kelasList: Kelas[];
  gurus: Guru[];
}

export function SantriFormDialog({
  open,
  onOpenChange,
  title,
  initialData,
  onSubmit,
  submitting,
  kelasList,
  gurus,
}: SantriFormProps) {
  // State initialized from props - parent should use key prop to reset when needed
  const [name, setName] = useState(initialData?.name || "");
  const [classId, setClassId] = useState(initialData?.classId || "none");
  const [guruId, setGuruId] = useState(initialData?.guruId || "none");
  const [dob, setDob] = useState(initialData?.dob || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Nama santri wajib diisi");
      return;
    }
    onSubmit({
      fullName: name,
      classId: classId === "none" ? "" : classId,
      assignedGuruId: guruId === "none" ? "" : guruId,
      dob,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nama Lengkap *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama santri"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Halaqah</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih halaqah (opsional)" />
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
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Guru Pembimbing</Label>
            <Select value={guruId} onValueChange={setGuruId}>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
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

// --- Dialog Success Credentials ---

interface CredentialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  data: {
    email: string;
    password: string;
    name?: string;
  } | null;
}

export function CredentialDialog({
  open,
  onOpenChange,
  title,
  message,
  data,
}: CredentialDialogProps) {
  if (!data) return null;

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === "email" ? "Email" : "Password"} disalin!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center pb-2">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl text-center">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="text-center text-muted-foreground text-sm px-4">
            {message}
          </div>

          {data.name && (
            <div className="flex items-center justify-center gap-2 text-sm font-medium pt-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{data.name}</span>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-muted/50 border rounded-lg p-4 space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5 ml-1">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white dark:bg-background border rounded-md h-9 px-3 text-sm flex items-center font-medium font-mono text-slate-800 dark:text-slate-200">
                  {data.email}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-accent dark:hover:text-accent-foreground"
                  onClick={() => copyToClipboard(data.email, "email")}
                  title="Salin Email"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5 ml-1">
                <Key className="h-3 w-3" /> Password
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white dark:bg-background border rounded-md h-9 px-3 text-sm flex items-center font-bold font-mono text-slate-900 dark:text-slate-200">
                  {data.password}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 shrink-0 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-accent dark:hover:text-accent-foreground"
                  onClick={() => copyToClipboard(data.password, "password")}
                  title="Salin Password"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Alert
            variant="default"
            className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
          >
            <AlertTitle className="text-xs font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
              Penting
            </AlertTitle>
            <AlertDescription className="text-xs text-amber-700/90 dark:text-amber-300/90 mt-1">
              Harap simpan kredensial ini segera. Password tidak akan
              ditampilkan lagi setelah jendela ini ditutup.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="sm:justify-center pt-2">
          <Button
            className="w-full sm:w-auto min-w-[120px]"
            onClick={() => onOpenChange(false)}
          >
            Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
