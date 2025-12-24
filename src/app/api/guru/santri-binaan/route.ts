import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { santriProfiles, classes } from "@/db/schema/tahfidz-schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const santriList = await db
      .select({
        id: santriProfiles.id,
        fullName: santriProfiles.fullName,
        className: classes.name,
      })
      .from(santriProfiles)
      .leftJoin(classes, eq(santriProfiles.classId, classes.id))
      .where(eq(santriProfiles.assignedGuruId, session.user.id));

    return NextResponse.json(santriList);
  } catch (error) {
    console.error("Error fetching santri binaan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
