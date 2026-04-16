"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { featureBlocks, navLinks } from "@/data/mockData";

// ---- HeroSection component ----
// Renders: Nav bar, hero headline + CTAs, feature block grid, and the quiz CTA section.
// Backend hook: The "Start the Forge" button should fire a wizard initialization API call.

export default function HeroSection() {
  return (
    <div className="min-h-screen hero-gradient-overlay">
      {/* ── Top Navigation ── */}
      <nav
        id="top-nav"
        className="fixed top-0 w-full z-50 bg-[#121317]/40 backdrop-blur-xl"
        suppressHydrationWarning
      >
        <div className="flex justify-between items-center px-12 py-6 max-w-[1920px] mx-auto">
          {/* Wordmark */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-white uppercase font-headline hover:text-primary transition-colors"
          >
            DistroForge
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex gap-12 font-label">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "text-primary font-bold border-b-2 border-primary pb-1 uppercase tracking-[0.2em] text-[10px] transition-colors"
                    : "text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <button
              id="nav-star-btn"
              aria-label="Star on GitHub"
              className="text-zinc-400 hover:text-primary transition-colors"
            >
              <Star size={20} />
            </button>
            <button
              id="nav-download-btn"
              className="btn-primary px-6 py-2 text-sm font-label font-bold rounded-[1rem]"
            >
              Download ISO
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="pt-32" suppressHydrationWarning>
        <section
          id="hero"
          className="max-w-6xl mx-auto px-6 py-24 text-center"
        >
          {/* Headline: 3.5rem-5.5rem fluid scale with tight tracking */}
          <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black tracking-tighter leading-tight mb-8 font-headline">
            The Ultimate <br />
            <span className="text-gradient-primary">Linux Experience.</span>
          </h1>

          <p className="text-zinc-400 text-xl max-w-2xl mx-auto mb-12 font-body leading-relaxed">
            Forge your perfect distribution with systemic elegance. No bloat,
            no friction. Just the pure power of Linux, tailored to your metal.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link
              id="hero-start-forge-btn"
              href="/forge/hardware"
              className="w-full md:w-auto btn-primary px-12 py-5 rounded-[1rem] text-lg font-bold flex items-center gap-3 justify-center"
            >
              Start the Forge
              <ArrowRight size={20} />
            </Link>
            <Link
              id="hero-browse-btn"
              href="/forge"
              className="w-full md:w-auto border border-white/20 text-primary px-12 py-5 rounded-[1rem] text-lg font-medium hover:bg-[#292a2e]/30 transition-all text-center"
            >
              Browse Forge
            </Link>
            <Link
              id="hero-quiz-btn"
              href="/quiz"
              className="w-full md:w-auto border border-[#56ffa8]/20 text-[#56ffa8] px-12 py-5 rounded-[1rem] text-lg font-medium hover:bg-[#56ffa8]/5 transition-all text-center"
            >
              ✦ Find My Distro
            </Link>
          </div>
        </section>

        {/* ── Feature blocks: asymmetric 2-col editorial layout ── */}
        <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-x-24 gap-y-32">
          {featureBlocks.map((block, i) => (
            <div
              key={block.title}
              // Stagger even items 24px down for editorial asymmetry
              className={`flex flex-col gap-6 ${i % 2 !== 0 ? "mt-12 md:mt-24" : ""}`}
            >
              <span
                className={`font-label tracking-[0.3em] uppercase text-xs ${
                  block.tagColor === "emerald"
                    ? "text-secondary-fixed"
                    : "text-primary"
                }`}
              >
                {block.tag}
              </span>
              <h2 className="text-4xl font-bold tracking-tight font-headline">
                {block.title}
              </h2>
              <p className="text-zinc-400 font-body text-lg leading-relaxed">
                {block.description}
              </p>
            </div>
          ))}
        </section>

        {/* ── Quiz CTA ── */}
        <section id="quiz" className="py-24 text-center">
          <div className="bg-[#1a1b20] p-16 max-w-4xl mx-auto rounded-[2rem]">
            <h3 className="text-3xl font-bold mb-8 font-headline">
              Ready to begin your journey?
            </h3>
            <a
              id="quiz-cta-btn"
              href="#"
              className="btn-primary font-label font-bold tracking-widest uppercase px-16 py-6 rounded-[1rem] inline-block"
            >
              Take the Quiz
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-zinc-950 py-24 border-t border-zinc-800/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1920px] mx-auto gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-zinc-300 font-headline uppercase tracking-tighter">
              DistroForge
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-label text-zinc-500">
              © 2024 DistroForge. Systemic Elegance.
            </span>
          </div>
          <div className="flex gap-12 font-label">
            {["Privacy Policy", "Terms of Service", "Security"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
