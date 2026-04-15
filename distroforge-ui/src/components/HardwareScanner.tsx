"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, Zap, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  terminalLines,
  cpuOptions,
  gpuOptions,
  ramOptions,
  type HardwareLine,
} from "@/data/mockData";

// ---- HardwareScanner component ----
// Renders: wizard step header, terminal mockup (left), manual override form (right).
// Backend hook: "Continue" should POST the hardware profile to /api/forge/hardware.

export interface HardwareScannerProps {
  readonly step?: number;
  readonly totalSteps?: number;
  readonly onBack?: () => void;
  readonly onContinue?: (profile: HardwareProfile) => void;
}

export interface HardwareProfile {
  cpu: string;
  gpu: string;
  ram: string;
}

// Wizard step sidebar items
const wizardSteps = [
  { id: "hardware", label: "Hardware" },
  { id: "kernel", label: "Kernel" },
  { id: "desktop", label: "Desktop" },
  { id: "packages", label: "Packages" },
  { id: "finalize", label: "Finalize" },
];

const detectAppleChip = (userAgent: string, renderer: string | null): string | null => {
  const combined = `${userAgent} ${renderer ?? ""}`;
  const match = combined.match(/\b(M[1-9](?:\s?(?:Pro|Max|Ultra))?)\b/i);
  return match ? match[1].toUpperCase() : null;
};

const estimateAppleVram = (memory?: number): number => {
  if (!memory || memory <= 0) return 8;
  if (memory >= 24) return 16;
  if (memory >= 16) return 12;
  if (memory >= 8) return 8;
  return 4;
};

const detectCpu = (
  userAgent: string,
  renderer: string | null,
  threads: number
): string => {
  const appleChip = detectAppleChip(userAgent, renderer);
  if (appleChip) {
    return `Apple ${appleChip} (${threads} browser threads reported) (Detected)`;
  }
  if (/amd/i.test(userAgent)) return `AMD CPU (${threads} threads) (Detected)`;
  if (/intel/i.test(userAgent))
    return `Intel CPU (${threads} threads) (Detected)`;
  if (/arm|aarch64|apple/i.test(userAgent))
    return `ARM/Apple Silicon (${threads} threads) (Detected)`;
  return `Generic x86_64 (${threads} threads) (Detected)`;
};

const detectGpu = (
  renderer: string | null,
  memory?: number,
  userAgent?: string
): string => {
  const info = (renderer ?? "").toLowerCase();
  const appleChip = detectAppleChip(userAgent ?? "", renderer);
  const compactRenderer = (renderer ?? "").replace(/\s+/g, " ").trim();

  const extractNvidiaModel = (value: string): string | null => {
    const m = value.match(
      /(RTX\s*\d{3,4}(?:\s*Ti)?|GTX\s*\d{3,4}(?:\s*Ti)?|MX\s*\d{3,4}|Quadro\s+[A-Za-z0-9-]+|Tesla\s+[A-Za-z0-9-]+)/i
    );
    return m ? m[1].replace(/\s+/g, " ").toUpperCase() : null;
  };

  const extractAmdModel = (value: string): string | null => {
    const m = value.match(
      /(RX\s*\d{3,4}(?:\s*XT)?|Radeon\s+(?:RX\s*)?\d{3,4}(?:\s*XT)?|Radeon\s+[A-Za-z0-9-]+)/i
    );
    return m ? m[1].replace(/\s+/g, " ").trim() : null;
  };

  const extractIntelModel = (value: string): string | null => {
    const m = value.match(/(Arc\s+[A-Za-z0-9-]+|UHD\s+[A-Za-z0-9-]+|Iris\s+[A-Za-z0-9-]+)/i);
    return m ? m[1].replace(/\s+/g, " ").trim() : null;
  };

  if (appleChip) {
    const estimatedVram = estimateAppleVram(memory);
    return `Apple ${appleChip} GPU (Integrated, shared up to ~${estimatedVram}GB, high performance tier) (Detected)`;
  }
  if (info.includes("nvidia")) {
    const model = extractNvidiaModel(compactRenderer);
    return model
      ? `NVIDIA ${model} (Detected)`
      : `NVIDIA GPU (${compactRenderer || "Detected"}) (Detected)`;
  }
  if (info.includes("amd") || info.includes("radeon")) {
    const model = extractAmdModel(compactRenderer);
    return model
      ? `AMD ${model} (Detected)`
      : `AMD Radeon (${compactRenderer || "Detected"}) (Detected)`;
  }
  if (info.includes("intel")) {
    const model = extractIntelModel(compactRenderer);
    return model
      ? `Intel ${model} (Detected)`
      : `Intel Graphics (${compactRenderer || "Detected"}) (Detected)`;
  }
  return "Virtual / Integrated Graphics (Detected)";
};

const detectRam = (deviceMemory?: number): string => {
  if (deviceMemory && deviceMemory > 0) {
    return `${deviceMemory}GB RAM (Detected)`;
  }
  return "16GB RAM (Detected)";
};

export default function HardwareScanner({
  step = 1,
  totalSteps = 5,
  onBack,
  onContinue,
}: HardwareScannerProps) {
  const [cpu, setCpu] = useState(cpuOptions[0]);
  const [gpu, setGpu] = useState(gpuOptions[0]);
  const [ram, setRam] = useState(ramOptions[0]);
  const [runtimeCpuOptions, setRuntimeCpuOptions] = useState(cpuOptions);
  const [runtimeGpuOptions, setRuntimeGpuOptions] = useState(gpuOptions);
  const [runtimeRamOptions, setRuntimeRamOptions] = useState(ramOptions);
  const [runtimeTerminalLines, setRuntimeTerminalLines] =
    useState<HardwareLine[]>(terminalLines);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const getWebGlRenderer = (): string | null => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl") as WebGLRenderingContext | null) ??
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
      if (!gl) return null;

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info") as
        | { UNMASKED_RENDERER_WEBGL: number }
        | null;
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        return typeof renderer === "string" ? renderer : null;
      }

      const fallback = gl.getParameter(gl.RENDERER);
      return typeof fallback === "string" ? fallback : null;
    } catch {
      return null;
    }
  };

  const runHardwareDetection = useCallback(async () => {
    const userAgent = navigator.userAgent ?? "";
    const threads = navigator.hardwareConcurrency ?? 8;
    const renderer = getWebGlRenderer();
    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory =
      typeof nav.deviceMemory === "number"
        ? nav.deviceMemory
        : undefined;

    const detectedCpu = detectCpu(userAgent, renderer, threads);
    const detectedGpu = detectGpu(renderer, memory, userAgent);
    const detectedRam = detectRam(memory);

    setRuntimeCpuOptions([detectedCpu, ...cpuOptions.filter((o) => o !== cpuOptions[0])]);
    setRuntimeGpuOptions([detectedGpu, ...gpuOptions.filter((o) => o !== gpuOptions[0])]);
    setRuntimeRamOptions([detectedRam, ...ramOptions.filter((o) => o !== ramOptions[0])]);

    setCpu(detectedCpu);
    setGpu(detectedGpu);
    setRam(detectedRam);
    setRuntimeTerminalLines([
      {
        prefix: "$",
        prefixColor: "#56ffa8",
        content: "curl -sSfL https://forge.distro.dev/detect.sh | sh",
        contentColor: "#ffffff",
      },
      {
        prefix: "[info]",
        prefixColor: "#6b7280",
        content: "Auto-detecting browser-visible hardware profile...",
        contentColor: "#9ca3af",
      },
      {
        prefix: "Detected:",
        prefixColor: "#9ca3af",
        content: detectedGpu,
        contentColor: "#e5b5ff",
      },
      {
        prefix: "[info]",
        prefixColor: "#6b7280",
        content: renderer
          ? `WebGL Renderer: ${renderer}`
          : "WebGL renderer unavailable in this browser",
        contentColor: "#9ca3af",
      },
      {
        prefix: "Detected:",
        prefixColor: "#9ca3af",
        content: detectedCpu,
        contentColor: "#e5b5ff",
      },
      {
        prefix: "Memory:",
        prefixColor: "#9ca3af",
        content: detectedRam,
        contentColor: "#e5b5ff",
      },
    ]);
    setScanComplete(true);
  }, []);

  const handleRefresh = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      void runHardwareDetection();
      setIsScanning(false);
    }, 900);
  };

  const handleContinue = () => {
    onContinue?.({ cpu, gpu, ram });
  };

  useEffect(() => {
    const start = setTimeout(() => {
      setIsScanning(true);
      void runHardwareDetection().finally(() => setIsScanning(false));
    }, 0);

    return () => clearTimeout(start);
  }, [runHardwareDetection]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8] font-body">
      {/* ── Top Nav ── */}
      <nav
        id="hw-top-nav"
        className="bg-[#121317]/40 backdrop-blur-xl fixed top-0 w-full z-50"
        suppressHydrationWarning
      >
        <div className="flex justify-between items-center px-12 py-6 max-w-[1920px] mx-auto">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-white uppercase font-headline hover:text-primary transition-colors"
          >
            DistroForge
          </Link>
          <div className="hidden md:flex items-center gap-8 font-label text-sm">
            {[
              { label: "Directory", href: "/forge" },
              { label: "The Forge", href: "/forge", active: true },
              { label: "Sponsor", href: "/" },
              { label: "GitHub", href: "https://github.com" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={
                  l.active
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-zinc-400 hover:text-zinc-100 transition-colors"
                }
              >
                {l.label}
              </Link>
            ))}
          </div>
          <button
            id="hw-download-btn"
            className="btn-primary px-6 py-2 text-sm font-label font-bold rounded-[1rem]"
          >
            Download ISO
          </button>
        </div>
      </nav>

      {/* ── Wizard Steps Sidebar ── */}
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col p-4 z-40 bg-zinc-900/50 rounded-full my-8 ml-8">
        <div className="flex flex-col gap-4 py-4 px-2">
          {wizardSteps.map((s, i) => {
            const isActive = i === step - 1;
            return (
              <div
                key={s.id}
                id={`wizard-step-${s.id}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  isActive
                    ? "bg-secondary-fixed/10 text-secondary-fixed font-bold"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                }`}
              >
                <Cpu size={16} />
                <span className="text-xs font-label tracking-widest">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        className="pt-32 pb-24 px-12 max-w-[1400px] mx-auto min-h-screen"
        suppressHydrationWarning
      >
        {/* Step header */}
        <div className="mb-12 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-label text-primary tracking-[0.3em] uppercase text-xs font-bold">
              Forge Initialization
            </span>
            <h1 className="text-6xl font-black font-headline tracking-tighter text-white">
              Hardware Detection
            </h1>
          </div>

          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-zinc-500 font-label text-sm uppercase tracking-widest mb-2">
              Progress
            </div>
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-12 rounded-full transition-colors ${
                    i < step ? "bg-primary" : "bg-[#292a2e]"
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 text-zinc-400 font-label text-xs">
              STEP {step} OF {totalSteps}
            </div>
          </div>
        </div>

        {/* Content grid: 7/5 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left: Terminal ── */}
          <div className="lg:col-span-7 space-y-8">
            {/* Terminal mockup */}
            <div
              id="forge-terminal"
              className="bg-[#0d0e12] rounded-[1rem] border border-white/5 overflow-hidden shadow-2xl relative group terminal-scanline"
            >
              {/* Terminal title bar */}
              <div className="bg-[#292a2e] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-2">
                  {/* Traffic light dots */}
                  <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/40" />
                  <div className="w-3 h-3 rounded-full bg-[#bdc7d9]/40" />
                  <div className="w-3 h-3 rounded-full bg-[#56ffa8]/40" />
                </div>
                <div className="text-[10px] font-label text-zinc-500 uppercase tracking-widest">
                  Forge-Terminal v0.4.2
                </div>
                <div className="w-12" />
              </div>

              {/* Terminal body */}
              <div className="p-8 font-mono text-sm leading-relaxed text-zinc-300 min-h-[320px]">
                {runtimeTerminalLines.map((line, i) => (
                  <div key={i} className="flex gap-4 mb-2">
                    <span
                      className="shrink-0"
                      style={{ color: line.prefixColor }}
                    >
                      {line.prefix}
                    </span>
                    <span style={{ color: line.contentColor }}>
                      {line.content}
                    </span>
                  </div>
                ))}

                {/* Success message */}
                {scanComplete && (
                  <p className="text-secondary-fixed font-bold mt-4">
                    Verification complete. Hardware profile synced.
                  </p>
                )}

                {/* Cursor */}
                <div className="mt-6 flex gap-4 items-center">
                  <span className="text-secondary-fixed">$</span>
                  <span className="w-2 h-5 bg-secondary-fixed cursor-blink" />
                </div>
              </div>

              {/* Ambient glow overlay — primary at 10% */}
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 blur-[80px] pointer-events-none" />
            </div>

            {/* Auto-detect CTA card */}
            <button
              id="hw-auto-detect-btn"
              onClick={handleRefresh}
              disabled={isScanning}
              className="w-full bg-[#1a1b20] p-8 rounded-[1rem] flex items-center justify-between group cursor-pointer hover:bg-[#292a2e] transition-all border border-transparent hover:border-primary/20 disabled:opacity-60"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary-fixed/10 flex items-center justify-center text-secondary-fixed">
                  {isScanning ? (
                    <RefreshCw size={28} className="animate-spin" />
                  ) : (
                    <Zap size={28} />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1 font-headline">
                    {isScanning ? "Scanning..." : "Auto-Detect My Hardware"}
                  </h3>
                  <p className="text-zinc-500 font-label text-sm">
                    Forge will automatically scan your environment for optimal
                    drivers.
                  </p>
                </div>
              </div>
              <ChevronRight
                size={24}
                className="text-primary group-hover:translate-x-2 transition-transform"
              />
            </button>
          </div>

          {/* ── Right: Manual Override ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1a1b20] p-8 rounded-[1rem] space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-headline">
                  Manual Override
                </h2>
                <p className="text-zinc-500 text-sm">
                  Adjust system parameters if auto-detection fails to capture
                  specific configurations.
                </p>
              </div>

              {/* Form fields */}
              <div className="space-y-6">
                {/* CPU */}
                <div className="space-y-2">
                  <label
                    htmlFor="hw-cpu-select"
                    className="font-label text-xs uppercase tracking-widest text-zinc-400"
                  >
                    Processor (CPU)
                  </label>
                  <select
                    id="hw-cpu-select"
                    value={cpu}
                    onChange={(e) => setCpu(e.target.value)}
                    className="w-full bg-[#292a2e] border-none text-white font-body px-4 py-4 rounded-[1rem] appearance-none cursor-pointer focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {runtimeCpuOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* GPU */}
                <div className="space-y-2">
                  <label
                    htmlFor="hw-gpu-select"
                    className="font-label text-xs uppercase tracking-widest text-zinc-400"
                  >
                    Graphics (GPU)
                  </label>
                  <select
                    id="hw-gpu-select"
                    value={gpu}
                    onChange={(e) => setGpu(e.target.value)}
                    className="w-full bg-[#292a2e] border-none text-white font-body px-4 py-4 rounded-[1rem] appearance-none cursor-pointer focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {runtimeGpuOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* RAM */}
                <div className="space-y-2">
                  <label
                    htmlFor="hw-ram-select"
                    className="font-label text-xs uppercase tracking-widest text-zinc-400"
                  >
                    System Memory
                  </label>
                  <select
                    id="hw-ram-select"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full bg-[#292a2e] border-none text-white font-body px-4 py-4 rounded-[1rem] appearance-none cursor-pointer focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {runtimeRamOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                id="hw-refresh-list-btn"
                onClick={handleRefresh}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-[1rem] transition-colors font-label tracking-widest text-xs uppercase border border-white/10"
              >
                Refresh Hardware List
              </button>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                id="hw-back-btn"
                onClick={onBack}
                className="text-zinc-500 hover:text-white font-label text-sm uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              <button
                id="hw-continue-btn"
                onClick={handleContinue}
                className="btn-primary px-10 py-4 rounded-[1rem] font-bold text-sm font-label tracking-widest uppercase"
              >
                Continue to Kernel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
