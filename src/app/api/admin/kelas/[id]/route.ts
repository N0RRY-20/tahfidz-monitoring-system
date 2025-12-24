import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { classes, santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nama kelas wajib diisi" },
        { status: 400 }
      );
    }

    // Check if class exists
    const existing = await db
      .select()
      .from(classes)
      .where(eq(classes.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
    }

    // Check if new name conflicts with other classes
    const conflict = await db
      .select()
      .from(classes)
      .where(eq(classes.name, name))
      .limit(1);

    if (conflict.length > 0 && conflict[0].id !== id) {
      return NextResponse.json(
        { error: "Nama kelas sudah digunakan" },
        { status: 400 }
      );
    }

    await db
      .update(classes)
      .set({ name, description: description || null })
      .where(eq(classes.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate kelas" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if there are santri in this class
    const santriInClass = await db
      .select()
      .from(santriProfiles)
      .where(eq(santriProfiles.classId, id))
      .limit(1);

    if (santriInClass.length > 0) {
      return NextResponse.json(
        { error: "Tidak bisa menghapus kelas yang masih memiliki santri" },
        { status: 400 }
      );
    }

    await db.delete(classes).where(eq(classes.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kelas" },
      { status: 500 }
    );
  }
}
