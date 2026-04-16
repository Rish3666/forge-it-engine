"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Terminal,
  Zap,
  Shield,
  Gamepad2,
  Code2,
  Briefcase,
  Music2,
  Monitor,
  Laptop,
  Layers,
  LayoutGrid,
  Grid3X3,
  Mouse,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";

// ─── Quiz data structure ─────────────────────────────────────────────────────

interface Option {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  weight?: Record<string, number>; // distro → score contribution
}

interface Question {
  id: string;
  step: number;
  category: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi";
  options: Option[];
}

const questions: Question[] = [
  {
    id: "current_os",
    step: 1,
    category: "Background",
    question: "What's your current operating system?",
    subtitle: "This helps us understand what you're used to.",
    type: "single",
    options: [
      {
        id: "windows",
        label: "Windows",
        description: "Daily driver for most tasks",
        icon: Monitor,
        weight: { mint: 3, ubuntu: 2, fedora: 1 },
      },
      {
        id: "macos",
        label: "macOS",
        description: "Apple ecosystem user",
        icon: Laptop,
        weight: { fedora: 3, ubuntu: 2, arch: 1 },
      },
      {
        id: "linux",
        label: "Linux",
        description: "Already in the ecosystem",
        icon: Terminal,
        weight: { arch: 3, fedora: 2, ubuntu: 1 },
      },
      {
        id: "both",
        label: "I use multiple",
        description: "Cross-platform developer",
        icon: Layers,
        weight: { fedora: 2, arch: 2, ubuntu: 1 },
      },
    ],
  },
  {
    id: "expertise",
    step: 2,
    category: "Experience",
    question: "How familiar are you with Linux?",
    subtitle: "Be honest — there's no wrong answer here.",
    type: "single",
    options: [
      {
        id: "total_beginner",
        label: "Complete Beginner",
        description: "Never touched a terminal",
        icon: Star,
        weight: { mint: 4, ubuntu: 3 },
      },
      {
        id: "casual",
        label: "Casual User",
        description: "Used Linux before, basic commands",
        icon: Monitor,
        weight: { ubuntu: 3, mint: 2, fedora: 1 },
      },
      {
        id: "intermediate",
        label: "Intermediate",
        description: "Comfortable with the terminal",
        icon: Code2,
        weight: { fedora: 3, ubuntu: 2, arch: 1 },
      },
      {
        id: "power_user",
        label: "Power User",
        description: "I live in the terminal",
        icon: Terminal,
        weight: { arch: 4, fedora: 2 },
      },
    ],
  },
  {
    id: "use_case",
    step: 3,
    category: "Use Case",
    question: "What will you primarily use this system for?",
    subtitle: "Select all that apply.",
    type: "multi",
    options: [
      {
        id: "gaming",
        label: "Gaming",
        description: "Steam, Proton, game performance",
        icon: Gamepad2,
        weight: { arch: 3, ubuntu: 2 },
      },
      {
        id: "development",
        label: "Software Development",
        description: "Coding, containers, CI/CD",
        icon: Code2,
        weight: { fedora: 3, arch: 2, ubuntu: 2 },
      },
      {
        id: "creative",
        label: "Creative Work",
        description: "Video, audio, graphics",
        icon: Music2,
        weight: { ubuntu: 3, fedora: 2 },
      },
      {
        id: "productivity",
        label: "Office & Productivity",
        description: "Docs, email, browsing",
        icon: Briefcase,
        weight: { ubuntu: 3, mint: 3 },
      },
      {
        id: "security",
        label: "Privacy & Security",
        description: "Hardened, minimal footprint",
        icon: Shield,
        weight: { arch: 3, fedora: 2 },
      },
      {
        id: "server",
        label: "Server / Homelab",
        description: "Selfhosting, containers",
        icon: Zap,
        weight: { arch: 2, ubuntu: 3, fedora: 2 },
      },
    ],
  },
  {
    id: "de_feel",
    step: 4,
    category: "Desktop Feel",
    question: "How should your desktop feel?",
    subtitle: "Think about aesthetics, speed, and workflow.",
    type: "single",
    options: [
      {
        id: "familiar_clean",
        label: "Familiar & Clean",
        description: "Taskbar, icons, feels like home",
        icon: Monitor,
        weight: { mint: 4, ubuntu: 2 },
      },
      {
        id: "modern_elegant",
        label: "Modern & Elegant",
        description: "Smooth animations, dock-based",
        icon: Laptop,
        weight: { fedora: 3, ubuntu: 3 },
      },
      {
        id: "tiling_power",
        label: "Tiling & Efficient",
        description: "Keyboard-driven, zero clutter",
        icon: LayoutGrid,
        weight: { arch: 4, fedora: 1 },
      },
      {
        id: "minimal_fast",
        label: "Minimal & Blazing Fast",
        description: "Lightweight, only what I need",
        icon: Grid3X3,
        weight: { arch: 3, mint: 2 },
      },
    ],
  },
  {
    id: "updates",
    step: 5,
    category: "Stability",
    question: "How often do you want system updates?",
    subtitle: "Rolling vs. stable release models.",
    type: "single",
    options: [
      {
        id: "cutting_edge",
        label: "Cutting Edge",
        description: "Latest everything, always",
        icon: Flame,
        weight: { arch: 4, fedora: 2 },
      },
      {
        id: "frequent",
        label: "Frequent but Tested",
        description: "New features with some vetting",
        icon: Zap,
        weight: { fedora: 3, ubuntu: 2 },
      },
      {
        id: "stable",
        label: "Stable & Predictable",
        description: "LTS, only when absolutely needed",
        icon: Shield,
        weight: { ubuntu: 4, mint: 3 },
      },
    ],
  },
  {
    id: "terminal_comfort",
    step: 6,
    category: "Terminal",
    question: "How comfortable are you with the command line?",
    type: "single",
    options: [
      {
        id: "avoid",
        label: "I avoid it",
        description: "GUI everything, please",
        icon: Mouse,
        weight: { mint: 4, ubuntu: 2 },
      },
      {
        id: "basic",
        label: "Basic commands",
        description: "cd, ls, sudo — that's me",
        icon: Terminal,
        weight: { ubuntu: 3, fedora: 2 },
      },
      {
        id: "comfortable",
        label: "Comfortable",
        description: "I can script and troubleshoot",
        icon: Code2,
        weight: { fedora: 3, arch: 2 },
      },
      {
        id: "love_it",
        label: "I live in the terminal",
        description: "Neovim, tmux, the whole setup",
        icon: Flame,
        weight: { arch: 5 },
      },
    ],
  },
  {
    id: "hardware",
    step: 7,
    category: "Hardware",
    question: "What's your hardware like?",
    subtitle: "This impacts driver support and resource usage.",
    type: "single",
    options: [
      {
        id: "old",
        label: "Older / Low-end",
        description: "Under 8GB RAM, spinning HDD",
        icon: Laptop,
        weight: { mint: 4, ubuntu: 2 },
      },
      {
        id: "mid",
        label: "Mid-range",
        description: "8–16GB RAM, modern CPU",
        icon: Monitor,
        weight: { ubuntu: 3, fedora: 3 },
      },
      {
        id: "high",
        label: "High-end",
        description: "32GB+ RAM, NVMe, dedicated GPU",
        icon: Zap,
        weight: { arch: 3, fedora: 2, ubuntu: 2 },
      },
      {
        id: "cutting_edge_hw",
        label: "Latest & Greatest",
        description: "Newest AMD/NVIDIA, latest gen CPU",
        icon: Flame,
        weight: { arch: 4, fedora: 3 },
      },
    ],
  },
];

// ─── Distro result data ──────────────────────────────────────────────────────

interface DistroDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  strengths: string[];
  forgeId: string; // which variant to pass to the forge
}

const distros: Record<string, DistroDef> = {
  arch: {
    id: "arch",
    name: "Arch Linux",
    tagline: "The Power User's Canvas",
    description:
      "You crave control and bleeding-edge software. Arch gives you a minimal base and total freedom to build exactly the system you want — nothing more, nothing less.",
    badge: "Advanced",
    badgeColor: "text-red-400 bg-red-400/10 border-red-500/20",
    strengths: [
      "Rolling release — always the latest",
      "AUR: massive community package repo",
      "Minimal bloat, maximum control",
      "Pacman is blazing fast",
    ],
    forgeId: "arch",
  },
  fedora: {
    id: "fedora",
    name: "Fedora",
    tagline: "The Developer's Standard",
    description:
      "You want a cutting-edge, well-engineered platform. Fedora ships GNOME, SELinux, and Flatpak by default — it's what Red Hat engineers use daily.",
    badge: "Intermediate",
    badgeColor: "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-500/20",
    strengths: [
      "Latest GNOME & kernel, tested",
      "SELinux security out of the box",
      "Flatpak native support",
      "Red Hat engineering quality",
    ],
    forgeId: "fedora",
  },
  ubuntu: {
    id: "ubuntu",
    name: "Ubuntu",
    tagline: "The Industry Standard",
    description:
      "You want something that just works with the largest ecosystem of tutorials, hardware support, and community help. Ubuntu is the safe, powerful choice.",
    badge: "Beginner Friendly",
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-500/20",
    strengths: [
      "Massive community & documentation",
      "Snap + Flatpak + .deb packages",
      "Broadest hardware compatibility",
      "LTS releases with 5-year support",
    ],
    forgeId: "ubuntu",
  },
  mint: {
    id: "mint",
    name: "Linux Mint",
    tagline: "The Desktop Comfort Zone",
    description:
      "Familiar, stable, and welcoming. Mint's Cinnamon desktop feels like Windows but runs on a solid Ubuntu base — perfect for switching from Windows.",
    badge: "Beginner",
    badgeColor: "text-green-400 bg-green-400/10 border-green-500/20",
    strengths: [
      "Windows-like Cinnamon DE",
      "Ubuntu/Debian package ecosystem",
      "5-year LTS support cycle",
      "Ships with multimedia codecs",
    ],
    forgeId: "ubuntu", // closest builder
  },
};

function computeResult(answers: Record<string, string[]>): string {
  const scores: Record<string, number> = {
    arch: 0,
    fedora: 0,
    ubuntu: 0,
    mint: 0,
  };

  questions.forEach((q) => {
    const selected = answers[q.id] ?? [];
    q.options.forEach((opt) => {
      if (selected.includes(opt.id) && opt.weight) {
        Object.entries(opt.weight).forEach(([distro, pts]) => {
          scores[distro] = (scores[distro] ?? 0) + pts;
        });
      }
    });
  });

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#e5b5ff] to-[#b026ff] rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden ${
        selected
          ? "border-[#b026ff] bg-[#b026ff]/10 shadow-[0_0_30px_rgba(176,38,255,0.15)]"
          : "border-white/5 bg-[#1a1b20] hover:border-white/20 hover:bg-[#22242a]"
      }`}
    >
      {/* Glow on selected */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#b026ff]/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-start gap-4 relative">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            selected
              ? "bg-[#b026ff] text-white"
              : "bg-white/5 text-zinc-400 group-hover:bg-white/10"
          }`}
        >
          {Icon && <Icon size={20} />}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-semibold text-sm transition-colors ${
                selected ? "text-white" : "text-zinc-200"
              }`}
            >
              {option.label}
            </span>
            {selected && (
              <CheckCircle2
                size={16}
                className="text-[#b026ff] shrink-0 animate-in fade-in"
              />
            )}
          </div>
          {option.description && (
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function ResultCard({
  distro,
  onForge,
}: {
  distro: DistroDef;
  onForge: () => void;
}) {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-[#b026ff]/40 via-transparent to-[#56ffa8]/20 blur-xl opacity-60 pointer-events-none" />

      <div className="relative bg-[#121317] border border-white/10 rounded-3xl p-10 overflow-hidden">
        {/* Scanline texture */}
        <div className="absolute inset-0 terminal-scanline opacity-30 pointer-events-none" />

        {/* Badge */}
        <div className="flex items-center gap-3 mb-8">
          <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border font-mono ${distro.badgeColor}`}
          >
            {distro.badge}
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            Best match for your profile
          </span>
        </div>

        {/* Match percentage visual */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-8xl font-black text-gradient-primary font-[Space_Grotesk]">
              {distro.name}
            </span>
          </div>
          <p className="text-zinc-400 font-mono text-sm">{distro.tagline}</p>
        </div>

        <p className="text-zinc-300 text-base leading-relaxed mb-10 max-w-xl">
          {distro.description}
        </p>

        {/* Strengths */}
        <div className="mb-12">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono mb-4">
            Why it fits you
          </p>
          <ul className="space-y-3">
            {distro.strengths.map((s, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="w-5 h-5 rounded-full bg-[#56ffa8]/10 border border-[#56ffa8]/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={11} className="text-[#56ffa8]" />
                </span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onForge}
            className="btn-primary px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 group"
          >
            Build My {distro.name} ISO
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <Link
            href="/quiz"
            onClick={() => window.location.reload()}
            className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-400 text-sm font-semibold uppercase tracking-widest hover:border-white/30 hover:text-white transition-all text-center"
          >
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Quiz Client ─────────────────────────────────────────────────────────

export default function QuizClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [animDir, setAnimDir] = useState<"right" | "left">("right");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const question = questions[currentStep];
  const totalSteps = questions.length;
  const currentAnswers = answers[question?.id] ?? [];

  const handleSelect = (optId: string) => {
    if (!question) return;
    if (question.type === "single") {
      setAnswers((prev) => ({ ...prev, [question.id]: [optId] }));
    } else {
      setAnswers((prev) => {
        const existing = prev[question.id] ?? [];
        if (existing.includes(optId)) {
          return { ...prev, [question.id]: existing.filter((x) => x !== optId) };
        }
        return { ...prev, [question.id]: [...existing, optId] };
      });
    }
  };

  const canAdvance =
    question &&
    (answers[question.id] ?? []).length > 0;

  const handleNext = () => {
    if (!canAdvance) return;
    if (currentStep < totalSteps - 1) {
      setAnimDir("right");
      setCurrentStep((s) => s + 1);
    } else {
      const winner = computeResult(answers);
      setResult(winner);
      setFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setAnimDir("left");
      setCurrentStep((s) => s - 1);
    }
  };

  const handleForge = () => {
    if (!result) return;
    const distro = distros[result];
    router.push(`/forge?distro=${distro.forgeId}`);
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-[#0b0c10] text-[#e3e2e8]"
      suppressHydrationWarning
    >
      {/* ── Top Nav ── */}
      <nav
        className="fixed top-0 w-full z-50 bg-[#0b0c10]/80 backdrop-blur-xl border-b border-white/5"
        suppressHydrationWarning
      >
        <div className="flex justify-between items-center px-8 py-5 max-w-5xl mx-auto">
          <Link
            href="/"
            className="text-lg font-black tracking-tighter text-[#b026ff] hover:text-white transition-colors font-[Space_Grotesk]"
          >
            DistroForge
          </Link>
          {!finished && (
            <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
              <span>
                Question {currentStep + 1} of {totalSteps}
              </span>
              <div className="w-32">
                <ProgressBar current={currentStep + 1} total={totalSteps} />
              </div>
            </div>
          )}
          <Link
            href="/forge"
            className="text-xs text-zinc-400 hover:text-white transition font-mono uppercase tracking-widest"
          >
            Skip to Forge →
          </Link>
        </div>
      </nav>

      {/* ── Body ── */}
      <main className="pt-28 pb-24 px-4 max-w-3xl mx-auto">
        {!finished ? (
          <div key={`step-${currentStep}`}>
            {/* Category pill */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#b026ff] bg-[#b026ff]/10 px-3 py-1.5 rounded-full border border-[#b026ff]/20">
                {question.category}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Step {question.step} / {totalSteps}
              </span>
            </div>

            {/* Question */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 leading-tight font-[Space_Grotesk]">
              {question.question}
            </h1>
            {question.subtitle && (
              <p className="text-zinc-400 text-base mb-12">
                {question.subtitle}
              </p>
            )}
            {!question.subtitle && <div className="mb-12" />}

            {/* Options grid */}
            <div
              className={`grid gap-3 mb-12 ${
                question.options.length > 3
                  ? "sm:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {question.options.map((opt) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  selected={currentAnswers.includes(opt.id)}
                  onClick={() => handleSelect(opt.id)}
                />
              ))}
            </div>

            {/* Multi-select hint */}
            {question.type === "multi" && (
              <p className="text-xs text-zinc-400 font-mono mb-6">
                ✦ Select all that apply
              </p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all px-4 py-2 rounded-xl hover:bg-white/5"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canAdvance}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
                  canAdvance
                    ? "btn-primary"
                    : "bg-white/5 text-zinc-600 cursor-not-allowed"
                }`}
              >
                {currentStep === totalSteps - 1 ? "See My Match" : "Next"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* ── Result screen ── */
          <div>
            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#56ffa8] mb-4">
                Analysis complete
              </p>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4 font-[Space_Grotesk]">
                Your Perfect Match
              </h1>
              <p className="text-zinc-400 text-base max-w-md mx-auto">
                Based on your hardware, workflow, and personality — we've found
                your ideal Linux distribution.
              </p>
            </div>

            {result && (
              <ResultCard distro={distros[result]} onForge={handleForge} />
            )}

            {/* All scores preview */}
            <div className="mt-12 p-6 bg-[#1a1b20] rounded-2xl border border-white/5">
              <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest mb-5">
                Full compatibility breakdown
              </p>
              <div className="space-y-4">
                {Object.entries(distros).map(([key, d]) => {
                  // compute score for display
                  const scores: Record<string, number> = {
                    arch: 0,
                    fedora: 0,
                    ubuntu: 0,
                    mint: 0,
                  };
                  questions.forEach((q) => {
                    const sel = answers[q.id] ?? [];
                    q.options.forEach((opt) => {
                      if (sel.includes(opt.id) && opt.weight) {
                        Object.entries(opt.weight).forEach(([dist, pts]) => {
                          scores[dist] = (scores[dist] ?? 0) + pts;
                        });
                      }
                    });
                  });
                  const maxScore = Math.max(...Object.values(scores));
                  const pct = Math.round((scores[key] / maxScore) * 100);
                  const isWinner = key === result;

                  return (
                    <div key={key} className="flex items-center gap-4">
                      <span
                        className={`text-sm font-semibold w-28 shrink-0 ${
                          isWinner ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {d.name}
                      </span>
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isWinner
                              ? "bg-gradient-to-r from-[#e5b5ff] to-[#b026ff]"
                              : "bg-white/15"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-mono w-10 text-right ${
                          isWinner ? "text-[#b026ff]" : "text-zinc-600"
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
