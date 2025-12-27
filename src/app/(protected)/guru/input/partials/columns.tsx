"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export interface SantriData {
  id: string;
  fullName: string;
  className: string | null;
  lastSetoran?: {
    date: string;
    surahName: string;
    colorStatus: "G" | "Y" | "R";
  } | null;
}

interface ColumnsProps {
  onSelectSantri: (santriId: string) => void;
}

export function getColumns({
  onSelectSantri,
}: ColumnsProps): ColumnDef<SantriData>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Nama Santri",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "className",
      header: "Halaqah",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground">
          {row.getValue("className") || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "lastSetoran",
      header: "Setoran Terakhir",
      cell: ({ row }) => {
        const lastSetoran = row.original.lastSetoran;
        if (!lastSetoran) {
          return (
            <span className="text-muted-foreground text-sm">Belum ada</span>
          );
        }

        let statusColor = "bg-slate-100 text-slate-600";
        let statusText = "-";

        if (lastSetoran.colorStatus === "G") {
          statusColor =
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
          statusText = "Mutqin";
        } else if (lastSetoran.colorStatus === "Y") {
          statusColor =
            "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
          statusText = "Jayyid";
        } else if (lastSetoran.colorStatus === "R") {
          statusColor =
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
          statusText = "Rasib";
        }

        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">{lastSetoran.surahName}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {lastSetoran.date}
              </span>
              <Badge className={statusColor}>{statusText}</Badge>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            size="sm"
            onClick={() => onSelectSantri(row.original.id)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <IconPlus className="h-4 w-4 mr-1" />
            Input
          </Button>
        </div>
      ),
    },
  ];
}
