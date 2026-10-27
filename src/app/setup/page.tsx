"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function SetupPage() {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  const [name, setName] = useState("Saifuddin H. Khasamwala");
  const [email, setEmail] = useState("admin@mustansirenterprises.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/setup", { cache: "no-store" });
        const data = await res.json();
        setIsLocked(Boolean(data.isLocked));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create administrator account.");
        if (data.isLocked) {
          setIsLocked(true);
        }
      } else {
        setJustCreated(true);
        setIsLocked(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[84vh] bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Standardized Light Left Column */}
        <div className="lg:col-span-5 bg-amber-50/50 honeycomb-drafting text-slate-900 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Mustansir Enterprises"
                className="w-14 h-14 object-contain"
              />
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block">
              Initial Setup
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {isLocked ? "Admin Setup Locked" : "Create First Admin Account"}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              This page creates the first administrator account for Mustansir
              Enterprises. For security, this setup page automatically locks as
              soon as the first administrator account is created.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-200 text-xs text-slate-500">
            Status:{" "}
            <span className="text-amber-700 font-bold">
              {loading
                ? "Checking..."
                : isLocked
                ? "Locked (Account Exists)"
                : "Ready for First Setup"}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex items-center">
          <div className="w-full">
            {loading ? (
              <div className="text-sm text-slate-500">
                Checking setup status...
              </div>
            ) : isLocked ? (
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  Setup Page Locked
                </div>

                {justCreated ? (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Administrator account <strong>{email}</strong> has been
                    created and this setup page is now permanently locked.
                  </p>
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    An administrator account already exists. Please sign in
                    through the Admin Login page to manage products, brands,
                    categories, and site settings.
                  </p>
                )}

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href="/admin/login"
                    className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition"
                  >
                    <span>Go to Admin Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-display text-xs font-bold uppercase tracking-wider"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-2">
                  Administrator Details
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer mt-2"
                >
                  <span>
                    {submitting
                      ? "Creating Account..."
                      : "Create Admin Account & Lock Setup"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
