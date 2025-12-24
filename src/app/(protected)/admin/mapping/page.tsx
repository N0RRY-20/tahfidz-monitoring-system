"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Santri {
  id: string;
  fullName: string;
  classId: string | null;
  className: string | null;
  guruId: string | null;
  guruName: string | null;
}

interface Guru {
  id: string;
  name: string;
  santriCount: number;
}

interface Kelas {
  id: string;
  name: string;
}

export default function MappingSantriPage() {
  const [santris, setSantris] = useState<Santri[]>([]);
  const [gurus, setGurus] = useState<Guru[]>([]);
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedSantris, setSelectedSantris] = useState<string[]>([]);
  const [targetGuruId, setTargetGuruId] = useState("");
  const [filterClassId, setFilterClassId] = useState("all");

  const fetchData = async () => {
    try {
      const [santriRes, guruRes, kelasRes] = await Promise.all([
        fetch("/api/admin/santri"),
        fetch("/api/admin/guru"),
        fetch("/api/kelas"),
      ]);
      if (!santriRes.ok || !guruRes.ok || !kelasRes.ok) throw new Error("Failed to fetch");
      const [santriData, guruData, kelasData] = await Promise.all([
        santriRes.json(),
        guruRes.json(),
        kelasRes.json(),
      ]);
      setSantris(santriData);
      setGurus(guruData);
      setKelasList(kelasData);
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBulkAssign = async () => {
    if (selectedSantris.length === 0) {
      toast.error("Pilih santri terlebih dahulu");
      return;
    }
    if (!targetGuruId) {
      toast.error("Pilih guru tujuan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          santriIds: selectedSantris,
          guruId: targetGuruId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mapping santri");
      }

      toast.success(`${selectedSantris.length} santri berhasil di-mapping`);
      setSelectedSantris([]);
      setTargetGuruId("");
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mapping santri");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSantri = (id: string) => {
    setSelectedSantris((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const filtered = filteredSantris.map((s) => s.id);
    if (selectedSantris.length === filtered.length) {
      setSelectedSantris([]);
    } else {
      setSelectedSantris(filtered);
    }
  };

  // Filter santris
  const filteredSantris = filterClassId && filterClassId !== "all"
    ? santris.filter((s) => s.classId === filterClassId)
    : santris;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mapping Santri</h1>
        <p className="text-slate-600">Assign santri ke guru pembimbing</p>
      </div>

      {/* Guru Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gurus.map((guru) => (
          <Card key={guru.id}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium">{guru.name}</p>
                  <p className="text-sm text-slate-500">
                    {guru.santriCount} santri
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Assign Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Assign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-slate-600 mb-2">
                {selectedSantris.length} santri terpilih
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-slate-400" />
              <Select value={targetGuruId} onValueChange={setTargetGuruId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih Guru Tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {gurus.map((guru) => (
                    <SelectItem key={guru.id} value={guru.id}>
                      {guru.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleBulkAssign} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Assign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter & Select All */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={filterClassId} onValueChange={setFilterClassId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter Kelas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kelas</SelectItem>
            {kelasList.map((kelas) => (
              <SelectItem key={kelas.id} value={kelas.id}>
                {kelas.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={selectAll}>
          {selectedSantris.length === filteredSantris.length
            ? "Batal Pilih Semua"
            : "Pilih Semua"}
        </Button>
      </div>

      {/* Santri List */}
      <Card>
        <CardContent className="pt-6">
          {filteredSantris.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Tidak ada santri ditemukan
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSantris.map((santri) => (
                <div
                  key={santri.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedSantris.includes(santri.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleSantri(santri.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedSantris.includes(santri.id)}
                      onCheckedChange={() => toggleSantri(santri.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{santri.fullName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {santri.className || "-"}
                        </Badge>
                        {santri.guruName && (
                          <span className="text-xs text-slate-500">
                            → {santri.guruName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
