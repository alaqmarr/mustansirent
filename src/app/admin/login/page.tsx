"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mustansirenterprises.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupUnlocked, setSetupUnlocked] = useState(false);

  useEffect(() => {
    fetch("/api/setup", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.isLocked) setSetupUnlocked(true);
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[84vh] bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-amber-50/50 honeycomb-drafting text-slate-900 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <img
              src="/images/logo.png"
              alt="Mustansir Enterprises"
              className="w-16 h-16 object-contain"
            />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block">
              Mustansir Enterprises
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Admin Dashboard Login
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sign in to manage products, categories, partner brands, catalogs,
              customer inquiries, and site-wide contact settings.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-200 text-xs text-slate-500">
            Secunderabad, Telangana
          </div>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 flex items-center">
          <div className="w-full space-y-6">
            {setupUnlocked && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 space-y-1.5">
                <div className="text-xs font-bold text-amber-900 uppercase">
                  First-Time Setup Available
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  No administrator account has been created yet. Create your
                  first admin account on the setup page.
                </p>
                <Link
                  href="/setup"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline pt-1"
                >
                  <span>Go to First-Time Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-lg text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Sign In
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>{loading ? "Signing In..." : "Sign In to Admin"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
