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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const brandId = searchParams.get("brandId");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { shortDescription: { contains: q } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(products);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch products" },
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
      sku,
      shortDescription,
      description,
      image,
      sizeRange,
      pressureRating,
      bodyMaterial,
      endConnection,
      priceLabel,
      inStock,
      featured,
      datasheetUrl,
      categoryId,
      brandId,
      specificationsJson,
      featuresJson,
      applicationsJson,
    } = body;

    if (!name || !categoryId || !brandId) {
      return NextResponse.json(
        { error: "Product name, category, and brand are required." },
        { status: 400 }
      );
    }

    const finalSlug = slug ? slugify(slug) : `${slugify(name)}-${Date.now().toString().slice(-4)}`;

    const created = await prisma.product.create({
      data: {
        name: String(name).trim(),
        slug: finalSlug,
        sku: String(sku || `ME-SKU-${Date.now().toString().slice(-4)}`).trim(),
        shortDescription: String(shortDescription || name).trim(),
        description: String(description || shortDescription || name).trim(),
        image: image || "/images/catalog/prod-nrv.svg",
        sizeRange: sizeRange || "15mm to 300mm",
        pressureRating: pressureRating || "PN10 / PN16 / Class 150",
        bodyMaterial: bodyMaterial || "Cast Iron / Cast Steel / SS 304 / SS 316",
        endConnection: endConnection || "Flanged / Wafer / Screwed",
        priceLabel: priceLabel || "Wholesale Quote on Request",
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        featured: featured !== undefined ? Boolean(featured) : true,
        datasheetUrl: datasheetUrl || "",
        categoryId,
        brandId,
        specificationsJson:
          typeof specificationsJson === "object"
            ? JSON.stringify(specificationsJson)
            : specificationsJson || "[]",
        featuresJson:
          typeof featuresJson === "object" ? JSON.stringify(featuresJson) : featuresJson || "[]",
        applicationsJson:
          typeof applicationsJson === "object"
            ? JSON.stringify(applicationsJson)
            : applicationsJson || "[]",
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json({ success: true, product: created });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create product" },
      { status: 500 }
    );
  }
}
