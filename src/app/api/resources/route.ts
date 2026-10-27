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
    const resources = await prisma.resource.findMany({
      include: {
        category: true,
        brand: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(resources);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch resources" },
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
      title,
      slug,
      type,
      description,
      fileUrl,
      fileSize,
      standardCode,
      featured,
      categoryId,
      brandId,
    } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: "Title and file URL are required." },
        { status: 400 }
      );
    }

    const finalSlug = slug
      ? slugify(slug)
      : `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    const created = await prisma.resource.create({
      data: {
        title: String(title).trim(),
        slug: finalSlug,
        type: type || "Technical Catalog",
        description: description || title,
        fileUrl: String(fileUrl).trim(),
        fileSize: fileSize || "2.0 MB PDF",
        standardCode: standardCode || "ISO / IS Standard",
        featured: featured !== undefined ? Boolean(featured) : true,
        categoryId: categoryId || null,
        brandId: brandId || null,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json({ success: true, resource: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create resource" },
      { status: 500 }
    );
  }
}
