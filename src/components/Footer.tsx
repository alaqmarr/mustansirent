import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildWhatsappUrl } from "@/lib/settings";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface FooterProps {
  settings: {
    companyName: string;
    tagline: string;
    establishedYear: string;
    directorName: string;
    aboutShort: string;
    gstNumber: string;
    businessType: string;
    adminEmail: string;
    publicEmail: string;
    whatsappNumber: string;
    phonePrimary: string;
    phoneSecondary: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    workingHours: string;
    whatsappDefaultMsg: string;
  };
}

export function Footer({ settings }: FooterProps) {
  const whatsappHref = buildWhatsappUrl(
    settings.whatsappNumber,
    settings.whatsappDefaultMsg ||
      `Hello ${settings.companyName}, I would like to enquire about your industrial equipment.`
  );

  return (
    <footer className="w-full bg-white text-slate-600 border-t-2 border-amber-500">
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-slate-200">
        {/* Col 1: Company Identity */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt={settings.companyName}
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <span className="text-xs tracking-wider text-amber-600 font-bold uppercase block">
                  Established {settings.establishedYear} • {settings.city}
                </span>
                <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight">
                  {settings.companyName}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.aboutShort}
            </p>
          </div>

          <div className="pt-5 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">
                Director
              </span>
              <span className="text-slate-900 font-bold mt-0.5 block">
                {settings.directorName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase font-semibold">
                GST Number
              </span>
              <span className="text-amber-700 font-bold mt-0.5 block">
                {settings.gstNumber || "Verified Stockist"}
              </span>
            </div>
          </div>
        </div>

        {/* Col 2: Product Categories */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-xs tracking-wider text-amber-600 font-bold uppercase">
            Product Categories
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/categories/industrial-valves"
                className="text-slate-700 hover:text-amber-600 font-medium transition flex items-center justify-between group"
              >
                <span>Industrial Valves</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
              </Link>
            </li>
            <li>
              <Link
                href="/categories/water-meters-systems"
                className="text-slate-700 hover:text-amber-600 font-medium transition flex items-center justify-between group"
              >
                <span>Water Meters &amp; Systems</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
              </Link>
            </li>
            <li>
              <Link
                href="/categories/steam-traps-controls"
                className="text-slate-700 hover:text-amber-600 font-medium transition flex items-center justify-between group"
              >
                <span>Steam Traps &amp; Controls</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-slate-600 hover:text-amber-600 transition flex items-center justify-between"
              >
                <span>All Products</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="text-slate-600 hover:text-amber-600 transition flex items-center justify-between"
              >
                <span>Catalogs &amp; Brochures</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs tracking-wider text-amber-600 font-bold uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-600">
            <li>
              <Link href="/brands" className="hover:text-amber-600 transition">
                Partner Brands
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="hover:text-amber-600 transition"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="hover:text-amber-600 transition"
              >
                Resources
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-600 transition">
                Contact Us
              </Link>
            </li>
            <li className="pt-2 border-t border-slate-200">
              <Link
                href="/admin"
                className="text-xs font-semibold text-amber-600 hover:underline"
              >
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/setup"
                className="text-xs text-slate-500 hover:text-slate-900"
              >
                Admin Setup
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact Details */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <h4 className="text-xs tracking-wider text-amber-600 font-bold uppercase">
              Office &amp; Showroom
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings.addressLine1}
              {settings.addressLine2 ? `, ${settings.addressLine2}` : ""}
              <br />
              {settings.city}, {settings.state} - {settings.pincode},{" "}
              {settings.country}
            </p>
            <div className="space-y-1 text-xs text-slate-800 font-medium">
              <div>Phone: {settings.phonePrimary}</div>
              {settings.phoneSecondary && (
                <div>Mobile: {settings.phoneSecondary}</div>
              )}
              <div className="text-amber-700">Email: {settings.adminEmail}</div>
            </div>
            <div className="text-[11px] text-slate-500">
              {settings.workingHours}
            </div>
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>Chat on WhatsApp</span>
            </span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} {settings.companyName}. All rights
          reserved.
        </div>
        <div className="text-slate-600 font-medium">
          Authorized Stockist: Racer • Normex • Pennant • Kartar • Audco • Amco
          • RB • CIM • Actaris • Dashmesh • Itron • Spirax
        </div>
      </div>
    </footer>
  );
}
