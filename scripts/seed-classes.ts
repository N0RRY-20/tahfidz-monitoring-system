import "dotenv/config";
import { db } from "../src/db";
import { classes } from "../src/db/schema/tahfidz-schema";

// Sample classes data
const classesData = [
  // SMP
  { id: "class_7a", name: "7A", description: "Kelas 7A SMP" },
  { id: "class_7b", name: "7B", description: "Kelas 7B SMP" },
  { id: "class_7c", name: "7C", description: "Kelas 7C SMP" },
  { id: "class_8a", name: "8A", description: "Kelas 8A SMP" },
  { id: "class_8b", name: "8B", description: "Kelas 8B SMP" },
  { id: "class_8c", name: "8C", description: "Kelas 8C SMP" },
  { id: "class_9a", name: "9A", description: "Kelas 9A SMP" },
  { id: "class_9b", name: "9B", description: "Kelas 9B SMP" },
  { id: "class_9c", name: "9C", description: "Kelas 9C SMP" },
  // SMA
  { id: "class_10a", name: "10A", description: "Kelas 10A SMA" },
  { id: "class_10b", name: "10B", description: "Kelas 10B SMA" },
  { id: "class_10c", name: "10C", description: "Kelas 10C SMA" },
  { id: "class_11a", name: "11A", description: "Kelas 11A SMA" },
  { id: "class_11b", name: "11B", description: "Kelas 11B SMA" },
  { id: "class_11c", name: "11C", description: "Kelas 11C SMA" },
  { id: "class_12a", name: "12A", description: "Kelas 12A SMA" },
  { id: "class_12b", name: "12B", description: "Kelas 12B SMA" },
  { id: "class_12c", name: "12C", description: "Kelas 12C SMA" },
];

async function seedClasses() {
  console.log("🏫 Starting Classes seed...\n");

  console.log("Inserting classes...");

  for (const classData of classesData) {
    await db.insert(classes).values(classData).onConflictDoNothing();
  }

  console.log("✅", classesData.length, "classes inserted successfully!");
  console.log("\n📋 Classes:");
  console.log("   - SMP: 7A-9C (9 kelas)");
  console.log("   - SMA: 10A-12C (9 kelas)");
  console.log("\n🎉 Classes seed completed!");
}

seedClasses()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
