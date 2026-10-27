"use client";

import React, { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface ContactFormClientProps {
  adminEmail: string;
  whatsappNumber: string;
  companyName: string;
}

export function ContactFormClient({
  adminEmail,
  whatsappNumber,
  companyName,
}: ContactFormClientProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState(
    "Enquiry for Industrial Valves / Water Meters"
  );
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          subject,
          message,
          source: "CONTACT_PAGE",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          success: false,
          error: data.error || "Failed to send message",
        });
      } else {
        setStatus({ success: true });
        setMessage("");
      }
    } catch (err: unknown) {
      setStatus({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWa = (whatsappNumber || "919848000000").replace(/[^\d]/g, "");
  const directWhatsappUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Hello ${companyName},\n\nName: ${name || "Customer"}\nCompany: ${
      company || "-"
    }\nRequirement: ${subject}\n\n${
      message || "Please share quotation and availability."
    }`
  )}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
          Send an Enquiry
        </span>
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Request a Quotation
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill out the form below to send an email directly to our sales team (
          <span className="font-medium text-slate-700">{adminEmail}</span>) or
          message us on WhatsApp.
        </p>
      </div>

      {status?.success ? (
        <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-slate-900">
            Thank You! Your Message Has Been Sent.
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            We have received your enquiry and will respond to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setStatus(null)}
            className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-display text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {status?.error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {status.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98480 XXXXX"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name (Optional)"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Requirement (Sizes, Brands, Quantities) *
            </label>
            <textarea
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please mention the required valve type, water meter size, preferred brand, and quantity..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Sending..." : "Send Email Inquiry"}</span>
            </button>

            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-emerald-900 hover:text-slate-950 border border-[#25D366]/40 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#128C7E] group-hover:text-slate-950" />
              <span>Send via WhatsApp</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
