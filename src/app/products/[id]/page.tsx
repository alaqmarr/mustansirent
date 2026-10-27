import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProductInquiryButtons } from "@/components/ProductInquiryButtons";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [settings, product] = await Promise.all([
    getSiteSettings(),
    prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        brand: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  let parsedSpecs: Array<{ label: string; value: string }> = [];
  try {
    const raw = JSON.parse(product.specificationsJson || "[]");
    if (Array.isArray(raw)) {
      parsedSpecs = raw;
    } else if (raw && typeof raw === "object") {
      parsedSpecs = Object.entries(raw).map(([label, value]) => ({
        label,
        value: String(value),
      }));
    }
  } catch {
    parsedSpecs = [];
  }

  let applicationList: string[] = [];
  try {
    const rawApps = JSON.parse(product.applicationsJson || "[]");
    if (Array.isArray(rawApps)) {
      applicationList = rawApps.map(String);
    }
  } catch {
    applicationList = [];
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: { category: true, brand: true },
    take: 4,
  });

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 lg:px-14 xl:px-20 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="text-slate-900 font-semibold hover:text-amber-600 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Products
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-slate-900"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <Link
            href={`/brands/${product.brand.slug}`}
            className="hover:text-slate-900 font-medium text-amber-600"
          >
            {product.brand.name}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Product Code: <strong className="text-slate-800">{product.sku}</strong>
        </span>
      </div>

      {/* Main Product Section */}
      <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Columns: Product Image & Quick Specs */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-slate-100 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-slate-400">
                  {product.brand.name} — {product.name}
                </span>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-amber-500 text-slate-950 font-display text-xs font-bold uppercase">
                  {product.brand.name}
                </span>
                <span className="px-3 py-1 rounded-md bg-slate-950/80 text-white text-xs font-medium">
                  {product.inStock ? "Available" : "On Order"}
                </span>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 border-t border-slate-200 bg-slate-50/50">
              <div className="p-4">
                <span className="text-[11px] font-medium text-slate-400 uppercase block">
                  Size Range
                </span>
                <span className="font-display font-bold text-sm text-slate-900 mt-0.5 block">
                  {product.sizeRange || "Standard"}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-medium text-slate-400 uppercase block">
                  Pressure Rating
                </span>
                <span className="font-display font-bold text-sm text-slate-900 mt-0.5 block">
                  {product.pressureRating || "Standard"}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-medium text-slate-400 uppercase block">
                  Body Material
                </span>
                <span className="font-display font-bold text-sm text-slate-900 mt-0.5 block">
                  {product.bodyMaterial || "Standard"}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-medium text-slate-400 uppercase block">
                  End Connection
                </span>
                <span className="font-display font-bold text-sm text-slate-900 mt-0.5 block">
                  {product.endConnection || "Flanged / Wafer"}
                </span>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Product Info & Inquiry Buttons */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-amber-600 hover:underline"
                >
                  {product.category.name}
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href={`/brands/${product.brand.slug}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Brand: {product.brand.name}
                </Link>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
                {product.name}
              </h1>

              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {product.description || product.shortDescription}
              </p>

              {/* Applications */}
              {applicationList.length > 0 && (
                <div className="pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Recommended Applications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {applicationList.map((app, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Email & WhatsApp Inquiry Component */}
            <ProductInquiryButtons
              product={product}
              whatsappNumber={settings.whatsappNumber}
              adminEmail={settings.adminEmail}
            />

            {/* Detailed Specifications Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-slate-900">
                  Technical Specifications
                </h2>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Genuine {product.brand.name} Supply
                </span>
              </div>
              <div className="divide-y divide-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-sm">
                  <span className="text-slate-500 font-medium">
                    Manufacturer / Make
                  </span>
                  <span className="sm:col-span-2 font-semibold text-slate-900">
                    {product.brand.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-sm">
                  <span className="text-slate-500 font-medium">
                    Nominal Size Range
                  </span>
                  <span className="sm:col-span-2 font-semibold text-slate-900">
                    {product.sizeRange}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-sm">
                  <span className="text-slate-500 font-medium">
                    Pressure Rating
                  </span>
                  <span className="sm:col-span-2 font-semibold text-slate-900">
                    {product.pressureRating}
                  </span>
                </div>
                {parsedSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-3 px-6 py-3.5 text-sm"
                  >
                    <span className="text-slate-500 font-medium">
                      {spec.label}
                    </span>
                    <span className="sm:col-span-2 font-semibold text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="w-full py-14 px-4 sm:px-8 lg:px-14 xl:px-20 bg-white border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
                More in {product.category.name}
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Related Products
              </h2>
            </div>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-bold text-amber-600 hover:text-amber-700"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                whatsappNumber={settings.whatsappNumber}
                adminEmail={settings.adminEmail}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
