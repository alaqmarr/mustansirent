"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useInquiryModal } from "./Providers";
import { buildProductPrefillData, buildWhatsappUrl } from "@/lib/settings";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  image: string;
  sizeRange: string;
  pressureRating: string;
  bodyMaterial: string;
  priceLabel: string;
  inStock: boolean;
  featured?: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ProductCardProps {
  product: ProductCardData;
  whatsappNumber: string;
  adminEmail: string;
}

export function ProductCard({
  product,
  whatsappNumber,
  adminEmail,
}: ProductCardProps) {
  const { openEmailModal } = useInquiryModal();
  const prefill = buildProductPrefillData(product);
  const whatsappHref = buildWhatsappUrl(whatsappNumber, prefill.whatsappText);

  const handleEmailEnquire = () => {
    openEmailModal({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      brandName: prefill.brandName,
      categoryName: prefill.categoryName,
      sizeRange: product.sizeRange,
      pressureRating: product.pressureRating,
      bodyMaterial: product.bodyMaterial,
      defaultSubject: prefill.emailSubject,
      defaultMessage: prefill.emailMessage,
      adminEmail,
    });
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200 hover:border-amber-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Meta Strip */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-500 font-medium">
            {product.sku}
          </span>
          {product.brand ? (
            <Link
              href={`/brands/${product.brand.slug || product.brand.id}`}
              className="inline-flex items-center gap-1.5 font-bold text-slate-800 hover:text-amber-600 transition"
            >
              <span className="w-2 h-2 hex-pointy bg-amber-500" />
              {product.brand.name}
            </Link>
          ) : (
            <span className="text-slate-700 font-semibold">
              Authorized Brand
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="block relative h-52 bg-slate-50 border-b border-slate-100 overflow-hidden"
        >
          <img
            src={product.image || "/images/catalog/prod-nrv.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>

        {/* Product Body */}
        <div className="p-5 space-y-2.5">
          {product.category && (
            <Link
              href={`/categories/${
                product.category.slug || product.category.id
              }`}
              className="text-xs font-semibold text-amber-600 block hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          <Link
            href={`/products/${product.slug || product.id}`}
            className="font-display text-lg font-bold text-slate-900 group-hover:text-amber-600 transition block leading-snug line-clamp-2"
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Clean Spec Row */}
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-800 flex items-center justify-between gap-2">
            <span className="font-medium truncate">{product.sizeRange}</span>
            <span className="text-slate-500 shrink-0">
              {product.pressureRating.split("/")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Two Prefilled Action Buttons */}
      <div className="p-3 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleEmailEnquire}
          className="py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span>Email Quote</span>
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
          <span>WhatsApp</span>
        </a>
      </div>
    </article>
  );
}
