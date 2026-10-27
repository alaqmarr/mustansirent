import { prisma } from "./prisma";

export interface LocationItem {
  id: string;
  name: string;
  badge: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
  mapLinkUrl: string;
}

export interface StatItem {
  label: string;
  value: string;
  subtext: string;
}

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "default" },
    });
  }

  let locations: LocationItem[] = [];
  try {
    locations = JSON.parse(settings.locationsJson || "[]");
  } catch {
    locations = [];
  }

  if (locations.length === 0) {
    locations = [
      {
        id: "loc-hq",
        name: "Registered Office & Main Showroom — Ranigunj",
        badge: "HEADQUARTERS",
        address: `${settings.addressLine1}, ${settings.city}, ${settings.state} - ${settings.pincode}`,
        phone: settings.phonePrimary,
        email: settings.publicEmail,
        hours: settings.workingHours,
        mapEmbedUrl: settings.mapEmbedUrl,
        mapLinkUrl: settings.mapLinkUrl,
      },
    ];
  }

  let stats: StatItem[] = [];
  try {
    stats = JSON.parse(settings.statsJson || "[]");
  } catch {
    stats = [];
  }

  if (stats.length === 0) {
    stats = [
      { label: "Years of Industrial Legacy", value: "38+", subtext: "Established 1987 in Secunderabad" },
      { label: "Authorized Partner Brands", value: "12+", subtext: "Audco, Spirax, Itron, Pennant & More" },
      { label: "Ready Stock SKUs", value: "2,400+", subtext: "Valves, Water Meters & Steam Traps" },
      { label: "Client Dispatch Reliability", value: "99.4%", subtext: "Pan-India Industrial & Municipal Supply" },
    ];
  }

  return {
    ...settings,
    locations,
    stats,
  };
}

export function cleanWhatsappNumber(raw: string): string {
  const digits = (raw || "").replace(/[^0-9]/g, "");
  if (!digits) return "919849012345";
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export function buildWhatsappUrl(whatsappNumber: string, message: string): string {
  const clean = cleanWhatsappNumber(whatsappNumber);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function buildProductPrefillData(product: {
  name: string;
  sku: string;
  sizeRange?: string;
  pressureRating?: string;
  bodyMaterial?: string;
  brand?: { name: string } | null;
  category?: { name: string } | null;
}) {
  const brandName = product.brand?.name || "Authorized Brand";
  const categoryName = product.category?.name || "Industrial Equipment";

  const whatsappText = [
    `Hello *Mustansir Enterprises*,`,
    ``,
    `I would like to enquire about the following industrial product:`,
    `• *Product:* ${product.name}`,
    `• *SKU / Code:* ${product.sku}`,
    `• *Brand:* ${brandName}`,
    `• *Category:* ${categoryName}`,
    product.sizeRange ? `• *Size Range:* ${product.sizeRange}` : null,
    product.pressureRating ? `• *Pressure Rating:* ${product.pressureRating}` : null,
    ``,
    `Please share technical availability, wholesale pricing, and delivery lead time.`,
  ]
    .filter(Boolean)
    .join("\n");

  const emailSubject = `Product Inquiry: ${product.name} [${product.sku}] — ${brandName}`;
  const emailMessage = [
    `Dear Mustansir Enterprises Sales Team,`,
    ``,
    `We are interested in procuring the following equipment from your inventory:`,
    ``,
    `- Product Name: ${product.name}`,
    `- Catalog SKU: ${product.sku}`,
    `- Partner Brand: ${brandName}`,
    `- Product Category: ${categoryName}`,
    product.sizeRange ? `- Size / Bore Specification: ${product.sizeRange}` : null,
    product.pressureRating ? `- Pressure Rating: ${product.pressureRating}` : null,
    product.bodyMaterial ? `- Material of Construction: ${product.bodyMaterial}` : null,
    ``,
    `Please share your best wholesale quotation, technical datasheet, and current ex-stock availability in Secunderabad.`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    whatsappText,
    emailSubject,
    emailMessage,
    brandName,
    categoryName,
  };
}
