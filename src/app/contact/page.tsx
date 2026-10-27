import { getSiteSettings } from "@/lib/settings";
import { ContactFormClient } from "@/components/ContactFormClient";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { Clock, Mail, MapPin, Phone, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const locations = settings.locations || [];
  const cleanWa = (settings.whatsappNumber || "919849012345").replace(
    /[^\d]/g,
    ""
  );
  const fullAddress = `${settings.addressLine1}, ${
    settings.addressLine2 ? `${settings.addressLine2}, ` : ""
  }${settings.city}, ${settings.state} - ${settings.pincode}`;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      {/* Standardized Light Header */}
      <section className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200 relative overflow-hidden">
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14 lg:py-18">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">
            {settings.companyName} • {settings.city}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Contact Us &amp; Request a Quote
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            Get in touch with our team for industrial valve, water meter, and
            steam trap inquiries, bulk pricing, or showroom visits.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 5 Columns: Direct Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3.5">
                <img
                  src="/images/logo.png"
                  alt={settings.companyName}
                  className="w-14 h-14 object-contain shrink-0"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-0.5">
                    Head Office &amp; Showroom
                  </span>
                  <h2 className="font-display text-2xl font-bold text-slate-900">
                    {settings.companyName}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Director
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {settings.directorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Address
                    </p>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {fullAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Phone Numbers
                    </p>
                    <a
                      href={`tel:${settings.phonePrimary}`}
                      className="text-sm font-bold text-slate-900 hover:text-amber-600 block"
                    >
                      {settings.phonePrimary}
                    </a>
                    {settings.phoneSecondary && (
                      <a
                        href={`tel:${settings.phoneSecondary}`}
                        className="text-sm text-slate-600 hover:text-amber-600 block mt-0.5"
                      >
                        {settings.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Email Address
                    </p>
                    <a
                      href={`mailto:${settings.adminEmail}`}
                      className="text-sm font-bold text-slate-900 hover:text-amber-600"
                    >
                      {settings.adminEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">
                      Business Hours
                    </p>
                    <p className="text-sm text-slate-700">
                      {settings.workingHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                    `Hello ${settings.companyName}, I would like to enquire about your products.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition shadow-2xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Additional Branch / Warehouse Locations */}
            {locations.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Our Locations
                </h3>
                <div className="space-y-4 divide-y divide-slate-100">
                  {locations.map((loc, idx) => (
                    <div key={loc.id || idx} className={idx > 0 ? "pt-4" : ""}>
                      <span className="text-xs font-bold text-amber-600 uppercase">
                        {loc.badge}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900 mt-0.5">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {loc.address}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Phone: {loc.phone} • {loc.hours}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 7 Columns: Contact & Quotation Form */}
          <div className="lg:col-span-7">
            <ContactFormClient
              adminEmail={settings.adminEmail}
              whatsappNumber={settings.whatsappNumber}
              companyName={settings.companyName}
            />
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      {settings.mapEmbedUrl && (
        <section className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 pb-16">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Location Map — {settings.city}
                </h3>
                <p className="text-xs text-slate-500">{fullAddress}</p>
              </div>
              {settings.mapLinkUrl && (
                <a
                  href={settings.mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  Open in Google Maps →
                </a>
              )}
            </div>
            <div className="w-full h-[400px] bg-slate-100">
              <iframe
                src={settings.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${settings.companyName} Map Location`}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
