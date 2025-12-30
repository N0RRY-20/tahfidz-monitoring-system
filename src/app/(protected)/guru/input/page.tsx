"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getColumns, type SantriData } from "./partials/columns";
import { SantriTable } from "./partials/santri-table";
import { InputFormDrawer } from "./partials/input-form-drawer";
import { InputSetoranSkeleton } from "./partials/skeleton";

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

interface LastSetoran {
  santriId: string;
  lastZiyadah: {
    date: string;
    surahName: string;
    colorStatus: "G" | "Y" | "R";
  } | null;
  lastMurajaah: {
    date: string;
    surahName: string;
    colorStatus: "G" | "Y" | "R";
  } | null;
}

export default function InputSetoranPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [lastSetoranMap, setLastSetoranMap] = useState<
    Record<string, LastSetoran>
  >({});

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch data
  const fetchData = async () => {
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

      // Fetch last setoran for each santri
      if (santriData.length > 0) {
        const lastSetoranRes = await fetch("/api/guru/last-setoran");
        if (lastSetoranRes.ok) {
          const lastSetoranData: LastSetoran[] = await lastSetoranRes.json();
          const map: Record<string, LastSetoran> = {};
          lastSetoranData.forEach((ls) => {
            map[ls.santriId] = ls;
          });
          setLastSetoranMap(map);
        }
      }
    } catch {
      setError("Gagal memuat data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform santri data for table
  const tableData: SantriData[] = useMemo(() => {
    return santriList.map((santri) => {
      const setoranData = lastSetoranMap[santri.id];
      return {
        id: santri.id,
        fullName: santri.fullName,
        className: santri.className,
        lastZiyadah: setoranData?.lastZiyadah || null,
        lastMurajaah: setoranData?.lastMurajaah || null,
      };
    });
  }, [santriList, lastSetoranMap]);

  // Handle santri selection
  const handleSelectSantri = (santriId: string) => {
    const santri = santriList.find((s) => s.id === santriId);
    if (santri) {
      setSelectedSantri({ id: santri.id, name: santri.fullName });
      setDrawerOpen(true);
    }
  };

  // Get columns with callback
  const columns = useMemo(
    () => getColumns({ onSelectSantri: handleSelectSantri }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [santriList]
  );

  // Handle success - refresh last setoran data
  const handleSuccess = async () => {
    const lastSetoranRes = await fetch("/api/guru/last-setoran");
    if (lastSetoranRes.ok) {
      const lastSetoranData: LastSetoran[] = await lastSetoranRes.json();
      const map: Record<string, LastSetoran> = {};
      lastSetoranData.forEach((ls) => {
        map[ls.santriId] = ls;
      });
      setLastSetoranMap(map);
    }
  };

  if (loading) {
    return <InputSetoranSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
          Input Setoran
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Pilih santri dan catat setoran hafalan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Santri Binaan</CardTitle>
        </CardHeader>
        <CardContent>
          <SantriTable columns={columns} data={tableData} />
        </CardContent>
      </Card>

      {/* Input Form Drawer */}
      {selectedSantri && (
        <InputFormDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          santriId={selectedSantri.id}
          santriName={selectedSantri.name}
          surahList={surahList}
          tagsList={tagsList}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
