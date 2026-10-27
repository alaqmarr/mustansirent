import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

function parseApps(json: string): string[] {
  try {
    const arr = JSON.parse(json || "[]");
    if (Array.isArray(arr)) return arr.map(String);
  } catch {
    // ignore
  }
  return [];
}

export default async function CategoriesPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          include: { category: true, brand: true },
          take: 4,
          orderBy: { featured: "desc" },
        },
        _count: { select: { products: true } },
      },
    }),
  ]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Page Header */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 lg:py-18">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
            {settings.companyName}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Product Categories
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl">
            Explore our core product divisions covering industrial valves,
            domestic and bulk water meters, and steam engineering controls.
          </p>
        </div>
      </section>

      {/* Category Sections */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-12 space-y-16">
        {categories.map((category) => {
          const apps = parseApps(category.applicationsJson);
          return (
            <section
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
            >
              {/* Standardized Light Category Banner */}
              <div className="p-6 sm:p-8 lg:p-10 bg-amber-50/40 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-3xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-display text-xs font-bold">
                    {category._count.products} Products Available
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {category.name}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {category.description}
                  </p>
                  {apps.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {apps.map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/categories/${category.slug}`}
                  className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shrink-0 self-start lg:self-center transition shadow-2xs"
                >
                  <span>View All in {category.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Category Products Preview */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      whatsappNumber={settings.whatsappNumber}
                      adminEmail={settings.adminEmail}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
