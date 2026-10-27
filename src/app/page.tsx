import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Download,
  FileText,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

function parseStringArray(json: string): string[] {
  try {
    const parsed = JSON.parse(json || "[]");
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // fallback
  }
  return [];
}

export default async function HomePage() {
  const [settings, categories, brands, featuredProducts, resources] =
    await Promise.all([
      getSiteSettings(),
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      prisma.brand.findMany({
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: true } } },
      }),
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true, brand: true },
        take: 8,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const cleanWa = (settings.whatsappNumber || "919849012345").replace(
    /[^\d]/g,
    ""
  );
  const fullAddress = `${settings.addressLine1}, ${settings.city}, ${settings.state} - ${settings.pincode}`;

  // Split brands into a 4 - 5 - 4 interlocking honeycomb (12 brands + 1 center Mustansir emblem = 13 cells)
  const row1Brands = brands.slice(0, 4);
  const row2LeftBrands = brands.slice(4, 6);
  const row2RightBrands = brands.slice(6, 8);
  const row3Brands = brands.slice(8, 12);
  const extraBrands = brands.slice(12);

  return (
    <div className="w-full overflow-hidden bg-[#F8FAFC]">
      {/* =====================================================================
          1. FULL-WIDTH LIGHT HERO WITH INTERLOCKING 7-CELL HONEYCOMB
          ===================================================================== */}
      <section className="relative w-full min-h-[80vh] bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 overflow-hidden flex items-center">
        <div className="absolute -top-36 right-[8%] w-[520px] h-[520px] rounded-full bg-amber-400/15 blur-[130px] pointer-events-none" />

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Clear Business Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-800">
                  Established {settings.establishedYear} • {settings.city},{" "}
                  {settings.state}
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] text-slate-900 max-w-3xl">
                Industrial Valves,{" "}
                <span className="text-amber-600">Water Meters</span> &amp; Steam
                Engineering Equipment.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                {settings.companyName} is a trusted stockist and authorized
                distributor in Secunderabad supplying industrial pipeline
                valves, domestic and bulk water meters, and steam traps from
                leading manufacturers including{" "}
                <span className="text-slate-900 font-semibold">
                  Audco, Spirax, Pennant, Actaris, Itron, Kartar, Racer, and
                  Normex
                </span>
                .
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-7 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all flex items-center gap-3 shadow-md shadow-amber-500/15"
                >
                  Browse Product Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `Hello ${settings.companyName}, I would like to enquire about industrial valves and water meters.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-emerald-50 hover:bg-[#25D366] text-emerald-900 hover:text-slate-950 border border-emerald-200 hover:border-[#25D366] font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all flex items-center gap-2.5"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] group-hover:text-slate-950" />
                  Enquire on WhatsApp
                </a>

                <Link
                  href="/contact"
                  className="px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-all"
                >
                  Contact Us
                </Link>
              </div>

              {/* Key Highlights */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    {new Date().getFullYear() -
                      (Number(settings.establishedYear) || 1987)}
                    + Yrs
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Industry Experience
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-amber-600">
                    12+
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized Brands
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    DN15–600
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nominal Bore Range
                  </p>
                </div>
                <div>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-emerald-600">
                    100%
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Genuine OEM Supply
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: TRUE INTERLOCKING 7-HEXAGON HONEYCOMB (2 - 3 - 2 Rosette on Light Theme) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative py-2 select-none">
                {/* ROW 1: 2 Hexagons */}
                <div className="flex justify-center gap-[6px] sm:gap-[8px]">
                  {/* Cell 1 */}
                  <Link
                    href="/categories/industrial-valves"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider">
                        Valves
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Wafer Check (NRV)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        Racer • Normex
                      </span>
                    </div>
                  </Link>

                  {/* Cell 2 */}
                  <Link
                    href="/categories/water-meters-systems"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider">
                        Water Meters
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Woltex &amp; Multimag
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        Actaris • Itron
                      </span>
                    </div>
                  </Link>
                </div>

                {/* ROW 2: 3 Hexagons (interlocks into Row 1 with exact -mt-1/4 height) */}
                <div className="flex justify-center gap-[6px] sm:gap-[8px] -mt-[29px] sm:-mt-[38px]">
                  {/* Cell 3 */}
                  <Link
                    href="/categories/industrial-valves"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider">
                        Valves
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Butterfly &amp; Sluice
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        Audco • Kartar
                      </span>
                    </div>
                  </Link>

                  {/* Cell 4: CENTER LOGO HEXAGON */}
                  <div className="hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-500 p-[2.5px] shadow-lg shadow-amber-500/20 z-10">
                    <div className="hex-pointy w-full h-full bg-white flex flex-col items-center justify-center p-2.5 text-center">
                      <img
                        src="/images/logo.png"
                        alt={settings.companyName}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                      />
                      <span className="font-display font-extrabold text-[11px] sm:text-xs uppercase tracking-tight text-slate-900 mt-1 leading-none">
                        Est. {settings.establishedYear}
                      </span>
                    </div>
                  </div>

                  {/* Cell 5 */}
                  <Link
                    href="/categories/steam-traps-controls"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider">
                        Steam
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Float &amp; Bucket Traps
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        Pennant • Spirax
                      </span>
                    </div>
                  </Link>
                </div>

                {/* ROW 3: 2 Hexagons (interlocks into Row 2 with exact -mt-1/4 height) */}
                <div className="flex justify-center gap-[6px] sm:gap-[8px] -mt-[29px] sm:-mt-[38px]">
                  {/* Cell 6 */}
                  <Link
                    href="/categories/industrial-valves"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">
                        Valves
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Ball &amp; PRV Valves
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        RB • CIM • Amco
                      </span>
                    </div>
                  </Link>

                  {/* Cell 7 */}
                  <Link
                    href="/categories/water-meters-systems"
                    className="group hex-pointy w-[116px] h-[134px] sm:w-[152px] sm:h-[175px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                  >
                    <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/70 flex flex-col items-center justify-center p-3 text-center transition-colors">
                      <span className="text-[10px] font-mono font-bold text-sky-600 uppercase tracking-wider">
                        Metering
                      </span>
                      <span className="font-display font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-tight">
                        Domestic &amp; Bulk
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">
                        Dashmesh • AMR
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. TRUST & CREDENTIALS STRIP
          ===================================================================== */}
      <section className="w-full bg-slate-50 border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-slate-900">
                  Authorized Stockist
                </p>
                <p className="text-xs text-slate-500">
                  Genuine products from 12+ leading brands
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-slate-900">
                  Leadership
                </p>
                <p className="text-xs text-slate-500">
                  Managed by Director {settings.directorName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-slate-900">
                  Secunderabad Showroom
                </p>
                <p className="text-xs text-slate-500">
                  Ranigunj, M.G. Road industrial area
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-sm text-slate-900">
                  Quick Quotations
                </p>
                <p className="text-xs text-slate-500">
                  Direct support via Email &amp; WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CORE PRODUCT CATEGORIES (STANDARDIZED LIGHT CARDS)
          ===================================================================== */}
      <section className="w-full py-16 lg:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 bg-white border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              What We Supply
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Core Product Categories
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl">
            We supply pipeline valves, water metering equipment, and steam
            control accessories for municipal water works, commercial buildings,
            pharmaceutical plants, and process industries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const apps = parseStringArray(cat.applicationsJson);
            return (
              <div
                key={cat.id}
                className="group bg-white rounded-xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Light Category Visual Header */}
                  <div className="relative h-52 bg-slate-50 overflow-hidden border-b border-slate-200">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-display font-bold text-xs shadow-2xs">
                        {cat._count.products} Products
                      </span>
                    </div>
                  </div>

                  {/* Category Title, Description & Highlights */}
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {cat.shortDescription || cat.description}
                    </p>

                    {apps.length > 0 && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Key Industries &amp; Applications
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {apps.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs font-medium px-2.5 py-1 bg-amber-50/70 text-slate-700 border border-amber-200/60 rounded-md"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-xs font-display font-bold uppercase tracking-wider text-amber-700 group-hover:text-amber-600 flex items-center gap-1.5 transition-colors"
                  >
                    View {cat.name}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-xs text-slate-400 font-medium">
                    0{index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          4. AUTHORIZED PARTNER BRANDS — LIGHT INTERLOCKING HONEYCOMB (4 - 5 - 4)
          ===================================================================== */}
      <section className="w-full py-20 lg:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 bg-[#F8FAFC] honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
                Authorized Stockist &amp; Distributor
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Our Partner Brands
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-slate-600 text-sm max-w-md">
                Click any brand below to view available valves, water meters,
                and steam engineering products.
              </p>
              <Link
                href="/brands"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shrink-0 self-start sm:self-auto shadow-2xs"
              >
                View All Brands
              </Link>
            </div>
          </div>

          {/* Desktop / Tablet Light Interlocking 4 - 5 - 4 Honeycomb Grid (12 Brands + 1 Center Hub) */}
          <div className="hidden lg:flex flex-col items-center justify-center py-4 select-none">
            {/* ROW 1: 4 Hexagons */}
            <div className="flex justify-center gap-[10px]">
              {row1Brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5 transition-colors">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ROW 2: 5 Hexagons (2 Brands + Center Emblem + 2 Brands) — Interlocks with -mt-[46px] */}
            <div className="flex justify-center gap-[10px] -mt-[46px]">
              {row2LeftBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5 transition-colors">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}

              {/* Center Logo Hexagon */}
              <Link
                href="/brands"
                className="hex-pointy w-[184px] h-[212px] bg-amber-500 p-[2.5px] shadow-lg shadow-amber-500/20 z-10 hover:scale-[1.02] transition-transform"
              >
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
                    Since {settings.establishedYear}
                  </span>
                </div>
              </Link>

              {row2RightBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5 transition-colors">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* ROW 3: 4 Hexagons — Interlocks with -mt-[46px] */}
            <div className="flex justify-center gap-[10px] -mt-[46px]">
              {row3Brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group hex-pointy w-[184px] h-[212px] bg-amber-300/90 hover:bg-amber-500 p-[2px] transition-all duration-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="hex-pointy w-full h-full bg-white group-hover:bg-amber-50/60 flex flex-col items-center justify-center p-5 text-center transition-colors">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider line-clamp-1">
                      {brand.specialization || "Authorized Partner"}
                    </span>
                    <span className="font-display text-xl font-bold text-slate-900 group-hover:text-amber-700 mt-1.5 transition-colors">
                      {brand.name}
                    </span>
                    <span className="mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                      {brand._count.products} Products
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* If admin adds additional brands beyond 12, display them cleanly */}
            {extraBrands.length > 0 && (
              <div className="flex flex-wrap justify-center gap-[10px] mt-6">
                {extraBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.slug}`}
                    className="px-5 py-3 rounded-lg bg-white border border-slate-200 hover:border-amber-500 text-slate-900 font-display font-bold text-sm shadow-2xs"
                  >
                    {brand.name} ({brand._count.products})
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile & Small Tablet Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 lg:hidden">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500 shadow-2xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block truncate">
                    {brand.specialization || "Partner Brand"}
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-1">
                    {brand.name}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 mt-3 block">
                  {brand._count.products} Products →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. FEATURED PRODUCTS (DIRECT EMAIL + WHATSAPP QUOTES)
          ===================================================================== */}
      <section className="w-full py-16 lg:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 bg-white border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              Our Product Range
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Featured Industrial Equipment
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-2xs"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={settings.whatsappNumber}
              adminEmail={settings.adminEmail}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. COMPANY OVERVIEW & TECHNICAL CATALOGS
          ===================================================================== */}
      <section className="w-full py-16 lg:py-24 px-4 sm:px-8 lg:px-14 xl:px-20 bg-[#F8FAFC]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 7 Columns: About Mustansir Enterprises */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
            <div className="mb-5 pb-5 border-b border-slate-100">
              <img
                src="/images/logo-lockup.png"
                alt={settings.companyName}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
              About {settings.companyName}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Serving Industries &amp; Water Works Since{" "}
              {settings.establishedYear}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Established in {settings.establishedYear} in Secunderabad and
              managed by Director{" "}
              <strong className="text-slate-900">{settings.directorName}</strong>
              , {settings.companyName} is a verified wholesaler, distributor, and
              supplier of industrial pipeline valves, water meters, and steam
              traps across Telangana and India.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                "Wafer Check Valves (NRV), Butterfly & Sluice Valves",
                "Domestic & Bulk Water Meters (Woltex & Multimag)",
                "Float Traps, Bucket Steam Traps & Strainers",
                "Automatic Air Vents & Pressure Reducing Valves",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium text-slate-800">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">
                  Showroom &amp; Office Address
                </p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {fullAddress}
                </p>
              </div>
              <Link
                href="/contact"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Get Directions &amp; Contact
              </Link>
            </div>
          </div>

          {/* Right 5 Columns: Technical Datasheets & Resources */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-1">
                  Downloads
                </span>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Catalogs &amp; Datasheets
                </h3>
              </div>
              <Link
                href="/resources"
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                View All
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {resources.map((res) => (
                <a
                  key={res.id}
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200/80 hover:border-amber-300 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-amber-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-amber-800 truncate">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {res.type} • {res.fileSize || "PDF"}
                      </p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-600 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
