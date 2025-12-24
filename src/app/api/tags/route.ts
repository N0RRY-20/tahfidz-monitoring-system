import { NextResponse } from "next/server";
import { db } from "@/db";
import { masterTags } from "@/db/schema/tahfidz-schema";

export async function GET() {
  try {
    const tags = await db
      .select()
      .from(masterTags)
      .orderBy(masterTags.category, masterTags.tagText);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
