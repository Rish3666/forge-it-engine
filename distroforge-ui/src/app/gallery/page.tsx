"use client";

import Link from "next/link";
import { ArrowRight, Star, Cpu, HardDrive, MemoryStick, Monitor, ChevronRight } from "lucide-react";
import { distroCards } from "@/data/mockData";

const difficultyColors: Record<string, { bg: string; text: string }> = {
  emerald:  { bg: "rgba(22,255,158,0.12)", text: "#16ff9e" },
  fuchsia:  { bg: "rgba(229,181,255,0.12)", text: "#e5b5ff" },
  red:      { bg: "rgba(255,180,171,0.12)", text: "#ffb4ab" },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#121317] text-[#e3e2e8] font-body">
      {/* ── Top Nav ── */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-[#121317]/80 backdrop-blur-xl border-b border-white/5">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#e5b5ff] font-headline hover:text-white transition-colors">
          Cybernetic Forge
        </Link>
        <div className="hidden md:flex space-x-8">
          {[
            { label: "Dashboard", href: "/" },
            { label: "Forge",     href: "/forge" },
            { label: "Gallery",   href: "/gallery", active: true },
            { label: "Docs",      href: "/docs" },
          ].map((link) => (
            <Link key={link.label} href={link.href}
              className={`font-label text-sm uppercase tracking-widest transition-colors ${
                link.active
                  ? "text-[#e5b5ff] border-b-2 border-[#e5b5ff] pb-1"
                  : "text-[#9a9aa8] hover:text-[#e5b5ff]"
              }`}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/forge/hardware"
          className="btn-primary px-6 py-2 text-sm font-label font-bold rounded-[1rem] flex items-center gap-2">
          Start Forge <ArrowRight size={16} />
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-40 pb-20 px-12 max-w-7xl mx-auto">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-[#16ff9e] mb-4">Distro Gallery</p>
        <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black font-headline tracking-tighter leading-tight mb-6">
          Find Your Perfect<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5b5ff] to-[#b026ff]">Linux Distribution.</span>
        </h1>
        <p className="text-[#9a9aa8] text-lg max-w-2xl leading-relaxed">
          Browse our curated collection of Linux distros. Each is benchmarked, categorised, and matched to your hardware profile.
        </p>
      </section>

      {/* ── Distro Cards Grid ── */}
      <section className="px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {distroCards.map((distro) => {
            const diff = difficultyColors[distro.difficultyColor];
            return (
              <article key={distro.id}
                className="bg-[#1a1b20] border border-white/5 rounded-[2rem] p-8 hover:border-[#e5b5ff]/30 hover:shadow-[0_0_40px_rgba(229,181,255,0.06)] transition-all group">

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-[1rem] bg-gradient-to-br from-[#292a2e] to-[#e5b5ff]/10 flex items-center justify-center text-2xl font-black font-headline text-[#e5b5ff] border border-white/5">
                      {distro.name[0]}
                    </div>
                    <div>
                      <h2 className="font-headline font-bold text-xl text-white">{distro.name}</h2>
                      <p className="text-xs text-[#9a9aa8] font-label">{distro.tagline}</p>
                    </div>
                  </div>

                  {/* Match + Difficulty badges */}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl font-black font-headline text-[#16ff9e]">{distro.matchPercent}%</span>
                    <span className="font-label text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: diff.bg, color: diff.text }}>
                      {distro.difficulty}
                    </span>
                  </div>
                </div>

                {/* Match bar */}
                <div className="h-1 bg-[#292a2e] rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#16ff9e] to-[#e5b5ff] rounded-full transition-all duration-700"
                    style={{ width: `${distro.matchPercent}%` }} />
                </div>

                {/* Use case / release model tags */}
                <div className="flex gap-3 mb-6 flex-wrap">
                  {[distro.useCase, distro.releaseModel].map((tag) => (
                    <span key={tag} className="font-label text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 text-[#9a9aa8]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Audience description */}
                <p className="text-sm text-[#9a9aa8] leading-relaxed mb-6">{distro.audience}</p>

                {/* System requirements */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { Icon: MemoryStick, label: "RAM",     value: distro.minRam },
                    { Icon: HardDrive,   label: "Storage", value: distro.storage },
                    { Icon: Cpu,         label: "CPU",     value: distro.cpu },
                    { Icon: Monitor,     label: "GPU",     value: distro.gpu },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="bg-[#121317] rounded-[1rem] p-3 flex items-center gap-3 border border-white/5">
                      <Icon size={14} className="text-[#e5b5ff] shrink-0" />
                      <div>
                        <p className="font-label text-[9px] uppercase tracking-widest text-[#9a9aa8]">{label}</p>
                        <p className="font-headline font-bold text-xs text-white truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature list */}
                <ul className="space-y-2 mb-8">
                  {distro.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#9a9aa8]">
                      <Star size={12} className="text-[#16ff9e] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/forge/hardware"
                  className="flex items-center justify-between px-6 py-4 rounded-[1rem] bg-white/5 hover:bg-[#e5b5ff]/10 border border-white/5 hover:border-[#e5b5ff]/30 transition-all group/btn">
                  <span className="font-label font-bold text-sm uppercase tracking-widest text-[#e5b5ff]">
                    Forge with {distro.name}
                  </span>
                  <ChevronRight size={16} className="text-[#e5b5ff] group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
