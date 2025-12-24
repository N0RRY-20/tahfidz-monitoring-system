import { NextResponse } from "next/server";
import { db } from "@/db";
import { classes } from "@/db/schema/tahfidz-schema";

export async function GET() {
  try {
    const allClasses = await db
      .select({
        id: classes.id,
        name: classes.name,
        description: classes.description,
      })
      .from(classes)
      .orderBy(classes.name);

    return NextResponse.json(allClasses);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
