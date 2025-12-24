import "dotenv/config";
import { db } from "../src/db";
import { masterTags } from "../src/db/schema/tahfidz-schema";

// Sample Tags Penilaian - Bank Komentar
const tagsData = [
  // Kategori: Makhraj
  { id: "tag_makhraj_1", category: "Makhraj", tagText: "Makhraj Huruf Salah" },
  { id: "tag_makhraj_2", category: "Makhraj", tagText: "Makhraj Sudah Tepat" },
  { id: "tag_makhraj_3", category: "Makhraj", tagText: "Perlu Perbaikan Makhraj 'Ain" },
  { id: "tag_makhraj_4", category: "Makhraj", tagText: "Perlu Perbaikan Makhraj Ha" },
  { id: "tag_makhraj_5", category: "Makhraj", tagText: "Perlu Perbaikan Makhraj Qaf" },
  { id: "tag_makhraj_6", category: "Makhraj", tagText: "Perlu Perbaikan Makhraj Tha" },
  { id: "tag_makhraj_7", category: "Makhraj", tagText: "Perlu Perbaikan Makhraj Dha" },
  
  // Kategori: Tajwid
  { id: "tag_tajwid_1", category: "Tajwid", tagText: "Kurang Dengung" },
  { id: "tag_tajwid_2", category: "Tajwid", tagText: "Mad Terlalu Pendek" },
  { id: "tag_tajwid_3", category: "Tajwid", tagText: "Mad Terlalu Panjang" },
  { id: "tag_tajwid_4", category: "Tajwid", tagText: "Idgham Tidak Tepat" },
  { id: "tag_tajwid_5", category: "Tajwid", tagText: "Ikhfa Tidak Tepat" },
  { id: "tag_tajwid_6", category: "Tajwid", tagText: "Qalqalah Kurang Jelas" },
  { id: "tag_tajwid_7", category: "Tajwid", tagText: "Ghunnah Perlu Diperbaiki" },
  { id: "tag_tajwid_8", category: "Tajwid", tagText: "Tajwid Sudah Baik" },
  { id: "tag_tajwid_9", category: "Tajwid", tagText: "Waqaf Tidak Tepat" },
  { id: "tag_tajwid_10", category: "Tajwid", tagText: "Ibtida' Tidak Tepat" },
  
  // Kategori: Kelancaran
  { id: "tag_lancar_1", category: "Kelancaran", tagText: "Lancar Sempurna" },
  { id: "tag_lancar_2", category: "Kelancaran", tagText: "Sedikit Terbata" },
  { id: "tag_lancar_3", category: "Kelancaran", tagText: "Banyak Salah" },
  { id: "tag_lancar_4", category: "Kelancaran", tagText: "Perlu Mengulang Lebih Banyak" },
  { id: "tag_lancar_5", category: "Kelancaran", tagText: "Hafalan Belum Matang" },
  { id: "tag_lancar_6", category: "Kelancaran", tagText: "Hafalan Sudah Mutqin" },
  { id: "tag_lancar_7", category: "Kelancaran", tagText: "Masih Ragu-Ragu" },
  
  // Kategori: Lagu/Nagham
  { id: "tag_lagu_1", category: "Lagu", tagText: "Lagu Sudah Baik" },
  { id: "tag_lagu_2", category: "Lagu", tagText: "Perlu Perbaikan Irama" },
  { id: "tag_lagu_3", category: "Lagu", tagText: "Terlalu Cepat" },
  { id: "tag_lagu_4", category: "Lagu", tagText: "Terlalu Lambat" },
  
  // Kategori: Umum
  { id: "tag_umum_1", category: "Umum", tagText: "Sangat Baik, Pertahankan" },
  { id: "tag_umum_2", category: "Umum", tagText: "Perlu Murajaah Lebih Sering" },
  { id: "tag_umum_3", category: "Umum", tagText: "Konsentrasi Kurang" },
  { id: "tag_umum_4", category: "Umum", tagText: "Semangat Bagus" },
  { id: "tag_umum_5", category: "Umum", tagText: "Progres Sangat Baik" },
];

async function seedTags() {
  console.log("🏷️ Starting Master Tags seed...\n");

  console.log("Inserting sample tags...");
  
  for (const tag of tagsData) {
    await db
      .insert(masterTags)
      .values(tag)
      .onConflictDoNothing();
  }

  console.log("✅", tagsData.length, "tags inserted successfully!");
  console.log("\n📋 Kategori:");
  console.log("   - Makhraj: 7 tags");
  console.log("   - Tajwid: 10 tags");
  console.log("   - Kelancaran: 7 tags");
  console.log("   - Lagu: 4 tags");
  console.log("   - Umum: 5 tags");
  console.log("\n🎉 Master Tags seed completed!");
}

seedTags()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
