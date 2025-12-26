"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ReportData } from "./types";

export const columns: ColumnDef<ReportData>[] = [
  {
    accessorKey: "santriName",
    header: "Nama Santri",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("santriName")}</div>;
    },
  },
  {
    accessorKey: "className",
    header: "Halaqah",
    cell: ({ row }) => {
      const className = row.original.className;
      return <Badge variant="outline">{className || "-"}</Badge>;
    },
  },
  {
    accessorKey: "guruName",
    header: "Guru Pembimbing",
    cell: ({ row }) => {
      return <div>{row.getValue("guruName") || "-"}</div>;
    },
  },
  {
    accessorKey: "totalSetoran",
    header: () => <div className="text-center">Total Setoran</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("totalSetoran")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAyat",
    header: () => <div className="text-center">Total Ayat</div>,
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.getValue("totalAyat")}
        </div>
      );
    },
  },
  {
    accessorKey: "greenCount",
    header: () => <div className="text-center">Mutqin</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 w-8 justify-center">
            {row.getValue("greenCount")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "yellowCount",
    header: () => <div className="text-center">Jayyid</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 w-8 justify-center">
            {row.getValue("yellowCount")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "redCount",
    header: () => <div className="text-center">Rasib</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 w-8 justify-center">
            {row.getValue("redCount")}
          </Badge>
        </div>
      );
    },
  },
];
