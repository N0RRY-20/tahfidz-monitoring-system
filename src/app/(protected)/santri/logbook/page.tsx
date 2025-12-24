import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles, dailyRecords, quranMeta, recordTags, masterTags } from "@/db/schema/tahfidz-schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function getColorClass(status: string) {
  switch (status) {
    case "G": return "bg-green-500";
    case "Y": return "bg-yellow-500";
    case "R": return "bg-red-500";
    default: return "bg-gray-300";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "G": return "Mutqin";
    case "Y": return "Jayyid";
    case "R": return "Rasib";
    default: return "-";
  }
}

export default async function LogbookPage({
  searchParams,
}: {
  searchParams: Promise<{ juz?: string; surah?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const params = await searchParams;
  const juzFilter = params.juz ? parseInt(params.juz) : null;
  const surahFilter = params.surah ? parseInt(params.surah) : null;

  // Get santri profile
  const santri = await db
    .select()
    .from(santriProfiles)
    .where(eq(santriProfiles.userId, session.user.id))
    .limit(1);

  if (santri.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-center text-slate-500">
            Profil santri belum dibuat.
          </CardContent>
        </Card>
      </div>
    );
  }

  const santriData = santri[0];

  // Get all surahs
  const surahs = await db.select().from(quranMeta).orderBy(quranMeta.id);

  // Get filtered surahs based on juz or specific surah
  let filteredSurahs = surahs;
  if (juzFilter) {
    filteredSurahs = surahs.filter(s => s.juzNumber === juzFilter);
  }
  if (surahFilter) {
    filteredSurahs = surahs.filter(s => s.id === surahFilter);
  }

  // Get all records for this santri
  const records = await db
    .select({
      id: dailyRecords.id,
      surahId: dailyRecords.surahId,
      ayatStart: dailyRecords.ayatStart,
      ayatEnd: dailyRecords.ayatEnd,
      colorStatus: dailyRecords.colorStatus,
      type: dailyRecords.type,
      notes: dailyRecords.notesText,
      date: dailyRecords.date,
      createdAt: dailyRecords.createdAt,
      surahName: quranMeta.surahName,
    })
    .from(dailyRecords)
    .innerJoin(quranMeta, eq(dailyRecords.surahId, quranMeta.id))
    .where(eq(dailyRecords.santriId, santriData.id))
    .orderBy(desc(dailyRecords.date));

  // Get tags for records
  const recordIds = records.map(r => r.id);
  const allTags = recordIds.length > 0
    ? await db
        .select({
          recordId: recordTags.recordId,
          tagText: masterTags.tagText,
        })
        .from(recordTags)
        .innerJoin(masterTags, eq(recordTags.tagId, masterTags.id))
    : [];

  const tagsByRecord = allTags.reduce((acc, tag) => {
    if (!acc[tag.recordId]) acc[tag.recordId] = [];
    acc[tag.recordId].push(tag.tagText);
    return acc;
  }, {} as Record<string, string[]>);

  // Filter records based on selection
  let filteredRecords = records;
  if (juzFilter) {
    const surahIdsInJuz = filteredSurahs.map(s => s.id);
    filteredRecords = records.filter(r => surahIdsInJuz.includes(r.surahId));
  }
  if (surahFilter) {
    filteredRecords = records.filter(r => r.surahId === surahFilter);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/santri" className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Logbook Hafalan
          </h1>
          <p className="text-slate-600">
            {juzFilter ? `Juz ${juzFilter}` : surahFilter ? `Surat ${filteredSurahs[0]?.surahName}` : "Semua Surat"}
          </p>
        </div>
      </div>

      {/* Surah list in this Juz */}
      {juzFilter && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Surat dalam Juz {juzFilter}</h2>
          <div className="flex flex-wrap gap-2">
            {filteredSurahs.map(surah => {
              const surahRecords = records.filter(r => r.surahId === surah.id);
              const lastRecord = surahRecords[0];
              const status = lastRecord?.colorStatus || null;
              
              return (
                <Link
                  key={surah.id}
                  href={`/santri/logbook?surah=${surah.id}`}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    status === "G" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                    status === "Y" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                    status === "R" ? "bg-red-100 text-red-800 hover:bg-red-200" :
                    "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {surah.surahName}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Records Table */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Riwayat Setoran</h2>
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-slate-500">
              Belum ada riwayat setoran untuk filter ini.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map(record => (
              <Card key={record.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{record.surahName}</span>
                        <Badge variant="secondary">
                          {record.type === "ziyadah" ? "Ziyadah" : "Murajaah"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        Ayat {record.ayatStart} - {record.ayatEnd}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(tagsByRecord[record.id] || []).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-slate-500 italic mt-2">
                          &quot;{record.notes}&quot;
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-slate-500">{record.date}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white mt-1 ${getColorClass(record.colorStatus)}`}>
                        {getStatusLabel(record.colorStatus)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
