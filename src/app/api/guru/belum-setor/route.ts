import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  dailyRecords,
  santriProfiles,
  classes,
} from "@/db/schema/tahfidz-schema";
import { eq, and, inArray } from "drizzle-orm";
import { getJakartaDateString } from "@/lib/date";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todayWIB = getJakartaDateString();

    // Get all santri assigned to this guru
    const santriBinaan = await db
      .select({
        id: santriProfiles.id,
        fullName: santriProfiles.fullName,
        className: classes.name,
      })
      .from(santriProfiles)
      .leftJoin(classes, eq(santriProfiles.classId, classes.id))
      .where(eq(santriProfiles.assignedGuruId, session.user.id));

    if (santriBinaan.length === 0) {
      return NextResponse.json([]);
    }

    const santriIds = santriBinaan.map((s) => s.id);

    // Get today's records for these santri
    const todayRecords = await db
      .select({
        santriId: dailyRecords.santriId,
        type: dailyRecords.type,
      })
      .from(dailyRecords)
      .where(
        and(
          inArray(dailyRecords.santriId, santriIds),
          eq(dailyRecords.date, todayWIB)
        )
      );

    // Build status map
    const statusMap: Record<
      string,
      { hasZiyadah: boolean; hasMurajaah: boolean }
    > = {};
    for (const record of todayRecords) {
      if (!statusMap[record.santriId]) {
        statusMap[record.santriId] = { hasZiyadah: false, hasMurajaah: false };
      }
      if (record.type === "ziyadah") {
        statusMap[record.santriId].hasZiyadah = true;
      } else if (record.type === "murajaah") {
        statusMap[record.santriId].hasMurajaah = true;
      }
    }

    // Build response
    const result = santriBinaan.map((santri) => ({
      santriId: santri.id,
      santriName: santri.fullName,
      santriClass: santri.className || "-",
      hasZiyadahToday: statusMap[santri.id]?.hasZiyadah ?? false,
      hasMurajaahToday: statusMap[santri.id]?.hasMurajaah ?? false,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching belum setor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
