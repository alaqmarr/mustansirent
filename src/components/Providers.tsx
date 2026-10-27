"use client";

import React, { createContext, useContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { X, CheckCircle2, Send } from "lucide-react";

export interface PrefilledProductInquiry {
  productId?: string;
  productName: string;
  productSku: string;
  brandName: string;
  categoryName: string;
  sizeRange?: string;
  pressureRating?: string;
  bodyMaterial?: string;
  defaultSubject: string;
  defaultMessage: string;
  adminEmail?: string;
}

interface InquiryModalContextValue {
  openEmailModal: (prefill: PrefilledProductInquiry) => void;
  closeEmailModal: () => void;
}

const InquiryModalContext = createContext<InquiryModalContextValue>({
  openEmailModal: () => {},
  closeEmailModal: () => {},
});

export function useInquiryModal() {
  return useContext(InquiryModalContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [modalData, setModalData] = useState<PrefilledProductInquiry | null>(
    null
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("Standard Requirement");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    emailSent?: boolean;
    recipient?: string;
    notice?: string | null;
    error?: string;
  } | null>(null);

  const openEmailModal = (prefill: PrefilledProductInquiry) => {
    setModalData(prefill);
    setSubject(prefill.defaultSubject);
    setMessage(prefill.defaultMessage);
    setResult(null);
  };

  const closeEmailModal = () => {
    setModalData(null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalData) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          quantity,
          subject,
          message,
          productId: modalData.productId,
          productName: modalData.productName,
          productSku: modalData.productSku,
          brandName: modalData.brandName,
          categoryName: modalData.categoryName,
          source: "PRODUCT_EMAIL_ENQUIRY",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult({
          success: false,
          error: data.error || "Failed to send inquiry",
        });
      } else {
        setResult({
          success: true,
          emailSent: data.emailSent,
          recipient: data.recipient,
          notice: data.notice,
        });
      }
    } catch (err: unknown) {
      setResult({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Network error submitting inquiry",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SessionProvider>
      <InquiryModalContext.Provider value={{ openEmailModal, closeEmailModal }}>
        {children}

        {modalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl my-8 overflow-hidden">
              {/* Standardized Light Header */}
              <div className="bg-amber-50/80 border-b border-amber-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                    Product Quotation Request
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                    {modalData.productName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="p-2 rounded-lg text-slate-500 hover:bg-amber-100 hover:text-slate-900 transition cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Prefilled Spec Summary */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-3">
                  <span>
                    <strong className="text-slate-900">Brand:</strong>{" "}
                    {modalData.brandName}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900">Category:</strong>{" "}
                    {modalData.categoryName}
                  </span>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900">Code:</strong>{" "}
                    {modalData.productSku}
                  </span>
                </div>
              </div>

              <div className="p-6 max-h-[78vh] overflow-y-auto">
                {result?.success ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-slate-900">
                      Enquiry Sent Successfully
                    </h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Thank you! Your quotation request for{" "}
                      <strong>{modalData.productName}</strong> has been received.
                      Our team will get back to you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={closeEmailModal}
                      className="px-6 py-2.5 rounded-lg bg-amber-500 text-slate-950 font-display text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {result?.error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium">
                        {result.error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98480 XXXXX"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your Company / Organization"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Required Quantity / Size
                        </label>
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Inquiry Details *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 leading-relaxed focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={closeEmailModal}
                        className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-display text-xs font-bold uppercase cursor-pointer hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submitting ? "Sending..." : "Send Email Inquiry"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </InquiryModalContext.Provider>
    </SessionProvider>
  );
}
