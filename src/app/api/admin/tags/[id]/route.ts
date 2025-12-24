import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { masterTags, recordTags } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";

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

    // Delete record_tags references first
    await db.delete(recordTags).where(eq(recordTags.tagId, id));

    // Delete the tag
    await db.delete(masterTags).where(eq(masterTags.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Gagal menghapus tag" },
      { status: 500 }
    );
  }
}
