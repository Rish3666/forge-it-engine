"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Rocket,
  CheckCircle2,
  ChevronRight,
  Terminal,
  Monitor,
  ShoppingCart,
  Cpu,
  Package,
  Layers,
  AlertCircle,
} from "lucide-react";
import { distroOptions, desktopEnvironments, softwarePackages } from "@/data/mockData";

// ─── Final Review Page ───────────────────────────────────────────────────────
// Route: /forge/review?distro=arch&desktop=gnome&packages=discord,firefox&gpu=...
// Reads the build config from query params, shows a premium summary,
// then submits to /api/forge and navigates to /forge/building.

function FinalReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const distroId = searchParams.get("distro") ?? "arch";
  const desktopId = searchParams.get("desktop") ?? "gnome";
  const packageIds = (searchParams.get("packages") ?? "discord,firefox").split(",").filter(Boolean);
  const gpu = searchParams.get("gpu") ?? "Generic GPU";
  const ram = searchParams.get("ram") ?? "16GB DDR4";
  const cpu = searchParams.get("cpu") ?? "Generic x86_64";

  const distro = distroOptions.find((d) => d.id === distroId) ?? distroOptions[0];
  const desktop = desktopEnvironments.find((d) => d.id === desktopId) ?? desktopEnvironments[0];
  const packages = packageIds
    .map((id) => softwarePackages.find((p) => p.id === id))
    .filter((p): p is (typeof softwarePackages)[number] => Boolean(p));

  const totalSizeMb = distro.sizeMb + desktop.sizeMb + packages.reduce((acc, p) => acc + p.sizeMb, 0);
  const sizeGb = (totalSizeMb / 1024).toFixed(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);

  const handleBuild = async () => {
    setIsSubmitting(true);
    setBuildError(null);

    const userId = `user_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          distro: distroId,
          apps: packageIds,
          gpu,
          desktop: desktopId,
        }),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Failed to start forge. Check n8n.");
      }

      const data = await res.json();
      const resolvedPackages =
        typeof data.packages === "string"
          ? data.packages
          : data.packages?.packages ?? packageIds.join(" ");
      const resolvedDistro =
        typeof data.packages?.distro === "string" ? data.packages.distro : distroId;

      const params = new URLSearchParams({
        userId: data.userId ?? userId,
        distro: resolvedDistro,
        packages: resolvedPackages,
      });
      router.push(`/forge/building?${params.toString()}`);
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : "Build failed");
      setIsSubmitting(false);
    }
  };

  const sections = [
    {
      id: "foundation",
      icon: Layers,
      title: "Base Foundation",
      color: "text-[#b026ff]",
      bg: "bg-[#b026ff]/10",
      border: "border-[#b026ff]/20",
      rows: [
        { label: "Distribution", value: distro.name },
        { label: "Tagline", value: distro.tagline },
        { label: "Base Size", value: `${distro.sizeMb} MB` },
      ],
    },
    {
      id: "desktop",
      icon: Monitor,
      title: "Desktop Environment",
      color: "text-[#56ffa8]",
      bg: "bg-[#56ffa8]/10",
      border: "border-[#56ffa8]/20",
      rows: [
        { label: "Environment", value: desktop.name },
        { label: "Description", value: desktop.description },
        { label: "Additional Size", value: `+${desktop.sizeMb} MB` },
      ],
    },
    {
      id: "hardware",
      icon: Cpu,
      title: "Target Hardware",
      color: "text-[#60a5fa]",
      bg: "bg-[#60a5fa]/10",
      border: "border-[#60a5fa]/20",
      rows: [
        { label: "Processor", value: cpu },
        { label: "Graphics", value: gpu },
        { label: "Memory", value: ram },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8]" suppressHydrationWarning>
      {/* ── Nav ── */}
      <nav
        className="fixed top-0 w-full z-50 bg-[#0b0c10]/90 backdrop-blur-xl border-b border-white/5"
        suppressHydrationWarning
      >
        <div className="flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
          <Link
            href="/"
            className="text-lg font-black tracking-tighter text-[#b026ff] hover:text-white transition-colors font-[Space_Grotesk]"
          >
            DistroForge
          </Link>
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            {["Hardware", "Kernel", "Store", "Review"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3">
                <span
                  className={`uppercase tracking-widest ${
                    step === "Review" ? "text-[#b026ff] font-bold" : ""
                  }`}
                >
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ChevronRight size={12} className="text-zinc-700" />
                )}
              </div>
            ))}
          </div>
          <Link
            href="/forge"
            className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Forge
          </Link>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="pt-28 pb-24 px-4 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-14 text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#56ffa8] mb-4">
            Step 5 of 5 — Final Review
          </p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4 font-[Space_Grotesk]">
            Review Your Build
          </h1>
          <p className="text-zinc-500 text-base max-w-lg mx-auto">
            Everything looks right? Hit the Forge button to start your custom ISO build on GitHub Actions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {sections.map(({ id, icon: Icon, title, color, bg, border, rows }) => (
            <div
              key={id}
              className={`bg-[#121317] border ${border} rounded-2xl p-7 space-y-5 relative overflow-hidden`}
            >
              {/* Ambient glow */}
              <div className={`absolute top-0 left-0 w-full h-1 ${bg} blur-sm`} />

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <h2 className={`font-bold text-sm uppercase tracking-widest font-mono ${color}`}>
                  {title}
                </h2>
              </div>

              <div className="space-y-3">
                {rows.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">
                      {label}
                    </span>
                    <span className="text-sm text-zinc-200 font-medium leading-snug">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Packages Section ── */}
        <div className="bg-[#121317] border border-white/5 rounded-2xl p-7 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e5b5ff]/10 flex items-center justify-center">
              <ShoppingCart size={20} className="text-[#e5b5ff]" />
            </div>
            <h2 className="font-bold text-sm uppercase tracking-widest font-mono text-[#e5b5ff]">
              Software Packages ({packages.length})
            </h2>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center gap-3 bg-[#1a1b20] rounded-xl px-4 py-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: pkg.iconBg }}
                  >
                    {pkg.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{pkg.name}</p>
                    <p className="text-[10px] text-zinc-500">+{pkg.sizeMb} MB</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-zinc-600 text-sm">
              <Package size={16} />
              No additional packages selected
            </div>
          )}
        </div>

        {/* ── Build Manifest summary ── */}
        <div className="bg-[#0d0e12] border border-white/5 rounded-2xl p-7 mb-10 font-mono text-xs">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4">
            Build Manifest Preview
          </p>
          <div className="flex gap-4 mb-2">
            <span className="text-[#56ffa8]">$</span>
            <span className="text-zinc-400">
              {"forge build --distro"} <span className="text-[#e5b5ff]">{distroId}</span>
              {" --de"} <span className="text-[#e5b5ff]">{desktopId}</span>
              {" --gpu"} <span className="text-[#e5b5ff]">&quot;{gpu}&quot;</span>
              {packages.length > 0 && (
                <>
                  {" --packages"}{" "}
                  <span className="text-[#56ffa8]">{packageIds.join(" ")}</span>
                </>
              )}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-[#56ffa8]">$</span>
            <span className="text-zinc-600">
              # Estimated ISO size: <span className="text-white">{sizeGb} GB</span> (compressed ~{(totalSizeMb / 1024 / 2).toFixed(1)} GB)
            </span>
          </div>
        </div>

        {/* ── Error ── */}
        {buildError && (
          <div className="mb-6 flex items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400 text-sm mb-1">Build Error</p>
              <p className="text-zinc-400 text-sm">{buildError}</p>
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => void handleBuild()}
            disabled={isSubmitting}
            className={`flex-1 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 group transition-all ${
              isSubmitting
                ? "bg-[#b026ff]/50 text-white/60 cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            {isSubmitting ? (
              <>
                <Terminal size={18} className="animate-pulse" />
                Dispatching Build…
              </>
            ) : (
              <>
                <Rocket size={18} />
                Forge My ISO
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>

          <Link
            href="/forge"
            className="px-10 py-5 rounded-2xl border border-white/10 text-zinc-400 text-sm font-semibold uppercase tracking-widest hover:border-white/30 hover:text-white transition-all text-center"
          >
            Reconfigure
          </Link>
        </div>

        {/* ── Footnote ── */}
        <div className="mt-8 flex items-center justify-center gap-2 text-zinc-700 text-xs font-mono">
          <CheckCircle2 size={12} />
          Build runs on GitHub Actions via n8n. ETA: 10–20 minutes.
        </div>
      </main>
    </div>
  );
}

export default function FinalReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8] flex items-center justify-center">
          <p className="font-mono text-zinc-500 text-sm uppercase tracking-widest">Loading review…</p>
        </div>
      }
    >
      <FinalReviewContent />
    </Suspense>
  );
}
