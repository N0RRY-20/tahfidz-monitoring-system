import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { account } from "@/db/schema/auth-schema";
import { santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!sessionData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get santri profile
    const santri = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.id, id))
      .limit(1);

    if (santri.length === 0) {
      return NextResponse.json({ error: "Santri not found" }, { status: 404 });
    }

    const userId = santri[0].userId;
    const newPassword = generatePassword();

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in account table
    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.userId, userId));

    return NextResponse.json({
      success: true,
      password: newPassword,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Gagal reset password" },
      { status: 500 }
    );
  }
}
