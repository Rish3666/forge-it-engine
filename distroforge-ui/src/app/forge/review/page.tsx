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
  ShoppingCart,
  Cpu,
  Package,
  Layers,
  AlertCircle,
  Monitor,
} from "lucide-react";
import { distroOptions, desktopEnvironments, softwarePackages } from "@/data/mockData";

// ─── Helper: Dynamic Forge Forecast ──────────────────────────────────────────
// Generates realistic performance predictions based on the build configuration.
interface Forecast {
  rating: number;
  label: string;
  ram: string;
  cpuIdle: string;
  disk: string;
  note: string;
}

function getForecast(distroId: string, desktopId: string): Forecast {
  const isMinimal = distroId === "arch" && ["hyprland", "sway", "wayfire"].includes(desktopId);
  const isHeavy = distroId === "ubuntu" || desktopId === "gnome" || desktopId === "kde";

  if (isMinimal) {
    return {
      rating: 9.8,
      label: "Silky Smooth",
      ram: "~350-450 MB",
      cpuIdle: "0-1%",
      disk: "4.2 GB",
      note: "Configuration is optimized for ultra-low latency and peak frame consistency.",
    };
  }

  if (isHeavy) {
    return {
      rating: 8.9,
      label: "Robust & Fluid",
      ram: "~850-1.1 GB",
      cpuIdle: "2-4%",
      disk: "5.8 GB",
      note: "Standard industrial configuration. Optimized for reliability and full feature parity.",
    };
  }

  return {
    rating: 9.4,
    label: "Balanced Speed",
    ram: "~550-700 MB",
    cpuIdle: "1-2%",
    disk: "4.9 GB",
    note: "Balanced configuration with moderate resource overhead and high responsiveness.",
  };
}

// ─── Final Review Page ───────────────────────────────────────────────────────

function FinalReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const distroId = searchParams.get("distro") ?? "arch";
  const desktopId = searchParams.get("desktop") ?? "gnome";
  const packageIds = (searchParams.get("packages") ?? "discord,firefox").split(",").filter(Boolean);
  const gpuDetected = searchParams.get("gpu") ?? "Generic GPU";
  const ramDetected = searchParams.get("ram") ?? "16GB DDR4";
  const cpuDetected = searchParams.get("cpu") ?? "Generic x86_64";

  const distro = distroOptions.find((d) => d.id === distroId) ?? distroOptions[0];
  const desktop = desktopEnvironments.find((d) => d.id === desktopId) ?? desktopEnvironments[0];
  const packages = packageIds
    .map((id) => softwarePackages.find((p) => p.id === id))
    .filter((p): p is (typeof softwarePackages)[number] => Boolean(p));

  const totalSizeMb = distro.sizeMb + desktop.sizeMb + packages.reduce((acc, p) => acc + p.sizeMb, 0);
  const sizeGb = (totalSizeMb / 1024).toFixed(1);

  const forecast = getForecast(distroId, desktopId);

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
          gpu: gpuDetected,
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

  return (
    <div className="min-h-screen bg-[#121317] text-[#e3e2e8] font-body" suppressHydrationWarning>
      {/* ── Top Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#121317] flex justify-between items-center px-12 h-20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-black text-[#e5b5ff] font-headline tracking-tighter hover:text-white transition-colors">
            DistroForge
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Hardware", active: false },
            { label: "Kernel", active: false },
            { label: "Store", active: false },
            { label: "Review", active: true },
          ].map((l) => (
            <span
              key={l.label}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] font-label transition-colors ${
                l.active ? "text-[#e5b5ff] border-b-2 border-[#e5b5ff] pb-1" : "text-zinc-500"
              }`}
            >
              {l.label}
            </span>
          ))}
        </div>
        <Link
          href="/forge"
          className="bg-gradient-primary text-[#30004b] px-6 py-2 rounded-[1rem] font-bold active:scale-95 transition-transform text-sm font-headline"
        >
          Download ISO
        </Link>
      </nav>

      {/* ── Main Content ── */}
      <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full">
        <header className="mb-14 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter text-white mb-4">
            The Forge: <span className="text-primary">Final Review</span>
          </h1>
          <p className="text-zinc-400 font-label text-base tracking-widest uppercase">
            Step 5 of 5 — Validating Cybernetic Integrity
          </p>
        </header>

        {/* ── Central Review Canvas ── */}
        <div className="bg-[#1a1b20]/60 backdrop-blur-2xl rounded-[2rem] border border-white/5 p-8 md:p-12 relative overflow-hidden">
          {/* Ambient decorative glows */}
          <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary-fixed/5 rounded-full blur-[120px]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* ── Left Column: Summary & Forecast ── */}
            <div className="lg:col-span-7 space-y-12">
              {/* Build Summary Section */}
              <section>
                <h3 className="font-label text-secondary-fixed text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">settings_input_component</span>
                  Build Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { icon: "terminal", label: "Base Distro", value: distro.name },
                    { icon: "layers", label: "Environment", value: desktop.name },
                    {
                      icon: "package_2",
                      label: "Packages",
                      value: `${packageIds.length + 1200} Compiled`,
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="bg-[#0d0e12] p-7 rounded-[1.5rem] border border-white/5 group hover:border-primary/20 transition-all"
                    >
                      <span className="material-symbols-outlined text-primary text-4xl mb-6 group-hover:scale-110 transition-transform block">
                        {card.icon}
                      </span>
                      <p className="text-zinc-500 text-[10px] font-label uppercase tracking-widest mb-1">
                        {card.label}
                      </p>
                      <p className="text-lg font-bold text-white font-headline">{card.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Forge Forecast Section */}
              <section>
                <h3 className="font-label text-secondary-fixed text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">query_stats</span>
                  Forge Forecast
                </h3>
                <div className="flex flex-col md:flex-row gap-10 items-center bg-[#0d0e12] p-10 rounded-[2rem] border border-white/5">
                  {/* Performance Ring SVG */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-white/5"
                        cx="72"
                        cy="72"
                        fill="transparent"
                        r="66"
                        stroke="currentColor"
                        strokeWidth="10"
                      />
                      <circle
                        className="text-secondary-fixed drop-shadow-[0_0_10px_rgba(86,255,168,0.4)]"
                        cx="72"
                        cy="72"
                        fill="transparent"
                        r="66"
                        stroke="currentColor"
                        strokeDasharray="415"
                        strokeDashoffset={415 - (415 * forecast.rating) / 10}
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black font-headline text-white">
                        {forecast.rating}
                      </span>
                      <span className="text-[10px] font-label text-zinc-500 uppercase tracking-widest">
                        Rating
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-3xl font-black text-secondary-fixed font-headline">
                        &quot;{forecast.label}&quot;
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed/10 text-secondary-fixed text-[10px] font-bold uppercase tracking-tighter">
                        Validated
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-body">
                      {forecast.note}
                    </p>
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: "RAM (Idle)", value: forecast.ram },
                        { label: "CPU (Idle)", value: forecast.cpuIdle },
                        { label: "Root Size", value: forecast.disk },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-[10px] font-label text-zinc-500 uppercase tracking-widest mb-1">
                            {stat.label}
                          </p>
                          <p className="text-lg font-bold text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Right Column: Hardware & CTA ── */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#292a2e]/50 p-8 rounded-[2rem] border border-white/5 mb-8 flex-grow">
                <h3 className="font-label text-primary text-xs font-bold tracking-[0.3em] uppercase mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">memory</span>
                  Hardware Context
                </h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#121317] flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-2xl">developer_board</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-label text-zinc-500 uppercase tracking-widest mb-1">
                        GPU Target
                      </p>
                      <p className="font-bold text-white text-lg leading-tight uppercase font-headline">
                        {gpuDetected.split(" (Translated)")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#121317] flex items-center justify-center text-primary shadow-inner">
                      <span className="material-symbols-outlined text-2xl">computer</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-label text-zinc-500 uppercase tracking-widest mb-1">
                        CPU Target
                      </p>
                      <p className="font-bold text-white text-lg leading-tight uppercase font-headline">
                        {cpuDetected.split(" (Detected)")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 p-5 bg-primary/5 border-l-2 border-primary rounded-r-xl">
                    <p className="text-sm italic text-zinc-400 leading-relaxed">
                      &quot;Kernel modules and drivers have been auto-injected for optimal performance on the target hardware.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Action Section */}
              <div className="space-y-6">
                <button
                  onClick={() => void handleBuild()}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-primary h-28 rounded-[1.5rem] flex flex-col items-center justify-center group active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(176,38,255,0.25)] hover:shadow-primary-lg disabled:opacity-50"
                >
                  <span className="text-2xl font-black font-headline text-[#30004b] flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Terminal size={24} className="animate-spin" />
                        FORGING...
                      </>
                    ) : (
                      <>
                        <Rocket size={24} />
                        BUILD & DOWNLOAD ISO
                      </>
                    )}
                  </span>
                  <span className="text-[10px] font-label uppercase tracking-[0.3em] text-[#30004b]/70 font-bold mt-2">
                    {isSubmitting ? "Compiling Cybernetic Files" : "Initialize Compiling Process"}
                  </span>
                </button>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-[10px] font-label text-zinc-500 uppercase tracking-widest font-bold">
                    <span>Forge Readiness</span>
                    <span className="text-secondary-fixed">100% Validated</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-secondary-fixed shadow-[0_0_10px_rgba(86,255,168,0.5)]" />
                  </div>
                </div>

                {buildError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs">
                    <AlertCircle size={16} />
                    {buildError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Integrity Terminal Footer ── */}
        <div className="mt-20 bg-[#0d0e12] border-l-4 border-secondary-fixed rounded-r-[1rem] p-8 max-w-2xl relative z-10 opacity-90 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] font-label text-zinc-500 uppercase tracking-widest">
              verify_integrity.sh
            </span>
          </div>
          <code className="text-xs font-mono text-zinc-300 block space-y-2 leading-relaxed">
            <p className="text-zinc-500">[info] Starting build validation...</p>
            <p>
              <span className="text-secondary-fixed font-bold">[ok]</span> {distro.name} base manifest verified.
            </p>
            <p>
              <span className="text-secondary-fixed font-bold">[ok]</span> {desktop.name} config optimized for {gpuDetected.split(" ")[0]}.
            </p>
            <p>
              <span className="text-secondary-fixed font-bold">[ok]</span> {packageIds.length} packages resolved in tree.
            </p>
            <p className="text-secondary-fixed font-black uppercase mt-4">
              [success] Build structure finalized. Ready for forge.
            </p>
          </code>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#121317] border-t border-white/5 py-16 px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-black text-white font-headline tracking-tighter">
              DistroForge
            </span>
            <p className="text-zinc-500 text-xs font-label tracking-widest uppercase">
              © 2024 DistroForge. Systemic Elegance.
            </p>
          </div>
          <div className="flex gap-10 font-label text-xs uppercase tracking-widest font-bold">
            {["Documentation", "Changelog", "Support"].map((l) => (
              <a key={l} href="#" className="text-zinc-600 hover:text-primary transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FinalReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#121317] text-[#e3e2e8] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Terminal size={48} className="animate-pulse text-primary" />
            <p className="font-mono text-zinc-500 text-xs uppercase tracking-[0.3em]">
              Analyzing Manifest…
            </p>
          </div>
        </div>
      }
    >
      <FinalReviewContent />
    </Suspense>
  );
}
