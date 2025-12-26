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
import { Loader2 } from "lucide-react";

interface RemoveRoleAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    roleName: string;
    userName: string;
  } | null;
  onConfirm: () => void;
  submitting: boolean;
}

export function RemoveRoleAlert({
  open,
  onOpenChange,
  data,
  onConfirm,
  submitting,
}: RemoveRoleAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Role?</AlertDialogTitle>
          <AlertDialogDescription>
            Role <strong>{data?.roleName}</strong> akan dihapus dari user{" "}
            <strong>{data?.userName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Hapus Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
