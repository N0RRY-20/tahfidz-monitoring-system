import { NextResponse } from "next/server";
import { db } from "@/db";
import { quranMeta } from "@/db/schema/tahfidz-schema";

export async function GET() {
  try {
    const surahs = await db
      .select({
        id: quranMeta.id,
        surahName: quranMeta.surahName,
        surahNameArabic: quranMeta.surahNameArabic,
        totalAyat: quranMeta.totalAyat,
        juzNumber: quranMeta.juzNumber,
      })
      .from(quranMeta)
      .orderBy(quranMeta.id);

    return NextResponse.json(surahs);
  } catch (error) {
    console.error("Error fetching quran meta:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
