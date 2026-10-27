import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";
import { Search, X } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; q?: string }>;
}) {
  const params = await searchParams;
  const activeCategorySlug = params.category || "";
  const activeBrandSlug = params.brand || "";
  const searchQuery = params.q || "";

  const [settings, categories, brands, products] = await Promise.all([
    getSiteSettings(),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(activeCategorySlug
          ? { category: { slug: activeCategorySlug } }
          : {}),
        ...(activeBrandSlug ? { brand: { slug: activeBrandSlug } } : {}),
        ...(searchQuery
          ? {
              OR: [
                { name: { contains: searchQuery } },
                { sku: { contains: searchQuery } },
                { shortDescription: { contains: searchQuery } },
                { bodyMaterial: { contains: searchQuery } },
              ],
            }
          : {}),
      },
      include: { category: true, brand: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
  ]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Page Header */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                {settings.companyName} • Product Catalog
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                Industrial Valves, Water Meters &amp; Steam Traps
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl">
                Browse our complete product range below. Every product includes
                direct Email and WhatsApp inquiry options for fast quotations.
              </p>
            </div>

            {/* Search Form */}
            <form
              action="/products"
              method="GET"
              className="w-full lg:w-96 shrink-0"
            >
              {activeCategorySlug && (
                <input
                  type="hidden"
                  name="category"
                  value={activeCategorySlug}
                />
              )}
              {activeBrandSlug && (
                <input type="hidden" name="brand" value={activeBrandSlug} />
              )}
              <div className="flex rounded-lg overflow-hidden border border-slate-300 bg-white focus-within:border-amber-500 shadow-2xs">
                <div className="pl-3.5 flex items-center text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search valve, water meter, brand..."
                  className="w-full bg-transparent text-slate-900 px-3 py-3 text-sm focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            {/* Category Filter */}
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Categories
              </h2>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/products${
                    activeBrandSlug ? `?brand=${activeBrandSlug}` : ""
                  }`}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                    !activeCategorySlug
                      ? "bg-amber-50 text-amber-800 border border-amber-200 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>All Categories</span>
                </Link>
                {categories.map((cat) => {
                  const active = activeCategorySlug === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug}${
                        activeBrandSlug ? `&brand=${activeBrandSlug}` : ""
                      }`}
                      className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        active
                          ? "bg-amber-50 text-amber-800 border border-amber-200 font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="pt-6 border-t border-slate-200">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Partner Brands
              </h2>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  href={`/products${
                    activeCategorySlug ? `?category=${activeCategorySlug}` : ""
                  }`}
                  className={`col-span-2 px-3 py-2 rounded-lg text-xs font-semibold text-center transition ${
                    !activeBrandSlug
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  All Brands
                </Link>
                {brands.map((brand) => {
                  const active = activeBrandSlug === brand.slug;
                  return (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${brand.slug}${
                        activeCategorySlug
                          ? `&category=${activeCategorySlug}`
                          : ""
                      }`}
                      className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-center truncate transition ${
                        active
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {brand.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {(activeCategorySlug || activeBrandSlug || searchQuery) && (
              <div className="pt-4 border-t border-slate-200">
                <Link
                  href="/products"
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear All Filters
                </Link>
              </div>
            )}
          </aside>

          {/* Right Product Grid */}
          <div className="lg:col-span-9">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-600">
                Showing{" "}
                <strong className="text-slate-900">{products.length}</strong>{" "}
                products
              </p>
              {(activeCategorySlug || activeBrandSlug || searchQuery) && (
                <Link
                  href="/products"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  Reset Filters
                </Link>
              )}
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
                  No matching products found
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Try clearing your search filters or view all products.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 rounded-lg bg-amber-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider"
                >
                  Show All Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={settings.whatsappNumber}
                    adminEmail={settings.adminEmail}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
