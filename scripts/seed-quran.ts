import "dotenv/config";
import { db } from "../src/db";
import { quranMeta } from "../src/db/schema/tahfidz-schema";

// Data 114 Surat Al-Qur'an - Standar Mushaf Utsmani Pojok 15 Baris
const quranData = [
  { id: 1, surahName: "Al-Fatihah", surahNameArabic: "الفاتحة", totalAyat: 7, juzNumber: 1, pageStart: 1, pageEnd: 1 },
  { id: 2, surahName: "Al-Baqarah", surahNameArabic: "البقرة", totalAyat: 286, juzNumber: 1, pageStart: 2, pageEnd: 49 },
  { id: 3, surahName: "Ali 'Imran", surahNameArabic: "آل عمران", totalAyat: 200, juzNumber: 3, pageStart: 50, pageEnd: 76 },
  { id: 4, surahName: "An-Nisa'", surahNameArabic: "النساء", totalAyat: 176, juzNumber: 4, pageStart: 77, pageEnd: 106 },
  { id: 5, surahName: "Al-Ma'idah", surahNameArabic: "المائدة", totalAyat: 120, juzNumber: 6, pageStart: 106, pageEnd: 127 },
  { id: 6, surahName: "Al-An'am", surahNameArabic: "الأنعام", totalAyat: 165, juzNumber: 7, pageStart: 128, pageEnd: 150 },
  { id: 7, surahName: "Al-A'raf", surahNameArabic: "الأعراف", totalAyat: 206, juzNumber: 8, pageStart: 151, pageEnd: 176 },
  { id: 8, surahName: "Al-Anfal", surahNameArabic: "الأنفال", totalAyat: 75, juzNumber: 9, pageStart: 177, pageEnd: 186 },
  { id: 9, surahName: "At-Taubah", surahNameArabic: "التوبة", totalAyat: 129, juzNumber: 10, pageStart: 187, pageEnd: 207 },
  { id: 10, surahName: "Yunus", surahNameArabic: "يونس", totalAyat: 109, juzNumber: 11, pageStart: 208, pageEnd: 221 },
  { id: 11, surahName: "Hud", surahNameArabic: "هود", totalAyat: 123, juzNumber: 11, pageStart: 221, pageEnd: 235 },
  { id: 12, surahName: "Yusuf", surahNameArabic: "يوسف", totalAyat: 111, juzNumber: 12, pageStart: 235, pageEnd: 248 },
  { id: 13, surahName: "Ar-Ra'd", surahNameArabic: "الرعد", totalAyat: 43, juzNumber: 13, pageStart: 249, pageEnd: 255 },
  { id: 14, surahName: "Ibrahim", surahNameArabic: "إبراهيم", totalAyat: 52, juzNumber: 13, pageStart: 255, pageEnd: 261 },
  { id: 15, surahName: "Al-Hijr", surahNameArabic: "الحجر", totalAyat: 99, juzNumber: 14, pageStart: 262, pageEnd: 267 },
  { id: 16, surahName: "An-Nahl", surahNameArabic: "النحل", totalAyat: 128, juzNumber: 14, pageStart: 267, pageEnd: 281 },
  { id: 17, surahName: "Al-Isra'", surahNameArabic: "الإسراء", totalAyat: 111, juzNumber: 15, pageStart: 282, pageEnd: 293 },
  { id: 18, surahName: "Al-Kahf", surahNameArabic: "الكهف", totalAyat: 110, juzNumber: 15, pageStart: 293, pageEnd: 304 },
  { id: 19, surahName: "Maryam", surahNameArabic: "مريم", totalAyat: 98, juzNumber: 16, pageStart: 305, pageEnd: 312 },
  { id: 20, surahName: "Taha", surahNameArabic: "طه", totalAyat: 135, juzNumber: 16, pageStart: 312, pageEnd: 321 },
  { id: 21, surahName: "Al-Anbiya'", surahNameArabic: "الأنبياء", totalAyat: 112, juzNumber: 17, pageStart: 322, pageEnd: 331 },
  { id: 22, surahName: "Al-Hajj", surahNameArabic: "الحج", totalAyat: 78, juzNumber: 17, pageStart: 332, pageEnd: 341 },
  { id: 23, surahName: "Al-Mu'minun", surahNameArabic: "المؤمنون", totalAyat: 118, juzNumber: 18, pageStart: 342, pageEnd: 349 },
  { id: 24, surahName: "An-Nur", surahNameArabic: "النور", totalAyat: 64, juzNumber: 18, pageStart: 350, pageEnd: 359 },
  { id: 25, surahName: "Al-Furqan", surahNameArabic: "الفرقان", totalAyat: 77, juzNumber: 18, pageStart: 359, pageEnd: 366 },
  { id: 26, surahName: "Asy-Syu'ara'", surahNameArabic: "الشعراء", totalAyat: 227, juzNumber: 19, pageStart: 367, pageEnd: 376 },
  { id: 27, surahName: "An-Naml", surahNameArabic: "النمل", totalAyat: 93, juzNumber: 19, pageStart: 377, pageEnd: 385 },
  { id: 28, surahName: "Al-Qasas", surahNameArabic: "القصص", totalAyat: 88, juzNumber: 20, pageStart: 385, pageEnd: 396 },
  { id: 29, surahName: "Al-'Ankabut", surahNameArabic: "العنكبوت", totalAyat: 69, juzNumber: 20, pageStart: 396, pageEnd: 404 },
  { id: 30, surahName: "Ar-Rum", surahNameArabic: "الروم", totalAyat: 60, juzNumber: 21, pageStart: 404, pageEnd: 410 },
  { id: 31, surahName: "Luqman", surahNameArabic: "لقمان", totalAyat: 34, juzNumber: 21, pageStart: 411, pageEnd: 414 },
  { id: 32, surahName: "As-Sajdah", surahNameArabic: "السجدة", totalAyat: 30, juzNumber: 21, pageStart: 415, pageEnd: 417 },
  { id: 33, surahName: "Al-Ahzab", surahNameArabic: "الأحزاب", totalAyat: 73, juzNumber: 21, pageStart: 418, pageEnd: 427 },
  { id: 34, surahName: "Saba'", surahNameArabic: "سبأ", totalAyat: 54, juzNumber: 22, pageStart: 428, pageEnd: 434 },
  { id: 35, surahName: "Fatir", surahNameArabic: "فاطر", totalAyat: 45, juzNumber: 22, pageStart: 434, pageEnd: 440 },
  { id: 36, surahName: "Ya-Sin", surahNameArabic: "يس", totalAyat: 83, juzNumber: 22, pageStart: 440, pageEnd: 445 },
  { id: 37, surahName: "As-Saffat", surahNameArabic: "الصافات", totalAyat: 182, juzNumber: 23, pageStart: 446, pageEnd: 452 },
  { id: 38, surahName: "Sad", surahNameArabic: "ص", totalAyat: 88, juzNumber: 23, pageStart: 453, pageEnd: 458 },
  { id: 39, surahName: "Az-Zumar", surahNameArabic: "الزمر", totalAyat: 75, juzNumber: 23, pageStart: 458, pageEnd: 467 },
  { id: 40, surahName: "Gafir", surahNameArabic: "غافر", totalAyat: 85, juzNumber: 24, pageStart: 467, pageEnd: 476 },
  { id: 41, surahName: "Fussilat", surahNameArabic: "فصلت", totalAyat: 54, juzNumber: 24, pageStart: 477, pageEnd: 482 },
  { id: 42, surahName: "Asy-Syura", surahNameArabic: "الشورى", totalAyat: 53, juzNumber: 25, pageStart: 483, pageEnd: 489 },
  { id: 43, surahName: "Az-Zukhruf", surahNameArabic: "الزخرف", totalAyat: 89, juzNumber: 25, pageStart: 489, pageEnd: 495 },
  { id: 44, surahName: "Ad-Dukhan", surahNameArabic: "الدخان", totalAyat: 59, juzNumber: 25, pageStart: 496, pageEnd: 498 },
  { id: 45, surahName: "Al-Jasiyah", surahNameArabic: "الجاثية", totalAyat: 37, juzNumber: 25, pageStart: 499, pageEnd: 502 },
  { id: 46, surahName: "Al-Ahqaf", surahNameArabic: "الأحقاف", totalAyat: 35, juzNumber: 26, pageStart: 502, pageEnd: 506 },
  { id: 47, surahName: "Muhammad", surahNameArabic: "محمد", totalAyat: 38, juzNumber: 26, pageStart: 507, pageEnd: 510 },
  { id: 48, surahName: "Al-Fath", surahNameArabic: "الفتح", totalAyat: 29, juzNumber: 26, pageStart: 511, pageEnd: 515 },
  { id: 49, surahName: "Al-Hujurat", surahNameArabic: "الحجرات", totalAyat: 18, juzNumber: 26, pageStart: 515, pageEnd: 517 },
  { id: 50, surahName: "Qaf", surahNameArabic: "ق", totalAyat: 45, juzNumber: 26, pageStart: 518, pageEnd: 520 },
  { id: 51, surahName: "Az-Zariyat", surahNameArabic: "الذاريات", totalAyat: 60, juzNumber: 26, pageStart: 520, pageEnd: 523 },
  { id: 52, surahName: "At-Tur", surahNameArabic: "الطور", totalAyat: 49, juzNumber: 27, pageStart: 523, pageEnd: 525 },
  { id: 53, surahName: "An-Najm", surahNameArabic: "النجم", totalAyat: 62, juzNumber: 27, pageStart: 526, pageEnd: 528 },
  { id: 54, surahName: "Al-Qamar", surahNameArabic: "القمر", totalAyat: 55, juzNumber: 27, pageStart: 528, pageEnd: 531 },
  { id: 55, surahName: "Ar-Rahman", surahNameArabic: "الرحمن", totalAyat: 78, juzNumber: 27, pageStart: 531, pageEnd: 534 },
  { id: 56, surahName: "Al-Waqi'ah", surahNameArabic: "الواقعة", totalAyat: 96, juzNumber: 27, pageStart: 534, pageEnd: 537 },
  { id: 57, surahName: "Al-Hadid", surahNameArabic: "الحديد", totalAyat: 29, juzNumber: 27, pageStart: 537, pageEnd: 541 },
  { id: 58, surahName: "Al-Mujadalah", surahNameArabic: "المجادلة", totalAyat: 22, juzNumber: 28, pageStart: 542, pageEnd: 545 },
  { id: 59, surahName: "Al-Hasyr", surahNameArabic: "الحشر", totalAyat: 24, juzNumber: 28, pageStart: 545, pageEnd: 548 },
  { id: 60, surahName: "Al-Mumtahanah", surahNameArabic: "الممتحنة", totalAyat: 13, juzNumber: 28, pageStart: 549, pageEnd: 551 },
  { id: 61, surahName: "As-Saff", surahNameArabic: "الصف", totalAyat: 14, juzNumber: 28, pageStart: 551, pageEnd: 552 },
  { id: 62, surahName: "Al-Jumu'ah", surahNameArabic: "الجمعة", totalAyat: 11, juzNumber: 28, pageStart: 553, pageEnd: 554 },
  { id: 63, surahName: "Al-Munafiqun", surahNameArabic: "المنافقون", totalAyat: 11, juzNumber: 28, pageStart: 554, pageEnd: 555 },
  { id: 64, surahName: "At-Tagabun", surahNameArabic: "التغابن", totalAyat: 18, juzNumber: 28, pageStart: 556, pageEnd: 557 },
  { id: 65, surahName: "At-Talaq", surahNameArabic: "الطلاق", totalAyat: 12, juzNumber: 28, pageStart: 558, pageEnd: 559 },
  { id: 66, surahName: "At-Tahrim", surahNameArabic: "التحريم", totalAyat: 12, juzNumber: 28, pageStart: 560, pageEnd: 561 },
  { id: 67, surahName: "Al-Mulk", surahNameArabic: "الملك", totalAyat: 30, juzNumber: 29, pageStart: 562, pageEnd: 564 },
  { id: 68, surahName: "Al-Qalam", surahNameArabic: "القلم", totalAyat: 52, juzNumber: 29, pageStart: 564, pageEnd: 566 },
  { id: 69, surahName: "Al-Haqqah", surahNameArabic: "الحاقة", totalAyat: 52, juzNumber: 29, pageStart: 566, pageEnd: 568 },
  { id: 70, surahName: "Al-Ma'arij", surahNameArabic: "المعارج", totalAyat: 44, juzNumber: 29, pageStart: 568, pageEnd: 570 },
  { id: 71, surahName: "Nuh", surahNameArabic: "نوح", totalAyat: 28, juzNumber: 29, pageStart: 570, pageEnd: 571 },
  { id: 72, surahName: "Al-Jinn", surahNameArabic: "الجن", totalAyat: 28, juzNumber: 29, pageStart: 572, pageEnd: 573 },
  { id: 73, surahName: "Al-Muzzammil", surahNameArabic: "المزمل", totalAyat: 20, juzNumber: 29, pageStart: 574, pageEnd: 575 },
  { id: 74, surahName: "Al-Muddassir", surahNameArabic: "المدثر", totalAyat: 56, juzNumber: 29, pageStart: 575, pageEnd: 577 },
  { id: 75, surahName: "Al-Qiyamah", surahNameArabic: "القيامة", totalAyat: 40, juzNumber: 29, pageStart: 577, pageEnd: 578 },
  { id: 76, surahName: "Al-Insan", surahNameArabic: "الإنسان", totalAyat: 31, juzNumber: 29, pageStart: 578, pageEnd: 580 },
  { id: 77, surahName: "Al-Mursalat", surahNameArabic: "المرسلات", totalAyat: 50, juzNumber: 29, pageStart: 580, pageEnd: 581 },
  { id: 78, surahName: "An-Naba'", surahNameArabic: "النبأ", totalAyat: 40, juzNumber: 30, pageStart: 582, pageEnd: 583 },
  { id: 79, surahName: "'Abasa", surahNameArabic: "عبس", totalAyat: 42, juzNumber: 30, pageStart: 585, pageEnd: 586 },
  { id: 80, surahName: "An-Nazi'at", surahNameArabic: "النازعات", totalAyat: 46, juzNumber: 30, pageStart: 583, pageEnd: 584 },
  { id: 81, surahName: "At-Takwir", surahNameArabic: "التكوير", totalAyat: 29, juzNumber: 30, pageStart: 586, pageEnd: 586 },
  { id: 82, surahName: "Al-Infitar", surahNameArabic: "الإنفطار", totalAyat: 19, juzNumber: 30, pageStart: 587, pageEnd: 587 },
  { id: 83, surahName: "Al-Mutaffifin", surahNameArabic: "المطففين", totalAyat: 36, juzNumber: 30, pageStart: 587, pageEnd: 589 },
  { id: 84, surahName: "Al-Insyiqaq", surahNameArabic: "الإنشقاق", totalAyat: 25, juzNumber: 30, pageStart: 589, pageEnd: 589 },
  { id: 85, surahName: "Al-Buruj", surahNameArabic: "البروج", totalAyat: 22, juzNumber: 30, pageStart: 590, pageEnd: 590 },
  { id: 86, surahName: "At-Tariq", surahNameArabic: "الطارق", totalAyat: 17, juzNumber: 30, pageStart: 591, pageEnd: 591 },
  { id: 87, surahName: "Al-A'la", surahNameArabic: "الأعلى", totalAyat: 19, juzNumber: 30, pageStart: 591, pageEnd: 592 },
  { id: 88, surahName: "Al-Gasyiyah", surahNameArabic: "الغاشية", totalAyat: 26, juzNumber: 30, pageStart: 592, pageEnd: 592 },
  { id: 89, surahName: "Al-Fajr", surahNameArabic: "الفجر", totalAyat: 30, juzNumber: 30, pageStart: 593, pageEnd: 594 },
  { id: 90, surahName: "Al-Balad", surahNameArabic: "البلد", totalAyat: 20, juzNumber: 30, pageStart: 594, pageEnd: 594 },
  { id: 91, surahName: "Asy-Syams", surahNameArabic: "الشمس", totalAyat: 15, juzNumber: 30, pageStart: 595, pageEnd: 595 },
  { id: 92, surahName: "Al-Lail", surahNameArabic: "الليل", totalAyat: 21, juzNumber: 30, pageStart: 595, pageEnd: 596 },
  { id: 93, surahName: "Ad-Duha", surahNameArabic: "الضحى", totalAyat: 11, juzNumber: 30, pageStart: 596, pageEnd: 596 },
  { id: 94, surahName: "Asy-Syarh", surahNameArabic: "الشرح", totalAyat: 8, juzNumber: 30, pageStart: 596, pageEnd: 596 },
  { id: 95, surahName: "At-Tin", surahNameArabic: "التين", totalAyat: 8, juzNumber: 30, pageStart: 597, pageEnd: 597 },
  { id: 96, surahName: "Al-'Alaq", surahNameArabic: "العلق", totalAyat: 19, juzNumber: 30, pageStart: 597, pageEnd: 597 },
  { id: 97, surahName: "Al-Qadr", surahNameArabic: "القدر", totalAyat: 5, juzNumber: 30, pageStart: 598, pageEnd: 598 },
  { id: 98, surahName: "Al-Bayyinah", surahNameArabic: "البينة", totalAyat: 8, juzNumber: 30, pageStart: 598, pageEnd: 599 },
  { id: 99, surahName: "Az-Zalzalah", surahNameArabic: "الزلزلة", totalAyat: 8, juzNumber: 30, pageStart: 599, pageEnd: 599 },
  { id: 100, surahName: "Al-'Adiyat", surahNameArabic: "العاديات", totalAyat: 11, juzNumber: 30, pageStart: 599, pageEnd: 600 },
  { id: 101, surahName: "Al-Qari'ah", surahNameArabic: "القارعة", totalAyat: 11, juzNumber: 30, pageStart: 600, pageEnd: 600 },
  { id: 102, surahName: "At-Takasur", surahNameArabic: "التكاثر", totalAyat: 8, juzNumber: 30, pageStart: 600, pageEnd: 600 },
  { id: 103, surahName: "Al-'Asr", surahNameArabic: "العصر", totalAyat: 3, juzNumber: 30, pageStart: 601, pageEnd: 601 },
  { id: 104, surahName: "Al-Humazah", surahNameArabic: "الهمزة", totalAyat: 9, juzNumber: 30, pageStart: 601, pageEnd: 601 },
  { id: 105, surahName: "Al-Fil", surahNameArabic: "الفيل", totalAyat: 5, juzNumber: 30, pageStart: 601, pageEnd: 601 },
  { id: 106, surahName: "Quraisy", surahNameArabic: "قريش", totalAyat: 4, juzNumber: 30, pageStart: 602, pageEnd: 602 },
  { id: 107, surahName: "Al-Ma'un", surahNameArabic: "الماعون", totalAyat: 7, juzNumber: 30, pageStart: 602, pageEnd: 602 },
  { id: 108, surahName: "Al-Kausar", surahNameArabic: "الكوثر", totalAyat: 3, juzNumber: 30, pageStart: 602, pageEnd: 602 },
  { id: 109, surahName: "Al-Kafirun", surahNameArabic: "الكافرون", totalAyat: 6, juzNumber: 30, pageStart: 603, pageEnd: 603 },
  { id: 110, surahName: "An-Nasr", surahNameArabic: "النصر", totalAyat: 3, juzNumber: 30, pageStart: 603, pageEnd: 603 },
  { id: 111, surahName: "Al-Lahab", surahNameArabic: "المسد", totalAyat: 5, juzNumber: 30, pageStart: 603, pageEnd: 603 },
  { id: 112, surahName: "Al-Ikhlas", surahNameArabic: "الإخلاص", totalAyat: 4, juzNumber: 30, pageStart: 604, pageEnd: 604 },
  { id: 113, surahName: "Al-Falaq", surahNameArabic: "الفلق", totalAyat: 5, juzNumber: 30, pageStart: 604, pageEnd: 604 },
  { id: 114, surahName: "An-Nas", surahNameArabic: "الناس", totalAyat: 6, juzNumber: 30, pageStart: 604, pageEnd: 604 },
];

async function seedQuran() {
  console.log("🕌 Starting Quran Meta seed...\n");

  console.log("Inserting 114 Surat Al-Qur'an...");
  
  for (const surah of quranData) {
    await db
      .insert(quranMeta)
      .values(surah)
      .onConflictDoNothing();
  }

  console.log("✅ 114 Surat Al-Qur'an inserted successfully!");
  console.log("\n🎉 Quran Meta seed completed!");
}

seedQuran()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
