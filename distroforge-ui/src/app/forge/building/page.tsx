"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  Terminal,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Link from "next/link";

// ---- Build Status page ----
// Shown after the user clicks "Build ISO".
// Polls /api/forge/status every 8 seconds to show live build progress.
// URL: /forge/building?userId=xxx&distro=arch

type BuildStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | "not_found";

interface StatusResponse {
  status: BuildStatus;
  conclusion?: string | null;
  runId?: number;
  artifactName?: string;
  downloadUrl?: string | null;
  message?: string;
}

const STATUS_LABELS: Record<BuildStatus, string> = {
  queued: "In Queue",
  in_progress: "Building…",
  completed: "Ready to Download",
  failed: "Build Failed",
  not_found: "Initializing…",
};

const STATUS_COLORS: Record<BuildStatus, string> = {
  queued: "text-primary",
  in_progress: "text-primary animate-pulse",
  completed: "text-secondary-fixed",
  failed: "text-error",
  not_found: "text-zinc-400",
};

const getBuildLogs = (distro: string) => {
  const pkgManager =
    distro === "fedora" ? "dnf" : distro === "ubuntu" ? "apt" : "pacman";
  const baseTool =
    distro === "fedora" ? "live-respins" : distro === "ubuntu" ? "debootstrap" : "archiso";

  return [
    "[forge] Dispatching workflow to GitHub Actions…",
    "[forge] Runner: ubuntu-latest assigned (GitHub build host)",
    `[${baseTool}] Initializing ${distro} base environment…`,
    `[${pkgManager}] Syncing package databases…`,
    `[${pkgManager}] Resolving dependency tree…`,
    "[forge] Injecting user-selected packages and tweaks…",
    "[forge] Compiling custom kernel and modules…",
    "[forge] Building compressed root filesystem…",
    "[forge] Generating bootable ISO 9660 image…",
    "[forge] Build complete. Uploading artifact to Cloud Storage…",
  ];
};

function BuildingPageContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "anonymous";
  const distro = searchParams.get("distro") ?? "arch";
  const packages = searchParams.get("packages") ?? "";

  const [statusData, setStatusData] = useState<StatusResponse>({
    status: "not_found",
  });
  const [logLine, setLogLine] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const buildLogs = getBuildLogs(distro);

  // Poll the status API
  const pollStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/forge/status?userId=${userId}&distro=${distro}`
      );
      const data: StatusResponse = await res.json();
      setStatusData(data);
    } catch {
      // Network error — keep previous state
    }
  }, [userId, distro]);

  // Initial poll + interval
  useEffect(() => {
    const initialPoll = setTimeout(() => {
      void pollStatus();
    }, 0);
    const interval = setInterval(() => {
      void pollStatus();
    }, 8000);
    return () => {
      clearTimeout(initialPoll);
      clearInterval(interval);
    };
  }, [pollStatus]);

  // Advance the fake terminal log every 4s
  useEffect(() => {
    if (
      statusData.status === "completed" ||
      statusData.status === "failed"
    )
      return;
    const t = setInterval(() => {
      setLogLine((prev) => Math.min(prev + 1, buildLogs.length - 1));
    }, 4000);
    return () => clearInterval(t);
  }, [statusData.status, buildLogs.length]);

  // Elapsed time counter
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const isComplete =
    statusData.status === "completed" && statusData.conclusion === "success";
  const isFailed =
    statusData.status === "failed" ||
    statusData.conclusion === "failure";
  const isRunning = !isComplete && !isFailed;

  const fmtTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8] flex flex-col items-center justify-center px-6 py-24">
      {/* Back link */}
      <Link
        href="/forge"
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-primary font-label text-xs uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Forge
      </Link>

      <div className="max-w-3xl w-full space-y-10">
        {/* Status header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {isComplete ? (
              <CheckCircle2 size={72} className="text-secondary-fixed" />
            ) : isFailed ? (
              <AlertCircle size={72} className="text-error" />
            ) : (
              <Loader2 size={72} className="text-primary animate-spin" />
            )}
          </div>

          <h1 className="text-5xl font-black font-headline tracking-tighter">
            {isComplete
              ? "Your ISO is Ready!"
              : isFailed
              ? "Build Failed"
              : "Forging Your OS…"}
          </h1>

          <div
            className={`font-label text-sm uppercase tracking-widest ${STATUS_COLORS[statusData.status]}`}
          >
            {STATUS_LABELS[statusData.status]}
          </div>
        </div>

        {/* Build meta */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Distro", value: distro.toUpperCase() },
            {
              label: "Time Elapsed",
              value: (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {fmtTime(elapsed)}
                </span>
              ),
            },
            {
              label: "Build ID",
              value: statusData.runId
                ? `#${statusData.runId}`
                : "Pending",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="glass-card p-5 rounded-[1rem] text-center"
            >
              <div className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                {m.label}
              </div>
              <div className="font-headline font-bold text-xl">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Live terminal */}
        <div
          id="build-terminal"
          className="bg-[#0d0e12] rounded-[1rem] border border-white/5 overflow-hidden shadow-2xl terminal-scanline"
        >
          <div className="bg-[#292a2e] px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffb4ab]/40" />
              <div className="w-3 h-3 rounded-full bg-[#bdc7d9]/40" />
              <div className="w-3 h-3 rounded-full bg-[#56ffa8]/40" />
            </div>
            <div className="text-[10px] font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} />
              forge-build — {distro}@GitHub-Actions
            </div>
            <div className="w-16" />
          </div>

          <div className="p-6 font-mono text-xs leading-relaxed min-h-[220px] space-y-2">
            {buildLogs.slice(0, logLine + 1).map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-secondary-fixed shrink-0">$</span>
                <span
                  className={
                    i === logLine && isRunning
                      ? "text-white"
                      : "text-zinc-500"
                  }
                >
                  {line}
                </span>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-secondary-fixed">$</span>
                <span className="w-2 h-4 bg-secondary-fixed cursor-blink" />
              </div>
            )}
            {isComplete && (
              <div className="text-secondary-fixed font-bold mt-4">
                ✓ ISO artifact uploaded successfully. Download available above.
              </div>
            )}
            {isFailed && (
              <div className="text-error font-bold mt-4">
                ✗ Build failed. Check GitHub Actions for details.
              </div>
            )}
          </div>
        </div>

        {/* Package summary */}
        {packages && (
          <div className="glass-card p-6 rounded-[1rem]">
            <div className="font-label text-[10px] uppercase tracking-widest text-zinc-500 mb-3">
              Resolved Package Manifest
            </div>
            <div className="flex flex-wrap gap-2">
              {packages.split(",").map((pkg) => (
                <span
                  key={pkg}
                  className="bg-[#292a2e] text-secondary-fixed font-mono text-xs px-3 py-1 rounded-full"
                >
                  {pkg.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isComplete && statusData.downloadUrl ? (
            <a
              id="build-download-btn"
              href={statusData.downloadUrl}
              className="btn-primary flex-1 py-5 rounded-[1rem] font-headline font-bold uppercase tracking-widest text-center flex items-center justify-center gap-3 text-sm"
            >
              <Download size={20} />
              Download ISO
            </a>
          ) : (
            <button
              id="build-waiting-btn"
              disabled
              className="flex-1 py-5 rounded-[1rem] bg-[#292a2e] text-zinc-500 font-label font-bold uppercase tracking-widest text-sm cursor-not-allowed"
            >
              {isFailed ? "Build Failed" : "Building… (Auto-downloading when ready)"}
            </button>
          )}

          <Link
            id="build-new-btn"
            href="/forge"
            className="flex-1 py-5 rounded-[1rem] border border-[#4f4255]/30 text-primary font-label font-bold uppercase tracking-widest text-center text-sm hover:bg-[#292a2e]/30 transition-all flex items-center justify-center"
          >
            Build Another
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BuildingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8] flex items-center justify-center px-6">
          <div className="font-label text-sm uppercase tracking-widest text-zinc-400">
            Loading build status...
          </div>
        </div>
      }
    >
      <BuildingPageContent />
    </Suspense>
  );
}
