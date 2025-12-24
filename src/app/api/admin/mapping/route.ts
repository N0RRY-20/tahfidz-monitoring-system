import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles } from "@/db/schema/tahfidz-schema";
import { inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { santriIds, guruId } = body;

    if (!santriIds || !Array.isArray(santriIds) || santriIds.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal satu santri" },
        { status: 400 }
      );
    }

    if (!guruId) {
      return NextResponse.json(
        { error: "Pilih guru tujuan" },
        { status: 400 }
      );
    }

    // Update santri profiles
    await db
      .update(santriProfiles)
      .set({ assignedGuruId: guruId })
      .where(inArray(santriProfiles.id, santriIds));

    return NextResponse.json({
      success: true,
      count: santriIds.length,
    });
  } catch (error) {
    console.error("Error mapping santri:", error);
    return NextResponse.json(
      { error: "Gagal mapping santri" },
      { status: 500 }
    );
  }
}
