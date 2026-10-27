"use client";

import React, { useState } from "react";
import { Mail, FileText } from "lucide-react";
import { useInquiryModal } from "./Providers";
import { buildProductPrefillData, buildWhatsappUrl } from "@/lib/settings";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface ProductInquiryButtonsProps {
  product: {
    id: string;
    name: string;
    sku: string;
    sizeRange: string;
    pressureRating: string;
    bodyMaterial: string;
    endConnection: string;
    datasheetUrl?: string;
    brand?: { name: string } | null;
    category?: { name: string } | null;
  };
  whatsappNumber: string;
  adminEmail: string;
}

export function ProductInquiryButtons({
  product,
  whatsappNumber,
  adminEmail,
}: ProductInquiryButtonsProps) {
  const { openEmailModal } = useInquiryModal();
  const [selectedSizeNote, setSelectedSizeNote] = useState(
    `${product.sizeRange}, ${product.pressureRating}`
  );
  const [requiredQty, setRequiredQty] = useState("Standard Requirement");

  const basePrefill = buildProductPrefillData(product);

  const customWhatsappMessage = [
    basePrefill.whatsappText,
    `• *Required Size / Rating:* ${selectedSizeNote}`,
    `• *Quantity:* ${requiredQty}`,
  ].join("\n");

  const whatsappHref = buildWhatsappUrl(whatsappNumber, customWhatsappMessage);

  const handleOpenEmailModal = () => {
    const customEmailBody = [
      basePrefill.emailMessage,
      ``,
      `Requirement Details:`,
      `- Preferred Size / Rating: ${selectedSizeNote}`,
      `- Estimated Quantity: ${requiredQty}`,
    ].join("\n");

    openEmailModal({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      brandName: basePrefill.brandName,
      categoryName: basePrefill.categoryName,
      sizeRange: product.sizeRange,
      pressureRating: product.pressureRating,
      bodyMaterial: product.bodyMaterial,
      defaultSubject: basePrefill.emailSubject,
      defaultMessage: customEmailBody,
      adminEmail,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      {/* Light Header Bar */}
      <div className="px-6 py-4 bg-amber-50/70 border-b border-amber-200/80 flex items-center justify-between">
        <span className="font-display font-bold text-sm text-slate-900">
          Request a Quote for This Product
        </span>
        <span className="text-xs text-amber-700 font-semibold">
          Direct Response
        </span>
      </div>

      {/* Spec Customizer Inputs */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-b border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Required Size &amp; Pressure Rating
          </label>
          <input
            type="text"
            value={selectedSizeNote}
            onChange={(e) => setSelectedSizeNote(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Estimated Quantity
          </label>
          <input
            type="text"
            value={requiredQty}
            onChange={(e) => setRequiredQty(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Two Primary Prefilled Action Buttons */}
      <div className="p-6 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Button 1: Enquire over Email */}
        <button
          type="button"
          onClick={handleOpenEmailModal}
          className="py-3.5 px-5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition cursor-pointer shadow-2xs"
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span>Enquire by Email</span>
        </button>

        {/* Button 2: Enquire on WhatsApp Directly */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3.5 px-5 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition shadow-2xs"
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0" />
          <span>Enquire on WhatsApp</span>
        </a>
      </div>

      {/* Bottom Info Bar */}
      <div className="px-6 py-3 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Email inquiries sent to: {adminEmail}</span>
        {product.datasheetUrl && (
          <a
            href={product.datasheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-800 font-semibold inline-flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Download Datasheet
          </a>
        )}
      </div>
    </div>
  );
}
