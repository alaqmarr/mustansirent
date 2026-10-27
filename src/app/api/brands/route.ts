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
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true, resources: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(brands);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch brands" },
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
      logo,
      country,
      specialization,
      description,
      authorizedStatus,
      websiteUrl,
      featured,
      sortOrder,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    const created = await prisma.brand.create({
      data: {
        name: String(name).trim(),
        slug: finalSlug,
        logo: logo || "/images/catalog/prod-butterfly.svg",
        country: country || "India / Global",
        specialization: specialization || "Industrial Flow & Metering Equipment",
        description: description || specialization || name,
        authorizedStatus: authorizedStatus || "Authorized Stockist & Distributor",
        websiteUrl: websiteUrl || "",
        featured: featured !== undefined ? Boolean(featured) : true,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
      },
    });

    return NextResponse.json({ success: true, brand: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create brand" },
      { status: 500 }
    );
  }
}
