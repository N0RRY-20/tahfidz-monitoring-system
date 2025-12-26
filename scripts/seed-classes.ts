import "dotenv/config";
import { db } from "../src/db";
import { classes } from "../src/db/schema/tahfidz-schema";

// Sample classes data
const classesData = [
  // SMP
  { id: "class_7a", name: "7A", description: "Halaqah 7A SMP" },
  { id: "class_7b", name: "7B", description: "Halaqah 7B SMP" },
  { id: "class_7c", name: "7C", description: "Halaqah 7C SMP" },
  { id: "class_8a", name: "8A", description: "Halaqah 8A SMP" },
  { id: "class_8b", name: "8B", description: "Halaqah 8B SMP" },
  { id: "class_8c", name: "8C", description: "Halaqah 8C SMP" },
  { id: "class_9a", name: "9A", description: "Halaqah 9A SMP" },
  { id: "class_9b", name: "9B", description: "Halaqah 9B SMP" },
  { id: "class_9c", name: "9C", description: "Halaqah 9C SMP" },
  // SMA
  { id: "class_10a", name: "10A", description: "Halaqah 10A SMA" },
  { id: "class_10b", name: "10B", description: "Halaqah 10B SMA" },
  { id: "class_10c", name: "10C", description: "Halaqah 10C SMA" },
  { id: "class_11a", name: "11A", description: "Halaqah 11A SMA" },
  { id: "class_11b", name: "11B", description: "Halaqah 11B SMA" },
  { id: "class_11c", name: "11C", description: "Halaqah 11C SMA" },
  { id: "class_12a", name: "12A", description: "Halaqah 12A SMA" },
  { id: "class_12b", name: "12B", description: "Halaqah 12B SMA" },
  { id: "class_12c", name: "12C", description: "Halaqah 12C SMA" },
];

async function seedClasses() {
  console.log("🏫 Starting Hannaqah (Classes) seed...\n");

  console.log("Inserting halaqah...");

  for (const classData of classesData) {
    await db.insert(classes).values(classData).onConflictDoNothing();
  }

  console.log("✅", classesData.length, "halaqah inserted successfully!");
  console.log("\n📋 Halaqah:");
  console.log("   - SMP: 7A-9C (9 halaqah)");
  console.log("   - SMA: 10A-12C (9 halaqah)");
  console.log("\n🎉 Halaqah seed completed!");
}

seedClasses()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
