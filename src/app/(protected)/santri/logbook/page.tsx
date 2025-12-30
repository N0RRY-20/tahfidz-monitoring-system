import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  santriProfiles,
  dailyRecords,
  quranMeta,
  recordTags,
  masterTags,
} from "@/db/schema/tahfidz-schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { SurahList, RecordCard, MonthlyHeatmap } from "./partials";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

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
          <CardContent className="py-8 text-center text-muted-foreground">
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
    filteredSurahs = surahs.filter((s) => s.juzNumber === juzFilter);
  }
  if (surahFilter) {
    filteredSurahs = surahs.filter((s) => s.id === surahFilter);
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
  const recordIds = records.map((r) => r.id);
  const allTags =
    recordIds.length > 0
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

  // Prepare records with tags for heatmap
  const recordsWithTags = records.map((r) => ({
    id: r.id,
    surahName: r.surahName,
    type: r.type,
    ayatStart: r.ayatStart,
    ayatEnd: r.ayatEnd,
    colorStatus: r.colorStatus,
    notes: r.notes,
    date: r.date,
    tags: tagsByRecord[r.id] || [],
  }));

  // Filter records based on selection
  let filteredRecords = records;
  if (juzFilter) {
    const surahIdsInJuz = filteredSurahs.map((s) => s.id);
    filteredRecords = records.filter((r) => surahIdsInJuz.includes(r.surahId));
  }
  if (surahFilter) {
    filteredRecords = records.filter((r) => r.surahId === surahFilter);
  }

  // Determine subtitle
  const subtitle = juzFilter
    ? `Juz ${juzFilter}`
    : surahFilter
    ? `Surat ${filteredSurahs[0]?.surahName}`
    : "Semua Surat";

  return (
    <div className="space-y-6">
      {/* Page Title with Back Button (only when filtered) */}
      {(juzFilter || surahFilter) && (
        <div className="flex items-center gap-3">
          <Link
            href="/santri/logbook"
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">
              {subtitle}
            </h1>
          </div>
        </div>
      )}

      {/* Monthly Heatmap with click-to-view (only when no filter) */}
      {!juzFilter && !surahFilter && (
        <MonthlyHeatmap records={recordsWithTags} />
      )}

      {/* Surah list in this Juz */}
      {juzFilter && (
        <SurahList
          juzNumber={juzFilter}
          surahs={filteredSurahs}
          records={records}
        />
      )}

      {/* Records List - only show when filtered by juz or surah */}
      {(juzFilter || surahFilter) && (
        <div>
          <h2 className="text-base md:text-lg font-semibold mb-3">
            Riwayat Setoran
          </h2>

          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  Belum ada setoran di sini
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba filter lain atau mulai setoran baru 🎯
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  tags={tagsByRecord[record.id] || []}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
