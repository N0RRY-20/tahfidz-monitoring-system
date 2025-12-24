"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Santri {
  id: string;
  fullName: string;
  className: string | null;
}

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

export default function InputSetoranPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedSantriId = searchParams.get("santriId");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  // Form state
  const [santriId, setSantriId] = useState(preselectedSantriId || "");
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

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [santriRes, surahRes, tagsRes] = await Promise.all([
          fetch("/api/guru/santri-binaan"),
          fetch("/api/quran"),
          fetch("/api/tags"),
        ]);

        if (!santriRes.ok || !surahRes.ok || !tagsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [santriData, surahData, tagsData] = await Promise.all([
          santriRes.json(),
          surahRes.json(),
          tagsRes.json(),
        ]);

        setSantriList(santriData);
        setSurahList(surahData);
        setTagsList(tagsData);
      } catch {
        setError("Gagal memuat data. Silakan refresh halaman.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Group tags by category
  const tagsByCategory = tagsList.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!santriId) {
      setError("Pilih santri terlebih dahulu");
      return;
    }
    if (!surahId) {
      setError("Pilih surat terlebih dahulu");
      return;
    }
    if (!ayatStart || !ayatEnd) {
      setError("Masukkan ayat mulai dan akhir");
      return;
    }
    if (parseInt(ayatStart) > parseInt(ayatEnd)) {
      setError("Ayat mulai tidak boleh lebih besar dari ayat akhir");
      return;
    }
    if (parseInt(ayatEnd) > maxAyat) {
      setError(`Ayat akhir tidak boleh lebih dari ${maxAyat}`);
      return;
    }
    if (!colorStatus) {
      setError("Pilih penilaian warna (Hijau/Kuning/Merah)");
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

      setSuccess(true);
      toast.success("Setoran berhasil disimpan!");

      // Reset form
      setSantriId("");
      setType("ziyadah");
      setSurahId("");
      setAyatStart("");
      setAyatEnd("");
      setColorStatus("");
      setSelectedTags([]);
      setNotes("");

      // Redirect after delay
      setTimeout(() => {
        router.push("/guru/riwayat");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Koneksi Gagal, Data Belum Tersimpan"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Input Setoran</h1>
        <p className="text-slate-600">Catat setoran hafalan santri</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Setoran berhasil disimpan!
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pilih Santri */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilih Santri</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={santriId} onValueChange={setSantriId}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Pilih nama santri..." />
              </SelectTrigger>
              <SelectContent>
                {santriList.map((santri) => (
                  <SelectItem key={santri.id} value={santri.id}>
                    {santri.fullName} ({santri.className || "-"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Jenis Setoran */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jenis Setoran</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "ziyadah" | "murajaah")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ziyadah" id="ziyadah" />
                <Label htmlFor="ziyadah" className="text-base cursor-pointer">
                  Ziyadah (Hafalan Baru)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="murajaah" id="murajaah" />
                <Label htmlFor="murajaah" className="text-base cursor-pointer">
                  Murajaah (Mengulang)
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Pilih Surat & Ayat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Surat & Ayat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Pilih Surat</Label>
              <Select value={surahId} onValueChange={setSurahId}>
                <SelectTrigger className="h-12 text-base mt-1">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ayat Mulai</Label>
                <Input
                  type="number"
                  min="1"
                  max={maxAyat}
                  value={ayatStart}
                  onChange={(e) => setAyatStart(e.target.value)}
                  className="h-12 text-base mt-1"
                  placeholder="1"
                />
              </div>
              <div>
                <Label>Ayat Akhir</Label>
                <Input
                  type="number"
                  min="1"
                  max={maxAyat}
                  value={ayatEnd}
                  onChange={(e) => setAyatEnd(e.target.value)}
                  className="h-12 text-base mt-1"
                  placeholder={maxAyat.toString()}
                />
              </div>
            </div>
            {selectedSurah && (
              <p className="text-sm text-slate-500">
                Total ayat surat {selectedSurah.surahName}: {selectedSurah.totalAyat}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Penilaian Warna */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Penilaian (Wajib)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setColorStatus("G")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  colorStatus === "G"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 mx-auto mb-2"></div>
                <p className="font-medium text-green-700">Hijau</p>
                <p className="text-xs text-slate-500">Mutqin</p>
              </button>

              <button
                type="button"
                onClick={() => setColorStatus("Y")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  colorStatus === "Y"
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-200 hover:border-yellow-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                <p className="font-medium text-yellow-700">Kuning</p>
                <p className="text-xs text-slate-500">Jayyid</p>
              </button>

              <button
                type="button"
                onClick={() => setColorStatus("R")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  colorStatus === "R"
                    ? "border-red-600 bg-red-50"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-500 mx-auto mb-2"></div>
                <p className="font-medium text-red-700">Merah</p>
                <p className="text-xs text-slate-500">Rasib</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Komentar Penilaian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(tagsByCategory).map(([category, tags]) => (
              <div key={category}>
                <Label className="text-sm text-slate-500">{category}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-colors ${
                        selectedTags.includes(tag.id)
                          ? "bg-emerald-100 border-emerald-500 text-emerald-800"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Checkbox
                        checked={selectedTags.includes(tag.id)}
                        onCheckedChange={() => toggleTag(tag.id)}
                        className="hidden"
                      />
                      <span className="text-sm">{tag.tagText}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Catatan Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Catatan Manual (Opsional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahkan catatan khusus... (maks 150 karakter)"
              maxLength={150}
              className="min-h-[100px]"
            />
            <p className="text-sm text-slate-500 mt-1">{notes.length}/150</p>
          </CardContent>
        </Card>

        {/* Submit Button - Large & Thumb-friendly */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-14 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Setoran"
          )}
        </Button>
      </form>
    </div>
  );
}
