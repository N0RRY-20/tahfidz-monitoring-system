"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconPlus, IconBook, IconRotate } from "@tabler/icons-react";

interface SetoranRecord {
  date: string;
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
  colorStatus: "G" | "Y" | "R";
}

export interface SantriData {
  id: string;
  fullName: string;
  className: string | null;
  lastZiyadah?: SetoranRecord | null;
  lastMurajaah?: SetoranRecord | null;
}

interface ColumnsProps {
  onSelectSantri: (santriId: string) => void;
}

function getStatusBadge(colorStatus: "G" | "Y" | "R") {
  const configs = {
    G: {
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      text: "Mutqin",
    },
    Y: {
      color:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      text: "Jayyid",
    },
    R: {
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      text: "Rasib",
    },
  };
  const config = configs[colorStatus];
  return <Badge className={config.color}>{config.text}</Badge>;
}

function SetoranCell({
  record,
  type,
}: {
  record: SetoranRecord | null | undefined;
  type: "ziyadah" | "murajaah";
}) {
  if (!record) {
    return <span className="text-muted-foreground text-xs">Belum ada</span>;
  }

  const today = new Date().toISOString().split("T")[0];
  const isToday = record.date === today;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        {type === "ziyadah" ? (
          <IconBook className="h-3 w-3 text-blue-500" />
        ) : (
          <IconRotate className="h-3 w-3 text-orange-500" />
        )}
        <span className="text-sm font-medium">
          {record.surahName}: {record.ayatStart}-{record.ayatEnd}
        </span>
        {isToday && (
          <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            Hari Ini
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{record.date}</span>
        {getStatusBadge(record.colorStatus)}
      </div>
    </div>
  );
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
      header: "Kelas",
      cell: ({ row }) => (
        <Badge variant="outline" className="text-muted-foreground">
          {row.getValue("className") || "-"}
        </Badge>
      ),
    },
    {
      accessorKey: "lastZiyadah",
      header: () => (
        <div className="flex items-center gap-1">
          <IconBook className="h-4 w-4 text-blue-500" />
          Ziyadah Terakhir
        </div>
      ),
      cell: ({ row }) => (
        <SetoranCell record={row.original.lastZiyadah} type="ziyadah" />
      ),
    },
    {
      accessorKey: "lastMurajaah",
      header: () => (
        <div className="flex items-center gap-1">
          <IconRotate className="h-4 w-4 text-orange-500" />
          Murajaah Terakhir
        </div>
      ),
      cell: ({ row }) => (
        <SetoranCell record={row.original.lastMurajaah} type="murajaah" />
      ),
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
