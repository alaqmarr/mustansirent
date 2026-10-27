import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Download, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const [settings, resources] = await Promise.all([
    getSiteSettings(),
    prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Page Header */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 lg:py-18">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
            {settings.companyName} • Technical Library
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Catalogs, Datasheets &amp; Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Download technical datasheets, valve dimension charts, water meter
            specifications, and steam engineering selection guides.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-amber-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                    {res.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {res.fileSize || "PDF"}
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    {res.title}
                  </h2>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {res.description}
                </p>
              </div>

              <a
                href={res.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </a>
            </div>
          ))}
        </div>

        {/* Custom Document Request Banner */}
        <div className="mt-14 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">
              Need a specific manufacturer test certificate or price list?
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Contact our sales team for IBR certificates, hydro-test reports,
              or bulk project quotations.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider shrink-0 transition"
          >
            Request Documents
          </Link>
        </div>
      </section>
    </div>
  );
}
