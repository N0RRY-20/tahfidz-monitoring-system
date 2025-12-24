import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole } from "@/db/schema/auth-schema";
import { santriProfiles, classes } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

function generateUsername(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 10);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${cleanName}${random}`;
}

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const santris = await db
      .select({
        id: santriProfiles.id,
        fullName: santriProfiles.fullName,
        classId: santriProfiles.classId,
        userId: santriProfiles.userId,
        guruId: santriProfiles.assignedGuruId,
        createdAt: santriProfiles.createdAt,
      })
      .from(santriProfiles);

    // Get user emails
    const userIds = santris.map((s) => s.userId);
    const users =
      userIds.length > 0
        ? await db.select({ id: user.id, email: user.email }).from(user)
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.email]));

    // Get guru names
    const guruIds = santris.map((s) => s.guruId).filter(Boolean) as string[];
    const gurus =
      guruIds.length > 0
        ? await db.select({ id: user.id, name: user.name }).from(user)
        : [];
    const guruMap = new Map(gurus.map((g) => [g.id, g.name]));

    // Get class names
    const classIds = santris.map((s) => s.classId).filter(Boolean) as string[];
    const allClasses =
      classIds.length > 0
        ? await db.select({ id: classes.id, name: classes.name }).from(classes)
        : [];
    const classMap = new Map(allClasses.map((c) => [c.id, c.name]));

    const result = santris.map((santri) => ({
      id: santri.id,
      fullName: santri.fullName,
      classId: santri.classId,
      className: santri.classId ? classMap.get(santri.classId) || null : null,
      email: userMap.get(santri.userId) || "",
      guruId: santri.guruId,
      guruName: santri.guruId ? guruMap.get(santri.guruId) || null : null,
      createdAt: santri.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching santris:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, classId, assignedGuruId, dob } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "Nama santri wajib diisi" },
        { status: 400 }
      );
    }

    // Generate credentials
    const username = generateUsername(fullName);
    const email = `${username}@santri.tahfidz`;
    const password = generatePassword();

    // Create user via better-auth
    const signupRes = await auth.api.signUpEmail({
      body: {
        name: fullName,
        email,
        password,
      },
    });

    if (!signupRes?.user) {
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Assign santri role
    await db.insert(userRole).values({
      userId: signupRes.user.id,
      roleId: "role_santri",
    });

    // Create santri profile
    const santriId = randomUUID();
    await db.insert(santriProfiles).values({
      id: santriId,
      userId: signupRes.user.id,
      fullName,
      classId: classId || null,
      assignedGuruId: assignedGuruId || null,
      dob: dob || null,
    });

    return NextResponse.json({
      success: true,
      id: santriId,
      email,
      password,
    });
  } catch (error) {
    console.error("Error creating santri:", error);
    return NextResponse.json(
      { error: "Gagal membuat akun santri" },
      { status: 500 }
    );
  }
}
