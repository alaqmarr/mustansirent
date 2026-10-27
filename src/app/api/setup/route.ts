import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.adminUser.count();
    return NextResponse.json({
      isLocked: count > 0,
      adminCount: count,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to check setup status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const existingCount = await prisma.adminUser.count();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          error:
            "Setup is permanently locked because an administrator account has already been initialized.",
          isLocked: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const admin = await prisma.adminUser.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      isLocked: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create admin account" },
      { status: 500 }
    );
  }
}
