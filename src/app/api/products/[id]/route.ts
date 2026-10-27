import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        sku: body.sku,
        shortDescription: body.shortDescription,
        description: body.description,
        image: body.image,
        sizeRange: body.sizeRange,
        pressureRating: body.pressureRating,
        bodyMaterial: body.bodyMaterial,
        endConnection: body.endConnection,
        priceLabel: body.priceLabel,
        inStock: body.inStock !== undefined ? Boolean(body.inStock) : undefined,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
        datasheetUrl: body.datasheetUrl,
        categoryId: body.categoryId,
        brandId: body.brandId,
        specificationsJson:
          typeof body.specificationsJson === "object"
            ? JSON.stringify(body.specificationsJson)
            : body.specificationsJson,
        featuresJson:
          typeof body.featuresJson === "object"
            ? JSON.stringify(body.featuresJson)
            : body.featuresJson,
        applicationsJson:
          typeof body.applicationsJson === "object"
            ? JSON.stringify(body.applicationsJson)
            : body.applicationsJson,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete product" },
      { status: 500 }
    );
  }
}
