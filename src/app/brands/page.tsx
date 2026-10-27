import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ArrowRight, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const [settings, brands] = await Promise.all([
    getSiteSettings(),
    prisma.brand.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: true } },
      },
    }),
  ]);

  const row1 = brands.slice(0, 4);
  const row2Left = brands.slice(4, 6);
  const row2Right = brands.slice(6, 8);
  const row3 = brands.slice(8, 12);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Header + Interlocking Honeycomb Showcase */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 lg:py-20">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              {settings.companyName} • Authorized Stockist
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
              Our Partner Brands
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
              We are authorized distributors and stockists for India&apos;s and
              the world&apos;s most trusted manufacturers of industrial valves,
              water meters, and steam traps.
            </p>
          </div>

          {/* Interlocking 4 - 5 - 4 Honeycomb on Light Theme */}
          <div className="hidden lg:flex flex-col items-center justify-center py-4 select-none">
            {/* Row 1: 4 Hexagons */}
            <div className="flex justify-center gap-[10px]">
              {row1.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2: 5 Hexagons (interlocks into Row 1 with -mt-[46px]) */}
            <div className="flex justify-center gap-[10px] -mt-[46px]">
              {row2Left.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}

              {/* Center Logo Emblem */}
              <div className="hex-pointy w-[184px] h-[212px] bg-amber-500 p-[2.5px] shadow-lg shadow-amber-500/20 z-10">
                <div className="hex-pointy w-full h-full bg-white flex flex-col items-center justify-center p-4 text-center">
                  <img
                    src="/images/logo.png"
                    alt={settings.companyName}
                    className="w-20 h-20 object-contain mb-1"
                  />
                  <span className="font-display font-extrabold text-xs uppercase tracking-tight text-slate-900 leading-tight">
                    Authorized Stockist
                  </span>
                  <span className="text-[11px] font-bold text-amber-600 mt-0.5">
                    Est. {settings.establishedYear}
                  </span>
                </div>
              </div>

              {row2Right.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 3: 4 Hexagons (interlocks into Row 2 with -mt-[46px]) */}
            <div className="flex justify-center gap-[10px] -mt-[46px]">
              {row3.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Complete Brand Directory Cards */}
      <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group bg-white rounded-xl border border-slate-200 hover:border-amber-500 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    {brand.specialization || "Authorized Brand"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {brand._count.products} Products
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                  {brand.name}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-amber-700 group-hover:text-amber-600">
                <span>View {brand.name} Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
