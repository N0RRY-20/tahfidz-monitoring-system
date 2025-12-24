import "dotenv/config";
import { db } from "../src/db";
import { user, role, userRole } from "../src/db/schema/auth-schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Create roles
  console.log("Creating roles...");
  const adminRole = await db
    .insert(role)
    .values({
      id: "role_admin",
      name: "admin",
      description: "Super Admin / Operator Pondok dengan akses penuh",
    })
    .onConflictDoNothing()
    .returning();

  const guruRole = await db
    .insert(role)
    .values({
      id: "role_guru",
      name: "guru",
      description: "Guru Tahfidz / Musyrif yang menginput setoran santri",
    })
    .onConflictDoNothing()
    .returning();

  const santriRole = await db
    .insert(role)
    .values({
      id: "role_santri",
      name: "santri",
      description: "Akun Santri untuk login Wali Santri (read-only)",
    })
    .onConflictDoNothing()
    .returning();

  console.log(
    "✅ Roles created:",
    adminRole.length + guruRole.length + santriRole.length
  );

  // Check if admin user exists
  const existingAdmin = await db
    .select()
    .from(user)
    .where(eq(user.email, "admin@example.com"))
    .limit(1);

  if (existingAdmin.length === 0) {
    console.log("\n⚠️  No admin user found.");
    console.log("📝 To create an admin user:");
    console.log(
      "   1. Register a new user via /signup with email: admin@example.com"
    );
    console.log("   2. Run this seed script again to assign admin role");
  } else {
    // Assign admin role to existing admin user
    console.log("\nAssigning admin role to admin@example.com...");
    await db
      .insert(userRole)
      .values({
        userId: existingAdmin[0].id,
        roleId: "role_admin",
      })
      .onConflictDoNothing();

    console.log("✅ Admin role assigned!");
  }

  console.log("\n🎉 Seed completed!");
  console.log("\n📋 Summary:");
  console.log("   - Admin role: role_admin");
  console.log("   - Guru role: role_guru");
  console.log("   - Santri role: role_santri");
  console.log("   - Admin email: admin@example.com");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
