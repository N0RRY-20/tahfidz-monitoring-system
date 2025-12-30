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
import { IconLoader2, IconAlertTriangle } from "@tabler/icons-react";

interface DeleteUserAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string | null;
  onConfirm: () => void;
  submitting: boolean;
}

export function DeleteUserAlert({
  open,
  onOpenChange,
  userName,
  onConfirm,
  submitting,
}: DeleteUserAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <IconAlertTriangle className="size-5" />
            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold text-foreground">
              {userName || "ini"}
            </span>
            ? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data
            terkait.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={submitting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {submitting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
            Hapus User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
