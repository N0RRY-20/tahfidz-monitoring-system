import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, userRole, role } from "@/db/schema/auth-schema";
import { santriProfiles } from "@/db/schema/tahfidz-schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all users with guru role
    const gurus = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .innerJoin(userRole, eq(user.id, userRole.userId))
      .innerJoin(role, eq(userRole.roleId, role.id))
      .where(eq(role.name, "guru"));

    // Count santri per guru
    const santriCounts = await db
      .select({
        guruId: santriProfiles.assignedGuruId,
        count: sql<number>`count(*)`,
      })
      .from(santriProfiles)
      .groupBy(santriProfiles.assignedGuruId);

    const countMap = new Map(
      santriCounts.map((c) => [c.guruId, Number(c.count)])
    );

    const result = gurus.map((guru) => ({
      ...guru,
      santriCount: countMap.get(guru.id) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching gurus:", error);
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
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Create user via better-auth signup
    const signupRes = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!signupRes?.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Assign guru role
    await db.insert(userRole).values({
      userId: signupRes.user.id,
      roleId: "role_guru",
    });

    return NextResponse.json({ success: true, id: signupRes.user.id });
  } catch (error) {
    console.error("Error creating guru:", error);
    return NextResponse.json(
      { error: "Email sudah terdaftar atau terjadi kesalahan" },
      { status: 500 }
    );
  }
}
