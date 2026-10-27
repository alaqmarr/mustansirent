import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true, resources: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(categories);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      code,
      shortDescription,
      description,
      image,
      iconName,
      accentColor,
      specsSummary,
      applicationsJson,
      featured,
      sortOrder,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    const created = await prisma.category.create({
      data: {
        name: String(name).trim(),
        slug: finalSlug,
        code: code || "DIV-NEW",
        shortDescription: String(shortDescription || name).trim(),
        description: String(description || shortDescription || name).trim(),
        image: image || "/images/catalog/cat-valves.svg",
        iconName: iconName || "Gauge",
        accentColor: accentColor || "#0284c7",
        specsSummary: specsSummary || "IS / BS / DIN / API Certified",
        applicationsJson:
          typeof applicationsJson === "object"
            ? JSON.stringify(applicationsJson)
            : applicationsJson || "[]",
        featured: featured !== undefined ? Boolean(featured) : true,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, category: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
