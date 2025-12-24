import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { masterTags } from "@/db/schema/tahfidz-schema";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, tagText } = body;

    if (!category || !tagText) {
      return NextResponse.json(
        { error: "Kategori dan teks tag wajib diisi" },
        { status: 400 }
      );
    }

    const tagId = `tag_${randomUUID().slice(0, 8)}`;

    await db.insert(masterTags).values({
      id: tagId,
      category,
      tagText,
    });

    return NextResponse.json({ success: true, id: tagId });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Gagal menambah tag" },
      { status: 500 }
    );
  }
}
