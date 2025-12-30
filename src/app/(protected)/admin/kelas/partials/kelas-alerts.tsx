"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { Kelas } from "./types";

interface DeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Kelas | null;
  onConfirm: () => void;
  submitting: boolean;
}

export function DeleteAlert({
  open,
  onOpenChange,
  data,
  onConfirm,
  submitting,
}: DeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kelas?</AlertDialogTitle>
          <AlertDialogDescription>
            Kelas <strong>{data?.name}</strong> akan dihapus permanen. Tindakan
            ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={submitting}
          >
            {submitting && <Spinner className="mr-2 h-4 w-4 text-white" />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
