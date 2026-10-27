"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buildWhatsappUrl } from "@/lib/settings";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface NavbarProps {
  settings: {
    companyName: string;
    establishedYear: string;
    directorName: string;
    city: string;
    state: string;
    phonePrimary: string;
    publicEmail: string;
    adminEmail: string;
    whatsappNumber: string;
    whatsappDefaultMsg: string;
    gstNumber?: string;
  };
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const whatsappHref = buildWhatsappUrl(
    settings.whatsappNumber,
    settings.whatsappDefaultMsg ||
      `Hello ${settings.companyName}, I would like to enquire about your industrial valves, water meters, and steam controls.`
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Light Top Info Strip */}
      <div className="w-full bg-slate-50 text-slate-600 text-xs border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-slate-900 font-semibold">
              <span className="w-2.5 h-2.5 hex-pointy bg-amber-500 inline-block" />
              Established {settings.establishedYear} • {settings.city},{" "}
              {settings.state}
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="hidden md:inline text-slate-600">
              Authorized Stockist: Industrial Valves, Water Meters &amp; Steam
              Controls
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${settings.phonePrimary}`}
              className="hover:text-amber-600 font-medium transition hidden sm:inline"
            >
              {settings.phonePrimary}
            </a>
            <a
              href={`mailto:${settings.adminEmail}`}
              className="hover:text-amber-600 font-medium transition hidden lg:inline"
            >
              {settings.adminEmail}
            </a>
            <Link
              href="/admin"
              className="text-amber-600 hover:text-amber-700 transition font-semibold"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 flex items-center justify-between min-h-[72px] gap-4">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <img
            src="/images/logo.png"
            alt={settings.companyName}
            className="w-12 h-12 object-contain shrink-0"
          />
          <div>
            <span className="font-display text-lg xl:text-xl font-bold tracking-tight text-slate-900 block leading-none">
              {settings.companyName}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1 font-medium">
              Valves • Water Meters • Steam Traps
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {isActive && (
                  <span className="w-2 h-2 hex-pointy bg-amber-500" />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 transition"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
            <span>WhatsApp</span>
          </a>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider transition shadow-2xs"
          >
            <span>Get a Quote</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 divide-y divide-slate-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3.5 text-sm font-semibold text-slate-800 hover:bg-amber-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="py-3 rounded-lg flex items-center justify-center text-xs font-bold text-slate-950 bg-amber-500"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
