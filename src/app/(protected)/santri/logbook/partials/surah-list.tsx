import Link from "next/link";

interface Surah {
  id: number;
  surahName: string;
}

interface Record {
  surahId: number;
  colorStatus: string;
}

interface SurahListProps {
  juzNumber: number;
  surahs: Surah[];
  records: Record[];
}

export function SurahList({ juzNumber, surahs, records }: SurahListProps) {
  return (
    <div>
      <h2 className="text-base md:text-lg font-semibold mb-3">
        Surat dalam Juz {juzNumber}
      </h2>
      <div className="flex flex-wrap gap-2">
        {surahs.map(surah => {
          const surahRecords = records.filter(r => r.surahId === surah.id);
          const lastRecord = surahRecords[0];
          const status = lastRecord?.colorStatus || null;
          
          return (
            <Link
              key={surah.id}
              href={`/santri/logbook?surah=${surah.id}`}
              className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all hover:scale-105 ${
                status === "G" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" :
                status === "Y" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400" :
                status === "R" ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" :
                "bg-muted text-muted-foreground hover:bg-muted/80 border border-dashed border-muted-foreground/30"
              }`}
            >
              {surah.surahName}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
