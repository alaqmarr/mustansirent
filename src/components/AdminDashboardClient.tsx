"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { DropzoneUploader } from "./DropzoneUploader";
import type { LocationItem, StatItem } from "@/lib/settings";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AdminDashboardClientProps {
  initialProducts: any[];
  initialCategories: any[];
  initialBrands: any[];
  initialResources: any[];
  initialInquiries: any[];
  initialSettings: any;
  adminUser: {
    name?: string | null;
    email?: string | null;
  };
}

type TabKey =
  | "products"
  | "categories"
  | "brands"
  | "resources"
  | "inquiries"
  | "settings";

export function AdminDashboardClient({
  initialProducts,
  initialCategories,
  initialBrands,
  initialResources,
  initialInquiries,
  initialSettings,
  adminUser,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [products, setProducts] = useState<any[]>(initialProducts);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [brands, setBrands] = useState<any[]>(initialBrands);
  const [resources, setResources] = useState<any[]>(initialResources);
  const [inquiries, setInquiries] = useState<any[]>(initialInquiries);
  const [settings, setSettings] = useState<any>(initialSettings);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  // ==================== PRODUCT FORM STATE ====================
  const emptyProduct = {
    id: "",
    name: "",
    slug: "",
    sku: `ME-SKU-${Math.floor(100 + Math.random() * 900)}`,
    shortDescription: "",
    description: "",
    image: "/images/catalog/prod-nrv.svg",
    sizeRange: "25mm to 300mm (1\" to 12\")",
    pressureRating: "PN10 / PN16 / ANSI Class 150",
    bodyMaterial: "Cast Iron / Cast Steel / SS 304 / SS 316",
    endConnection: "Flanged / Wafer / Screwed",
    priceLabel: "Ex-Stock Secunderabad • Request Quote",
    inStock: true,
    featured: true,
    datasheetUrl: "/docs/mustansir-master-catalog-2026.html",
    categoryId: initialCategories[0]?.id || "",
    brandId: initialBrands[0]?.id || "",
    specsText: "Design Standard: IS / BS / API\nTesting: 100% Hydrostatic Tested",
    featuresText: "Heavy-duty industrial construction\nBubble-tight zero leakage shut-off",
    applicationsText: "Municipal Water Works\nIndustrial Process Lines",
  };

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const startEditProduct = (prod?: any) => {
    if (!prod) {
      setEditingProduct({ ...emptyProduct });
      return;
    }
    let specs: { key: string; value: string }[] = [];
    let feats: string[] = [];
    let apps: string[] = [];
    try {
      specs = JSON.parse(prod.specificationsJson || "[]");
    } catch {}
    try {
      feats = JSON.parse(prod.featuresJson || "[]");
    } catch {}
    try {
      apps = JSON.parse(prod.applicationsJson || "[]");
    } catch {}

    setEditingProduct({
      ...prod,
      specsText: specs.map((s) => `${s.key}: ${s.value}`).join("\n"),
      featuresText: feats.join("\n"),
      applicationsText: apps.join("\n"),
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);

    const parsedSpecs = String(editingProduct.specsText || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(":");
        if (idx === -1) return { key: "Specification", value: line };
        return {
          key: line.slice(0, idx).trim(),
          value: line.slice(idx + 1).trim(),
        };
      });

    const parsedFeatures = String(editingProduct.featuresText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedApps = String(editingProduct.applicationsText || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const payload = {
      ...editingProduct,
      specificationsJson: parsedSpecs,
      featuresJson: parsedFeatures,
      applicationsJson: parsedApps,
    };

    try {
      const isEdit = Boolean(editingProduct.id);
      const res = await fetch(
        isEdit ? `/api/products/${editingProduct.id}` : "/api/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to save product");
      } else {
        if (isEdit) {
          setProducts((prev) =>
            prev.map((p) => (p.id === data.product.id ? data.product : p))
          );
          showToast("success", `Updated product "${data.product.name}"`);
        } else {
          setProducts((prev) => [data.product, ...prev]);
          showToast("success", `Created product "${data.product.name}"`);
        }
        setEditingProduct(null);
      }
    } catch {
      showToast("error", "Network error saving product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete product "${name}"?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("success", `Deleted "${name}"`);
    } else {
      showToast("error", "Failed to delete product");
    }
  };

  // ==================== CATEGORY FORM STATE ====================
  const emptyCategory = {
    id: "",
    name: "",
    slug: "",
    code: "DIV-04",
    shortDescription: "",
    description: "",
    image: "/images/catalog/cat-valves.svg",
    specsSummary: "IS / BS / DIN / API Standards",
    applicationsText: "Municipal Water Supply\nIndustrial Process Lines",
    featured: true,
    sortOrder: categories.length + 1,
  };
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const startEditCategory = (cat?: any) => {
    if (!cat) {
      setEditingCategory({ ...emptyCategory });
      return;
    }
    let apps: string[] = [];
    try {
      apps = JSON.parse(cat.applicationsJson || "[]");
    } catch {}
    setEditingCategory({
      ...cat,
      applicationsText: apps.join("\n"),
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const apps = String(editingCategory.applicationsText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const isEdit = Boolean(editingCategory.id);
    const res = await fetch(
      isEdit ? `/api/categories/${editingCategory.id}` : "/api/categories",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingCategory,
          applicationsJson: apps,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast("error", data.error || "Failed to save category");
    } else {
      if (isEdit) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.category.id ? { ...c, ...data.category } : c))
        );
        showToast("success", `Updated category "${data.category.name}"`);
      } else {
        setCategories((prev) => [...prev, data.category]);
        showToast("success", `Created category "${data.category.name}"`);
      }
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("success", `Deleted category "${name}"`);
    }
  };

  // ==================== BRAND FORM STATE ====================
  const emptyBrand = {
    id: "",
    name: "",
    slug: "",
    logo: "/images/catalog/prod-butterfly.svg",
    country: "India",
    specialization: "Industrial Valves & Flow Control",
    description: "",
    authorizedStatus: "Authorized Stockist & Distributor",
    websiteUrl: "",
    featured: true,
    sortOrder: brands.length + 1,
  };
  const [editingBrand, setEditingBrand] = useState<any | null>(null);

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand) return;
    const isEdit = Boolean(editingBrand.id);
    const res = await fetch(isEdit ? `/api/brands/${editingBrand.id}` : "/api/brands", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBrand),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast("error", data.error || "Failed to save brand");
    } else {
      if (isEdit) {
        setBrands((prev) =>
          prev.map((b) => (b.id === data.brand.id ? { ...b, ...data.brand } : b))
        );
        showToast("success", `Updated brand "${data.brand.name}"`);
      } else {
        setBrands((prev) => [...prev, data.brand]);
        showToast("success", `Created brand "${data.brand.name}"`);
      }
      setEditingBrand(null);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Delete partner brand "${name}"?`)) return;
    const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      showToast("success", `Deleted brand "${name}"`);
    }
  };

  // ==================== RESOURCE FORM STATE ====================
  const emptyResource = {
    id: "",
    title: "",
    slug: "",
    type: "Technical Datasheet",
    description: "",
    fileUrl: "/docs/mustansir-master-catalog-2026.html",
    fileSize: "2.4 MB PDF",
    standardCode: "IS / ISO / BS Standard",
    featured: true,
    categoryId: "",
    brandId: "",
  };
  const [editingResource, setEditingResource] = useState<any | null>(null);

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    const isEdit = Boolean(editingResource.id);
    const res = await fetch(
      isEdit ? `/api/resources/${editingResource.id}` : "/api/resources",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingResource),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      showToast("error", data.error || "Failed to save resource");
    } else {
      if (isEdit) {
        setResources((prev) =>
          prev.map((r) => (r.id === data.resource.id ? data.resource : r))
        );
        showToast("success", `Updated resource "${data.resource.title}"`);
      } else {
        setResources((prev) => [data.resource, ...prev]);
        showToast("success", `Created resource "${data.resource.title}"`);
      }
      setEditingResource(null);
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!confirm(`Delete resource "${title}"?`)) return;
    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
    if (res.ok) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      showToast("success", `Deleted resource "${title}"`);
    }
  };

  // ==================== INQUIRIES HANDLERS ====================
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      showToast("success", `Inquiry status updated to ${status}`);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry record?")) return;
    const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      showToast("success", "Inquiry deleted");
    }
  };

  // ==================== SITE-WIDE SETTINGS HANDLER ====================
  const [savingSettings, setSavingSettings] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "Failed to save site settings");
      } else {
        showToast(
          "success",
          "Site-wide settings (Contact, Admin Email, WhatsApp, Maps, SMTP & R2) updated!"
        );
      }
    } catch {
      showToast("error", "Network error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const addLocation = () => {
    const newLoc: LocationItem = {
      id: `loc-${Date.now()}`,
      name: "New Branch / Warehouse Facility",
      badge: "BRANCH / STOCKYARD",
      address: "Secunderabad, Telangana",
      phone: settings.phonePrimary,
      email: settings.adminEmail,
      hours: settings.workingHours,
      mapEmbedUrl: settings.mapEmbedUrl,
      mapLinkUrl: settings.mapLinkUrl,
    };
    setSettings({
      ...settings,
      locations: [...(settings.locations || []), newLoc],
    });
  };

  const updateLocation = (index: number, field: keyof LocationItem, value: string) => {
    const updated = [...(settings.locations || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, locations: updated });
  };

  const removeLocation = (index: number) => {
    const updated = (settings.locations || []).filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, locations: updated });
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const updated = [...(settings.stats || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSettings({ ...settings, stats: updated });
  };

  return (
    <div className="w-full min-h-screen honeycomb-drafting pb-20">
      {/* Full-Width Standardized Light Admin Header */}
      <div className="w-full bg-white honeycomb-drafting text-slate-900 border-b border-slate-200">
        <div className="w-full px-6 lg:px-14 py-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo.png"
              alt={settings.companyName}
              className="w-14 h-14 object-contain shrink-0"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                Admin Dashboard • {settings.companyName}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-0.5">
                Manage Products, Brands, Categories &amp; Site Settings
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block text-xs">
              <div className="text-slate-900 font-bold">{adminUser.name}</div>
              <div className="text-amber-600 font-medium">{adminUser.email}</div>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Full-Width Light Tab Bar */}
        <div className="w-full px-6 lg:px-14 flex overflow-x-auto divide-x divide-slate-200 bg-slate-50">
          {[
            { key: "products", label: `Products (${products.length})` },
            { key: "categories", label: `Categories (${categories.length})` },
            { key: "brands", label: `Brands (${brands.length})` },
            { key: "resources", label: `Catalogs (${resources.length})` },
            { key: "inquiries", label: `Inquiries (${inquiries.length})` },
            {
              key: "settings",
              label: "Site Settings (Email, WhatsApp, Maps, SMTP, R2)",
            },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`px-6 py-4 text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          <div
            className={`flex items-center gap-3 px-5 py-4 border-2 border-[#111315] font-mono text-xs font-bold shadow-2xl ${
              toast.type === "success"
                ? "bg-[#111315] text-[#C87D20]"
                : "bg-red-950 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Full-Width Workspace */}
      <div className="w-full px-6 lg:px-14 pt-10">
        {/* ==================== TAB 1: PRODUCTS CRUD ==================== */}
        {activeTab === "products" && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#111315] pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#111315]">
                  Products Catalog Management
                </h2>
                <p className="font-mono text-xs text-[#4A5056]">
                  Full CRUD for products. Every item automatically receives prefilled Email (SMTP) &
                  WhatsApp inquiry buttons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEditProduct()}
                className="px-6 py-3 bg-[#111315] hover:bg-[#C87D20] text-white hover:text-[#111315] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {editingProduct && (
              <form
                onSubmit={handleSaveProduct}
                className="bg-white border-2 border-[#111315] p-8 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#111315] pb-3">
                  <h3 className="font-display text-lg font-bold text-[#111315]">
                    {editingProduct.id
                      ? `EDIT PRODUCT // ${editingProduct.name}`
                      : "CREATE NEW INDUSTRIAL PRODUCT"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="font-mono text-xs text-[#71787F] hover:text-[#111315]"
                  >
                    [CLOSE]
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      CATALOG SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sku: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      SUPPLY DIVISION *
                    </label>
                    <select
                      value={editingProduct.categoryId}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      PARTNER BRAND *
                    </label>
                    <select
                      value={editingProduct.brandId}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brandId: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm bg-white"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      PRICE / STOCK LABEL
                    </label>
                    <input
                      type="text"
                      value={editingProduct.priceLabel}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, priceLabel: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      SIZE / BORE RANGE
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sizeRange}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sizeRange: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      PRESSURE RATING
                    </label>
                    <input
                      type="text"
                      value={editingProduct.pressureRating}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          pressureRating: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      BODY MATERIAL
                    </label>
                    <input
                      type="text"
                      value={editingProduct.bodyMaterial}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, bodyMaterial: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      END CONNECTION
                    </label>
                    <input
                      type="text"
                      value={editingProduct.endConnection}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          endConnection: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <DropzoneUploader
                  label="Product Image (Drag & Drop via React Dropzone -> Cloudflare R2)"
                  value={editingProduct.image}
                  onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
                  folder="products"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      SHORT SUMMARY *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingProduct.shortDescription}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      FULL ENGINEERING DESCRIPTION *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      SPECS (Key: Value per line)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProduct.specsText}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, specsText: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      FEATURES (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProduct.featuresText}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, featuresText: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                      APPLICATIONS (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={editingProduct.applicationsText}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          applicationsText: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D6D3CD]">
                  <div className="flex items-center gap-6 font-mono text-xs font-bold text-[#111315]">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.inStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                        }
                      />
                      <span>EX-STOCK AVAILABLE</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.featured}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, featured: e.target.checked })
                        }
                      />
                      <span>FEATURED ON INDEX</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-5 py-2.5 border border-[#111315] font-mono text-xs font-bold uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProduct}
                      className="px-6 py-2.5 bg-[#111315] hover:bg-[#C87D20] text-white hover:text-[#111315] font-mono text-xs font-bold uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingProduct ? "SAVING..." : "SAVE PRODUCT"}</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-white border border-[#111315] overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111315] text-white font-mono text-[11px] uppercase">
                    <th className="py-4 px-5">Product</th>
                    <th className="py-4 px-5">SKU</th>
                    <th className="py-4 px-5">Brand</th>
                    <th className="py-4 px-5">Division</th>
                    <th className="py-4 px-5">Parameters</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6D3CD]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#F6F5F2]">
                      <td className="py-3.5 px-5 font-display font-bold text-[#111315] flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-9 object-cover border border-[#D6D3CD] shrink-0"
                        />
                        <span>{prod.name}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[#C87D20] font-bold">
                        {prod.sku}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-[#111315]">
                        {prod.brand?.name || "—"}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[#4A5056]">
                        {prod.category?.name || "—"}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-[#4A5056]">
                        {prod.sizeRange}
                      </td>
                      <td className="py-3.5 px-5 text-right space-x-2 whitespace-nowrap font-mono">
                        <button
                          type="button"
                          onClick={() => startEditProduct(prod)}
                          className="px-3 py-1.5 border border-[#111315] hover:bg-[#111315] hover:text-white font-bold uppercase cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 inline mr-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="px-3 py-1.5 border border-red-800 text-red-800 hover:bg-red-800 hover:text-white font-bold uppercase cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Del
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: CATEGORIES CRUD ==================== */}
        {activeTab === "categories" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#111315] pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#111315]">
                  Supply Divisions Management
                </h2>
                <p className="font-mono text-xs text-[#4A5056]">
                  Manage Industrial Valves, Water Meters & Systems, and Steam Traps & Controls.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEditCategory()}
                className="px-6 py-3 bg-[#111315] hover:bg-[#C87D20] text-white hover:text-[#111315] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Division</span>
              </button>
            </div>

            {editingCategory && (
              <form
                onSubmit={handleSaveCategory}
                className="bg-white border-2 border-[#111315] p-8 space-y-4"
              >
                <h3 className="font-display text-lg font-bold text-[#111315]">
                  {editingCategory.id ? `EDIT DIVISION: ${editingCategory.name}` : "NEW DIVISION"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      DIVISION NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      CODE
                    </label>
                    <input
                      type="text"
                      value={editingCategory.code}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, code: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      STANDARDS SUMMARY
                    </label>
                    <input
                      type="text"
                      value={editingCategory.specsSummary}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          specsSummary: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                    />
                  </div>
                </div>

                <DropzoneUploader
                  label="Division Schematic / Banner (React Dropzone + Cloudflare R2)"
                  value={editingCategory.image}
                  onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                  folder="categories"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      SHORT DESCRIPTION *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingCategory.shortDescription}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      FULL DESCRIPTION *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingCategory.description}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    APPLICATIONS (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editingCategory.applicationsText}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        applicationsText: e.target.value,
                      })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 border border-[#111315] font-mono text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#111315] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Save Division
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-[#111315] p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="font-mono text-xs text-[#C87D20] font-bold">
                      {cat.code}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#111315] mt-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#4A5056] mt-2">{cat.shortDescription}</p>
                  </div>
                  <div className="pt-4 border-t border-[#D6D3CD] flex justify-end gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => startEditCategory(cat)}
                      className="px-3 py-1.5 border border-[#111315] font-bold uppercase cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="px-3 py-1.5 border border-red-800 text-red-800 font-bold uppercase cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: BRANDS CRUD ==================== */}
        {activeTab === "brands" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#111315] pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#111315]">
                  Authorized Partner Brands Management
                </h2>
                <p className="font-mono text-xs text-[#4A5056]">
                  Manage Racer, Normex, Pennant, Kartar, Audco, Amco, RB, CIM, Actaris, Dashmesh,
                  Itron, and Spirax.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBrand({ ...emptyBrand })}
                className="px-6 py-3 bg-[#111315] hover:bg-[#C87D20] text-white hover:text-[#111315] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Partner Brand</span>
              </button>
            </div>

            {editingBrand && (
              <form
                onSubmit={handleSaveBrand}
                className="bg-white border-2 border-[#111315] p-8 space-y-4"
              >
                <h3 className="font-display text-lg font-bold text-[#111315]">
                  {editingBrand.id ? `EDIT BRAND: ${editingBrand.name}` : "ADD PARTNER BRAND"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      BRAND NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBrand.name}
                      onChange={(e) =>
                        setEditingBrand({ ...editingBrand, name: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      COUNTRY
                    </label>
                    <input
                      type="text"
                      value={editingBrand.country}
                      onChange={(e) =>
                        setEditingBrand({ ...editingBrand, country: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      DEALERSHIP STATUS
                    </label>
                    <input
                      type="text"
                      value={editingBrand.authorizedStatus}
                      onChange={(e) =>
                        setEditingBrand({
                          ...editingBrand,
                          authorizedStatus: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    SPECIALIZATION *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBrand.specialization}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, specialization: e.target.value })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>

                <DropzoneUploader
                  label="Brand Emblem / Graphic (React Dropzone + Cloudflare R2)"
                  value={editingBrand.logo}
                  onChange={(url) => setEditingBrand({ ...editingBrand, logo: url })}
                  folder="brands"
                />

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    DESCRIPTION *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingBrand.description}
                    onChange={(e) =>
                      setEditingBrand({ ...editingBrand, description: e.target.value })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBrand(null)}
                    className="px-4 py-2 border border-[#111315] font-mono text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#111315] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Save Brand
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {brands.map((b) => (
                <div
                  key={b.id}
                  className="bg-white border border-[#111315] p-5 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-[#111315]">
                        {b.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#C87D20] font-bold">
                        {b.country}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A5056] mt-1 line-clamp-2">
                      {b.specialization}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#D6D3CD] flex justify-end gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingBrand(b)}
                      className="px-3 py-1 border border-[#111315] font-bold uppercase cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBrand(b.id, b.name)}
                      className="px-3 py-1 border border-red-800 text-red-800 font-bold uppercase cursor-pointer"
                    >
                      Del
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: RESOURCES CRUD ==================== */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#111315] pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#111315]">
                  Engineering Dossiers & Catalogs
                </h2>
                <p className="font-mono text-xs text-[#4A5056]">
                  Upload or edit downloadable technical documents for `/resources`.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingResource({ ...emptyResource })}
                className="px-6 py-3 bg-[#111315] hover:bg-[#C87D20] text-white hover:text-[#111315] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Resource</span>
              </button>
            </div>

            {editingResource && (
              <form
                onSubmit={handleSaveResource}
                className="bg-white border-2 border-[#111315] p-8 space-y-4"
              >
                <h3 className="font-display text-lg font-bold text-[#111315]">
                  {editingResource.id ? "EDIT RESOURCE" : "NEW TECHNICAL RESOURCE"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      DOCUMENT TITLE *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingResource.title}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, title: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      DOCUMENT TYPE
                    </label>
                    <input
                      type="text"
                      value={editingResource.type}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, type: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                    />
                  </div>
                </div>

                <DropzoneUploader
                  label="Upload Document File (React Dropzone + Cloudflare R2)"
                  value={editingResource.fileUrl}
                  onChange={(url) => setEditingResource({ ...editingResource, fileUrl: url })}
                  folder="resources"
                  acceptImagesOnly={false}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      STANDARD CODE
                    </label>
                    <input
                      type="text"
                      value={editingResource.standardCode}
                      onChange={(e) =>
                        setEditingResource({
                          ...editingResource,
                          standardCode: e.target.value,
                        })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      FILE SIZE LABEL
                    </label>
                    <input
                      type="text"
                      value={editingResource.fileSize}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, fileSize: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={2}
                    value={editingResource.description}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, description: e.target.value })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingResource(null)}
                    className="px-4 py-2 border border-[#111315] font-mono text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#111315] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Save Resource
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-white border border-[#111315] p-6 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <span className="font-mono text-[11px] text-[#C87D20] font-bold">
                      {res.type} // {res.standardCode}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#111315] mt-1">
                      {res.title}
                    </h3>
                    <p className="text-xs text-[#4A5056] mt-1">{res.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#D6D3CD] flex items-center justify-between font-mono text-xs">
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#111315] underline"
                    >
                      {res.fileUrl}
                    </a>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingResource(res)}
                        className="px-3 py-1 border border-[#111315] font-bold uppercase cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="px-3 py-1 border border-red-800 text-red-800 font-bold uppercase cursor-pointer"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: INQUIRIES DESK ==================== */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            <div className="border-b border-[#111315] pb-4">
              <h2 className="font-display text-2xl font-bold text-[#111315]">
                Customer Email & Product RFQs Log
              </h2>
              <p className="font-mono text-xs text-[#4A5056]">
                All inquiries submitted via prefilled Product Email buttons and Contact Page.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white border border-[#111315] p-12 text-center font-mono text-xs text-[#71787F]">
                NO INQUIRIES LOGGED YET.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white border border-[#111315] p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D6D3CD] pb-3">
                      <div>
                        <span className="px-2.5 py-1 bg-[#111315] text-[#C87D20] font-mono text-[11px] font-bold mr-3">
                          {inq.status}
                        </span>
                        <span className="font-display text-base font-bold text-[#111315]">
                          {inq.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="border border-[#111315] px-3 py-1.5 font-bold bg-white"
                        >
                          <option value="NEW">NEW</option>
                          <option value="READ">READ</option>
                          <option value="REPLIED">REPLIED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 border border-red-800 text-red-800 hover:bg-red-800 hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs bg-[#F6F5F2] p-4 border border-[#D6D3CD]">
                      <div>
                        <strong>NAME:</strong> {inq.name} ({inq.company || "N/A"})
                      </div>
                      <div>
                        <strong>EMAIL:</strong> {inq.email}
                      </div>
                      <div>
                        <strong>PHONE:</strong> {inq.phone}
                      </div>
                      <div>
                        <strong>SCOPE:</strong> {inq.quantity}
                      </div>
                    </div>

                    <pre className="font-mono text-xs text-[#111315] whitespace-pre-wrap bg-[#F6F5F2] p-4 border border-[#D6D3CD]">
                      {inq.message}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 6: SITE-WIDE SETTINGS ==================== */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8">
            <div className="bg-[#111315] text-white p-6 flex flex-wrap items-center justify-between gap-4 border-l-8 border-[#C87D20]">
              <div>
                <h2 className="font-display text-xl font-bold">
                  Site-Wide Master Configuration
                </h2>
                <p className="font-mono text-xs text-[#A0A6AD]">
                  Control site-wide Contact Details, Admin Email, WhatsApp Number, Maps &
                  Locations, Gmail SMTP, and Cloudflare R2.
                </p>
              </div>
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-3.5 bg-[#C87D20] hover:bg-white text-[#111315] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>
                  {savingSettings ? "SAVING ALL SETTINGS..." : "SAVE ALL SITE-WIDE SETTINGS"}
                </span>
              </button>
            </div>

            {/* 1. Contact, Admin Email & WhatsApp */}
            <div className="bg-white border border-[#111315] p-8 space-y-5">
              <h3 className="font-display text-lg font-bold text-[#111315] border-b border-[#111315] pb-3">
                01 // Site-Wide Admin Email, WhatsApp Number & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#C87D20] font-bold mb-1">
                    SITE-WIDE ADMIN EMAIL (SMTP RECEIVER) *
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.adminEmail || ""}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                    className="w-full border-2 border-[#111315] bg-[#F6F5F2] px-3 py-2.5 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#C87D20] font-bold mb-1">
                    SITE-WIDE WHATSAPP NUMBER (WITH COUNTRY CODE) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsappNumber: e.target.value })
                    }
                    className="w-full border-2 border-[#111315] bg-[#F6F5F2] px-3 py-2.5 text-sm font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-[#4A5056] mb-1">
                    PUBLIC DISPLAY EMAIL
                  </label>
                  <input
                    type="email"
                    value={settings.publicEmail || ""}
                    onChange={(e) => setSettings({ ...settings, publicEmail: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    PRIMARY TELEPHONE
                  </label>
                  <input
                    type="text"
                    value={settings.phonePrimary || ""}
                    onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    SECONDARY MOBILE
                  </label>
                  <input
                    type="text"
                    value={settings.phoneSecondary || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, phoneSecondary: e.target.value })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    WORKING HOURS
                  </label>
                  <input
                    type="text"
                    value={settings.workingHours || ""}
                    onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    ADDRESS LINE 1
                  </label>
                  <input
                    type="text"
                    value={settings.addressLine1 || ""}
                    onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    ADDRESS LINE 2
                  </label>
                  <input
                    type="text"
                    value={settings.addressLine2 || ""}
                    onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    CITY
                  </label>
                  <input
                    type="text"
                    value={settings.city || ""}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    STATE
                  </label>
                  <input
                    type="text"
                    value={settings.state || ""}
                    onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    PIN CODE
                  </label>
                  <input
                    type="text"
                    value={settings.pincode || ""}
                    onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    value={settings.country || ""}
                    onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Company Identity & Hero Content */}
            <div className="bg-white border border-[#111315] p-8 space-y-5">
              <h3 className="font-display text-lg font-bold text-[#111315] border-b border-[#111315] pb-3">
                02 // Company Identity, Director & Homepage Content
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    COMPANY NAME
                  </label>
                  <input
                    type="text"
                    value={settings.companyName || ""}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    DIRECTOR NAME
                  </label>
                  <input
                    type="text"
                    value={settings.directorName || ""}
                    onChange={(e) => setSettings({ ...settings, directorName: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    ESTABLISHED YEAR
                  </label>
                  <input
                    type="text"
                    value={settings.establishedYear || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, establishedYear: e.target.value })
                    }
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={settings.gstNumber || ""}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    HERO BADGE
                  </label>
                  <input
                    type="text"
                    value={settings.heroBadge || ""}
                    onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    HERO HEADLINE
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                  HERO SUBTITLE
                </label>
                <textarea
                  rows={2}
                  value={settings.heroSubtitle || ""}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full border border-[#111315] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {(settings.stats || []).map((st: StatItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#F6F5F2] border border-[#111315] p-3 space-y-2"
                  >
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => updateStat(idx, "value", e.target.value)}
                      className="w-full border border-[#D6D3CD] bg-white px-2 py-1 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => updateStat(idx, "label", e.target.value)}
                      className="w-full border border-[#D6D3CD] bg-white px-2 py-1 text-xs"
                    />
                    <input
                      type="text"
                      value={st.subtext}
                      onChange={(e) => updateStat(idx, "subtext", e.target.value)}
                      className="w-full border border-[#D6D3CD] bg-white px-2 py-1 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Maps & Multi-Locations */}
            <div className="bg-white border border-[#111315] p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-[#111315] pb-3">
                <h3 className="font-display text-lg font-bold text-[#111315]">
                  03 // Maps & Multi-Facility Locations Manager
                </h3>
                <button
                  type="button"
                  onClick={addLocation}
                  className="px-4 py-2 bg-[#111315] text-white font-mono text-xs font-bold uppercase cursor-pointer"
                >
                  + Add Location
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    PRIMARY GOOGLE MAPS EMBED URL
                  </label>
                  <input
                    type="text"
                    value={settings.mapEmbedUrl || ""}
                    onChange={(e) => setSettings({ ...settings, mapEmbedUrl: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    PRIMARY GOOGLE MAPS LINK
                  </label>
                  <input
                    type="text"
                    value={settings.mapLinkUrl || ""}
                    onChange={(e) => setSettings({ ...settings, mapLinkUrl: e.target.value })}
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {(settings.locations || []).map((loc: LocationItem, idx: number) => (
                  <div
                    key={loc.id || idx}
                    className="bg-[#F6F5F2] border border-[#111315] p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold">
                        FACILITY 0{idx + 1} // {loc.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeLocation(idx)}
                        className="text-red-800 font-bold uppercase cursor-pointer"
                      >
                        [Remove]
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => updateLocation(idx, "name", e.target.value)}
                        className="border border-[#111315] bg-white px-3 py-1.5 text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={loc.badge}
                        onChange={(e) => updateLocation(idx, "badge", e.target.value)}
                        className="border border-[#111315] bg-white px-3 py-1.5 text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={loc.phone}
                        onChange={(e) => updateLocation(idx, "phone", e.target.value)}
                        className="border border-[#111315] bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => updateLocation(idx, "address", e.target.value)}
                      className="w-full border border-[#111315] bg-white px-3 py-1.5 text-xs"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={loc.mapEmbedUrl}
                        onChange={(e) => updateLocation(idx, "mapEmbedUrl", e.target.value)}
                        className="border border-[#111315] bg-white px-3 py-1.5 text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={loc.mapLinkUrl}
                        onChange={(e) => updateLocation(idx, "mapLinkUrl", e.target.value)}
                        className="border border-[#111315] bg-white px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. SMTP & Cloudflare R2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#111315] p-8 space-y-4">
                <h3 className="font-display text-lg font-bold text-[#111315] border-b border-[#111315] pb-3">
                  04 // Nodemailer + Gmail SMTP Settings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      SMTP HOST
                    </label>
                    <input
                      type="text"
                      value={settings.smtpHost || "smtp.gmail.com"}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      SMTP PORT
                    </label>
                    <input
                      type="number"
                      value={settings.smtpPort || 465}
                      onChange={(e) =>
                        setSettings({ ...settings, smtpPort: Number(e.target.value) })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    GMAIL SMTP USER
                  </label>
                  <input
                    type="email"
                    value={settings.smtpUser || ""}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    placeholder="yourgmail@gmail.com"
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    GMAIL APP PASSWORD
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPass || ""}
                    onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                    placeholder="16-character App Password"
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="bg-white border border-[#111315] p-8 space-y-4">
                <h3 className="font-display text-lg font-bold text-[#111315] border-b border-[#111315] pb-3">
                  05 // Cloudflare R2 Storage Settings
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      R2 ACCOUNT ID
                    </label>
                    <input
                      type="text"
                      value={settings.r2AccountId || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, r2AccountId: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      R2 BUCKET NAME
                    </label>
                    <input
                      type="text"
                      value={settings.r2BucketName || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, r2BucketName: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      R2 ACCESS KEY ID
                    </label>
                    <input
                      type="text"
                      value={settings.r2AccessKeyId || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, r2AccessKeyId: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                      R2 SECRET ACCESS KEY
                    </label>
                    <input
                      type="password"
                      value={settings.r2SecretAccessKey || ""}
                      onChange={(e) =>
                        setSettings({ ...settings, r2SecretAccessKey: e.target.value })
                      }
                      className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-[#4A5056] mb-1">
                    R2 PUBLIC BUCKET URL
                  </label>
                  <input
                    type="text"
                    value={settings.r2PublicUrl || ""}
                    onChange={(e) => setSettings({ ...settings, r2PublicUrl: e.target.value })}
                    placeholder="https://pub-xxx.r2.dev"
                    className="w-full border border-[#111315] px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
