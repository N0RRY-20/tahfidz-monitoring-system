"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { IconLoader2, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Surah {
  id: number;
  surahName: string;
  totalAyat: number;
}

interface Tag {
  id: string;
  category: string;
  tagText: string;
}

interface TodaySetoranInfo {
  surahName: string;
  ayatStart: number;
  ayatEnd: number;
}

interface InputFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  santriId: string;
  santriName: string;
  surahList: Surah[];
  tagsList: Tag[];
  onSuccess: () => void;
  todayZiyadah?: TodaySetoranInfo | null;
  todayMurajaah?: TodaySetoranInfo | null;
}

export function InputFormDrawer({
  open,
  onOpenChange,
  santriId,
  santriName,
  surahList,
  tagsList,
  onSuccess,
  todayZiyadah,
  todayMurajaah,
}: InputFormDrawerProps) {
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [type, setType] = useState<"ziyadah" | "murajaah">("ziyadah");
  const [surahId, setSurahId] = useState("");
  const [ayatStart, setAyatStart] = useState("");
  const [ayatEnd, setAyatEnd] = useState("");
  const [colorStatus, setColorStatus] = useState<"G" | "Y" | "R" | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Get max ayat for selected surah
  const selectedSurah = surahList.find((s) => s.id.toString() === surahId);
  const maxAyat = selectedSurah?.totalAyat || 999;

  // Group tags by category
  const tagsByCategory = tagsList.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const resetForm = () => {
    setType("ziyadah");
    setSurahId("");
    setAyatStart("");
    setAyatEnd("");
    setColorStatus("");
    setSelectedTags([]);
    setNotes("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!surahId) {
      toast.error("Pilih surat terlebih dahulu");
      return;
    }
    if (!ayatStart || !ayatEnd) {
      toast.error("Masukkan ayat mulai dan akhir");
      return;
    }
    if (parseInt(ayatStart) > parseInt(ayatEnd)) {
      toast.error("Ayat mulai tidak boleh lebih besar dari ayat akhir");
      return;
    }
    if (parseInt(ayatEnd) > maxAyat) {
      toast.error(`Ayat akhir tidak boleh lebih dari ${maxAyat}`);
      return;
    }
    if (!colorStatus) {
      toast.error("Pilih penilaian warna");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/guru/input-setoran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          santriId,
          type,
          surahId: parseInt(surahId),
          ayatStart: parseInt(ayatStart),
          ayatEnd: parseInt(ayatEnd),
          colorStatus,
          tagIds: selectedTags,
          notes: notes.slice(0, 150),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan data");
      }

      toast.success("Setoran berhasil disimpan!");
      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan setoran"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent
        className={isMobile ? "max-h-[90vh]" : "w-[480px] max-w-full"}
      >
        <DrawerHeader>
          <DrawerTitle>Input Setoran</DrawerTitle>
          <DrawerDescription>
            Catat setoran hafalan untuk <strong>{santriName}</strong>
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4 space-y-6">
          {/* Jenis Setoran */}
          <div className="space-y-2">
            <Label>Jenis Setoran</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "ziyadah" | "murajaah")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ziyadah" id="ziyadah" />
                <Label htmlFor="ziyadah" className="cursor-pointer">
                  Ziyadah (Baru)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="murajaah" id="murajaah" />
                <Label htmlFor="murajaah" className="cursor-pointer">
                  Murajaah (Ulang)
                </Label>
              </div>
            </RadioGroup>
            {/* Info if already inputted today (nyicil mode) */}
            {todayZiyadah && type === "ziyadah" && (
              <Alert className="mt-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <IconInfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  Santri telah setor hari ini:{" "}
                  <strong>QS {todayZiyadah.surahName}</strong> Ayat{" "}
                  <strong>
                    {todayZiyadah.ayatStart}-{todayZiyadah.ayatEnd}
                  </strong>
                  . Input baru akan menggabungkan data.
                </AlertDescription>
              </Alert>
            )}
            {todayMurajaah && type === "murajaah" && (
              <Alert className="mt-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                <IconInfoCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  Santri telah setor hari ini:{" "}
                  <strong>QS {todayMurajaah.surahName}</strong> Ayat{" "}
                  <strong>
                    {todayMurajaah.ayatStart}-{todayMurajaah.ayatEnd}
                  </strong>
                  . Input baru akan menggabungkan data.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Pilih Surat */}
          <div className="space-y-2">
            <Label>Surat</Label>
            <Select value={surahId} onValueChange={setSurahId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih surat..." />
              </SelectTrigger>
              <SelectContent>
                {surahList.map((surah) => (
                  <SelectItem key={surah.id} value={surah.id.toString()}>
                    {surah.id}. {surah.surahName} ({surah.totalAyat} ayat)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ayat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ayat Mulai</Label>
              <Input
                type="number"
                min="1"
                max={maxAyat}
                value={ayatStart}
                onChange={(e) => setAyatStart(e.target.value)}
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Ayat Akhir</Label>
              <Input
                type="number"
                min="1"
                max={maxAyat}
                value={ayatEnd}
                onChange={(e) => setAyatEnd(e.target.value)}
                placeholder={maxAyat.toString()}
              />
            </div>
          </div>

          {/* Penilaian Warna */}
          <div className="space-y-3">
            <Label>Penilaian</Label>
            <ToggleGroup
              type="single"
              value={colorStatus}
              onValueChange={(value) => {
                if (value) setColorStatus(value as "G" | "Y" | "R");
              }}
              className="grid grid-cols-3 gap-3"
            >
              <ToggleGroupItem
                value="G"
                className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl border-2 data-[state=on]:border-green-500 data-[state=on]:bg-green-50 dark:data-[state=on]:bg-green-900/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Mutqin
                  </p>
                  <p className="text-xs text-muted-foreground">Lancar</p>
                </div>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="Y"
                className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl border-2 data-[state=on]:border-yellow-500 data-[state=on]:bg-yellow-50 dark:data-[state=on]:bg-yellow-900/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-sm" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Jayyid
                  </p>
                  <p className="text-xs text-muted-foreground">Baik</p>
                </div>
              </ToggleGroupItem>

              <ToggleGroupItem
                value="R"
                className="flex flex-col items-center gap-2 p-4 h-auto rounded-xl border-2 data-[state=on]:border-red-500 data-[state=on]:bg-red-50 dark:data-[state=on]:bg-red-900/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-600 shadow-sm" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Rasib
                  </p>
                  <p className="text-xs text-muted-foreground">Perlu Ulang</p>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Tags */}
          {Object.keys(tagsByCategory).length > 0 && (
            <div className="space-y-4">
              <Label>Komentar Penilaian</Label>
              {Object.entries(tagsByCategory).map(
                ([category, tags], categoryIndex) => {
                  // Different color schemes per category
                  const colorSchemes = [
                    {
                      selected: "bg-blue-500 text-white hover:bg-blue-600",
                      unselected:
                        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
                    },
                    {
                      selected: "bg-purple-500 text-white hover:bg-purple-600",
                      unselected:
                        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
                    },
                    {
                      selected: "bg-orange-500 text-white hover:bg-orange-600",
                      unselected:
                        "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
                    },
                    {
                      selected: "bg-pink-500 text-white hover:bg-pink-600",
                      unselected:
                        "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800",
                    },
                    {
                      selected: "bg-cyan-500 text-white hover:bg-cyan-600",
                      unselected:
                        "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800",
                    },
                  ];
                  const colors =
                    colorSchemes[categoryIndex % colorSchemes.length];

                  return (
                    <div key={category}>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const isSelected = selectedTags.includes(tag.id);
                          return (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={`cursor-pointer transition-all px-3 py-1.5 text-sm ${
                                isSelected ? colors.selected : colors.unselected
                              }`}
                              onClick={() => toggleTag(tag.id)}
                            >
                              {tag.tagText}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* Catatan */}
          <div className="space-y-2">
            <Label>Catatan (Opsional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan khusus..."
              maxLength={150}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{notes.length}/150</p>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {submitting ? (
              <>
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Setoran"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Batal</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
