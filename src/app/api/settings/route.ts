import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    const session = await getServerSession(authOptions);

    if (!session) {
      // Mask sensitive SMTP/R2 secrets for unauthenticated public requests
      return NextResponse.json({
        ...settings,
        smtpPass: settings.smtpPass ? "••••••••" : "",
        r2SecretAccessKey: settings.r2SecretAccessKey ? "••••••••" : "",
      });
    }

    return NextResponse.json(settings);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const existing = await getSiteSettings();

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        companyName: body.companyName ?? existing.companyName,
        tagline: body.tagline ?? existing.tagline,
        establishedYear: body.establishedYear ?? existing.establishedYear,
        directorName: body.directorName ?? existing.directorName,
        aboutShort: body.aboutShort ?? existing.aboutShort,
        aboutFull: body.aboutFull ?? existing.aboutFull,
        gstNumber: body.gstNumber ?? existing.gstNumber,
        businessType: body.businessType ?? existing.businessType,
        adminEmail: body.adminEmail ?? existing.adminEmail,
        publicEmail: body.publicEmail ?? existing.publicEmail,
        whatsappNumber: body.whatsappNumber ?? existing.whatsappNumber,
        phonePrimary: body.phonePrimary ?? existing.phonePrimary,
        phoneSecondary: body.phoneSecondary ?? existing.phoneSecondary,
        addressLine1: body.addressLine1 ?? existing.addressLine1,
        addressLine2: body.addressLine2 ?? existing.addressLine2,
        city: body.city ?? existing.city,
        state: body.state ?? existing.state,
        pincode: body.pincode ?? existing.pincode,
        country: body.country ?? existing.country,
        workingHours: body.workingHours ?? existing.workingHours,
        mapEmbedUrl: body.mapEmbedUrl ?? existing.mapEmbedUrl,
        mapLinkUrl: body.mapLinkUrl ?? existing.mapLinkUrl,
        latitude: body.latitude ?? existing.latitude,
        longitude: body.longitude ?? existing.longitude,
        locationsJson:
          typeof body.locations === "object"
            ? JSON.stringify(body.locations)
            : body.locationsJson ?? existing.locationsJson,
        heroBadge: body.heroBadge ?? existing.heroBadge,
        heroTitle: body.heroTitle ?? existing.heroTitle,
        heroSubtitle: body.heroSubtitle ?? existing.heroSubtitle,
        statsJson:
          typeof body.stats === "object"
            ? JSON.stringify(body.stats)
            : body.statsJson ?? existing.statsJson,
        whatsappDefaultMsg: body.whatsappDefaultMsg ?? existing.whatsappDefaultMsg,
        smtpHost: body.smtpHost ?? existing.smtpHost,
        smtpPort: body.smtpPort !== undefined ? Number(body.smtpPort) : existing.smtpPort,
        smtpUser: body.smtpUser ?? existing.smtpUser,
        smtpPass:
          body.smtpPass && body.smtpPass !== "••••••••" ? body.smtpPass : existing.smtpPass,
        smtpFromName: body.smtpFromName ?? existing.smtpFromName,
        r2AccountId: body.r2AccountId ?? existing.r2AccountId,
        r2AccessKeyId: body.r2AccessKeyId ?? existing.r2AccessKeyId,
        r2SecretAccessKey:
          body.r2SecretAccessKey && body.r2SecretAccessKey !== "••••••••"
            ? body.r2SecretAccessKey
            : existing.r2SecretAccessKey,
        r2BucketName: body.r2BucketName ?? existing.r2BucketName,
        r2PublicUrl: body.r2PublicUrl ?? existing.r2PublicUrl,
      },
      create: {
        id: "default",
        companyName: body.companyName || "Mustansir Enterprises",
      },
    });

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update settings" },
      { status: 500 }
    );
  }
}
