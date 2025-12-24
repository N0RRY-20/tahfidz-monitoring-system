import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { classes, santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all classes with santri count
    const allClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
        description: classes.description,
        createdAt: classes.createdAt,
      })
      .from(classes)
      .orderBy(classes.name);

    // Count santri per class
    const santriCounts = await db
      .select({
        classId: santriProfiles.classId,
        count: sql<number>`count(*)`,
      })
      .from(santriProfiles)
      .groupBy(santriProfiles.classId);

    const countMap = new Map(
      santriCounts.map((c) => [c.classId, Number(c.count)])
    );

    const result = allClasses.map((cls) => ({
      ...cls,
      santriCount: countMap.get(cls.id) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching classes:", error);
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
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    // Check if class name already exists
    const existing = await db
      .select()
      .from(classes)
      .where(eq(classes.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Nama kelas sudah ada" },
        { status: 400 }
      );
    }

    const classId = `class_${randomUUID().slice(0, 8)}`;

    await db.insert(classes).values({
      id: classId,
      name,
      description: description || null,
    });

    return NextResponse.json({ success: true, id: classId });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { error: "Gagal menambah kelas" },
      { status: 500 }
    );
  }
}
