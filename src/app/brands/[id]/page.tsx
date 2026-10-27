import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [settings, brand] = await Promise.all([
    getSiteSettings(),
    prisma.brand.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        products: {
          include: { category: true, brand: true },
          orderBy: [{ featured: "desc" }, { name: "asc" }],
        },
      },
    }),
  ]);

  if (!brand) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Brand Header */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-12 lg:py-16">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Partner Brands
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-display text-xs font-bold uppercase">
              {brand.authorizedStatus || "Authorized Stockist"}
            </span>
            {brand.country && (
              <span className="text-xs text-slate-500 font-medium">
                Origin: {brand.country}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {brand.name}
          </h1>
          {brand.specialization && (
            <p className="text-amber-700 font-semibold text-sm sm:text-base mt-1">
              {brand.specialization}
            </p>
          )}
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            {brand.description}
          </p>
        </div>
      </section>

      {/* Brand Products */}
      <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-12">
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <strong className="text-slate-900">{brand.products.length}</strong>{" "}
            products from <strong>{brand.name}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brand.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.whatsappNumber}
              adminEmail={settings.adminEmail}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
