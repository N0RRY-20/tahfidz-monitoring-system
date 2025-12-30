"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

export interface RiwayatData {
  id: string;
  santriName: string;
  santriClass: string | null;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
  colorStatus: "G" | "Y" | "R";
  type: "ziyadah" | "murajaah";
  notes: string | null;
  tags: string[];
  date: string;
  createdAt: string;
  canEdit: boolean;
}

interface ColumnsProps {
  onEdit: (record: RiwayatData) => void;
  onDelete: (record: RiwayatData) => void;
}

function getColorBadge(status: "G" | "Y" | "R") {
  switch (status) {
    case "G":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Mutqin
        </Badge>
      );
    case "Y":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          Jayyid
        </Badge>
      );
    case "R":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Rasib
        </Badge>
      );
  }
}

export function getColumns({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<RiwayatData>[] {
  return [
    {
      accessorKey: "santriName",
      header: "Santri",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.santriName}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {row.original.santriClass || "-"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "surahName",
      header: "Surat & Ayat",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.surahName}</div>
          <span className="text-sm text-muted-foreground">
            Ayat {row.original.ayatStart} - {row.original.ayatEnd}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "colorStatus",
      header: "Status",
      cell: ({ row }) => getColorBadge(row.original.colorStatus),
    },
    {
      accessorKey: "createdAt",
      header: "Waktu",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
            locale: localeId,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => {
        const record = row.original;

        if (!record.canEdit) {
          return (
            <div className="text-right">
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Lewat 24 jam
              </Badge>
            </div>
          );
        }

        return (
          <div className="text-right space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(record)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(record)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
