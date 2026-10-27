import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInquiryEmail } from "@/lib/mailer";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inquiries);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      quantity,
      subject,
      message,
      productId,
      productName,
      productSku,
      brandName,
      categoryName,
      source,
    } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone number, and inquiry message are required." },
        { status: 400 }
      );
    }

    const finalSubject =
      subject ||
      (productName
        ? `Product Inquiry: ${productName} [${productSku || "Catalog"}]`
        : `Website Inquiry from ${name}`);

    const emailResult = await sendInquiryEmail({
      name,
      email,
      phone,
      company: company || "",
      quantity: quantity || "Standard Inquiry",
      subject: finalSubject,
      message,
      productName: productName || "",
      productSku: productSku || "",
      brandName: brandName || "",
      categoryName: categoryName || "",
      source: source || "PRODUCT_EMAIL_MODAL",
    });

    const inquiry = await prisma.inquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: String(phone).trim(),
        company: String(company || "").trim(),
        quantity: String(quantity || "Standard Inquiry").trim(),
        subject: finalSubject,
        message: String(message).trim(),
        productId: productId || null,
        productName: productName || "",
        productSku: productSku || "",
        brandName: brandName || "",
        categoryName: categoryName || "",
        source: source || "PRODUCT_EMAIL_MODAL",
        status: "NEW",
        emailSent: emailResult.sent,
        emailError: emailResult.error || "",
      },
    });

    return NextResponse.json({
      success: true,
      inquiry,
      emailSent: emailResult.sent,
      recipient: emailResult.recipient,
      notice: emailResult.error || null,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID required" }, { status: 400 });
    }

    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
