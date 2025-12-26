"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportData } from "./types";
import { toast } from "sonner";

interface ReportExportProps {
  data: ReportData[];
}

export function ReportExport({ data }: ReportExportProps) {
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Laporan Hafalan Santri", 14, 20);
      doc.setFontSize(11);
      doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`,
        14,
        28
      );

      // Table Data
      const tableData = data.map((row) => [
        row.santriName,
        row.className || "-",
        row.guruName || "-",
        row.totalSetoran,
        row.totalAyat,
        row.greenCount,
        row.yellowCount,
        row.redCount,
      ]);

      const headers = [
        [
          "Nama Santri",
          "Halaqah",
          "Guru",
          "Total Setoran",
          "Total Ayat",
          "Mutqin",
          "Jayyid",
          "Rasib",
        ],
      ];

      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 35,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }, // Blue header
        styles: { fontSize: 8 },
      });

      doc.save(`Laporan-Tahfidz-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Laporan berhasil diexport ke PDF");
    } catch {
      toast.error("Gagal export PDF");
    }
  };

  return (
    <Button onClick={handleExportPDF} variant="outline">
      <FileText className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
}
