"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, BookOpen, RotateCcw, Plus, ChevronRight } from "lucide-react";

interface SetoranInfo {
  surahName: string;
  colorStatus: "G" | "Y" | "R";
}

interface SantriCardData {
  id: string;
  fullName: string;
  className: string | null;
  lastZiyadah: SetoranInfo | null;
  lastMurajaah: SetoranInfo | null;
}

interface SantriListProps {
  santriList: SantriCardData[];
}

function getStatusColor(status: "G" | "Y" | "R") {
  switch (status) {
    case "G":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Y":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "R":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
}

function getStatusText(status: "G" | "Y" | "R") {
  switch (status) {
    case "G":
      return "Mutqin";
    case "Y":
      return "Jayyid";
    case "R":
      return "Rasib";
  }
}

export function SantriList({ santriList }: SantriListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daftar Santri Binaan</h2>
        <Link
          href="/guru/input"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          Lihat Semua
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {santriList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Belum ada santri yang ditugaskan kepada Anda.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Hubungi Admin untuk mapping santri.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {santriList.map((santri) => (
            <Card
              key={santri.id}
              className="hover:shadow-lg transition-all hover:border-emerald-300 dark:hover:border-emerald-700"
            >
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{santri.fullName}</h3>
                    <Badge variant="outline" className="mt-1">
                      {santri.className || "Belum ada kelas"}
                    </Badge>
                  </div>
                </div>

                {/* Setoran Terakhir */}
                <div className="space-y-3 mb-4">
                  {/* Ziyadah */}
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-muted-foreground">Ziyadah:</span>
                    {santri.lastZiyadah ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium">
                          {santri.lastZiyadah.surahName}
                        </span>
                        <Badge
                          className={`text-xs ${getStatusColor(
                            santri.lastZiyadah.colorStatus
                          )}`}
                        >
                          {getStatusText(santri.lastZiyadah.colorStatus)}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Belum ada
                      </span>
                    )}
                  </div>

                  {/* Murajaah */}
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="text-muted-foreground">Murajaah:</span>
                    {santri.lastMurajaah ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium">
                          {santri.lastMurajaah.surahName}
                        </span>
                        <Badge
                          className={`text-xs ${getStatusColor(
                            santri.lastMurajaah.colorStatus
                          )}`}
                        >
                          {getStatusText(santri.lastMurajaah.colorStatus)}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Belum ada
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Link href={`/guru/input?santriId=${santri.id}`}>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Input Setoran
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
