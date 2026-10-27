import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const updated = await prisma.resource.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        type: body.type,
        description: body.description,
        fileUrl: body.fileUrl,
        fileSize: body.fileSize,
        standardCode: body.standardCode,
        featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
        categoryId: body.categoryId || null,
        brandId: body.brandId || null,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    return NextResponse.json({ success: true, resource: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update resource" },
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
    await prisma.resource.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete resource" },
      { status: 500 }
    );
  }
}
