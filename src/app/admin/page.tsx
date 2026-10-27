import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const adminCount = await prisma.adminUser.count();
  if (adminCount === 0) {
    redirect("/setup");
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/admin/login");
  }

  const [products, categories, brands, resources, inquiries, settings] =
    await Promise.all([
      prisma.product.findMany({
        include: { category: true, brand: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.brand.findMany({
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.resource.findMany({
        include: { category: true, brand: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      }),
      getSiteSettings(),
    ]);

  return (
    <AdminDashboardClient
      initialProducts={products}
      initialCategories={categories}
      initialBrands={brands}
      initialResources={resources}
      initialInquiries={inquiries}
      initialSettings={settings}
      adminUser={session.user}
    />
  );
}
