"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Terminal, Monitor, Rocket, ShoppingCart, ArrowRight, ArrowLeft, Zap, Shield, Layers } from "lucide-react";

const wizardNav = [
  { id: "core", label: "Core Base", Icon: Cpu, href: "/forge/hardware" },
  { id: "kernel", label: "Kernel", Icon: Terminal, href: "/forge/kernel" },
  { id: "drivers", label: "Drivers", Icon: Monitor, href: "/forge/drivers" },
  { id: "store", label: "Linux Store", Icon: ShoppingCart, href: "/forge" },
  { id: "finalize", label: "Finalize", Icon: Rocket, href: "/forge/review" },
];

const kernelOptions = [
  {
    id: "lts",
    name: "Linux LTS",
    version: "6.6 LTS",
    tag: "Recommended",
    tagColor: "#16ff9e",
    description: "Long-term support kernel. Rock-solid stability with 2-year support cycle. Perfect for most users.",
    icon: Shield,
  },
  {
    id: "zen",
    name: "Linux Zen",
    version: "6.12 Zen",
    tag: "Performance",
    tagColor: "#e5b5ff",
    description: "Community-tuned kernel with desktop-first optimizations. Lower latency, higher responsiveness.",
    icon: Zap,
  },
  {
    id: "hardened",
    name: "Linux Hardened",
    version: "6.12 Hardened",
    tag: "Security",
    tagColor: "#ffb4ab",
    description: "Security-focused kernel with stronger hardening patches. Ideal for privacy-conscious users.",
    icon: Shield,
  },
  {
    id: "mainline",
    name: "Linux Mainline",
    version: "6.14",
    tag: "Bleeding Edge",
    tagColor: "#bdc7d9",
    description: "Latest upstream kernel. Access to the newest features and hardware support.",
    icon: Layers,
  },
];

export default function KernelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#121317] text-[#e3e2e8] font-body">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-[#121317]">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#e5b5ff] font-headline hover:text-white transition-colors">
          Cybernetic Forge
        </Link>
        <div className="hidden md:flex space-x-6">
          {[{ label: "Dashboard", href: "/" }, { label: "Forge", href: "/forge", active: true }, { label: "Gallery", href: "/" }, { label: "Docs", href: "/" }].map((link) => (
            <Link key={link.label} href={link.href}
              className={`font-label text-sm uppercase tracking-widest transition-colors ${link.active ? "text-[#e5b5ff] border-b-2 border-[#e5b5ff] pb-1" : "text-[#9a9aa8] hover:text-[#e5b5ff]"}`}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Left Sidebar */}
      <aside className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex flex-col py-8 overflow-y-auto w-64 bg-[#1a1b20]">
        <div className="px-6 mb-8">
          <h2 className="font-headline font-bold text-[#e3e2e8]">Build Wizard</h2>
          <p className="font-label text-xs uppercase tracking-widest text-[#e5b5ff]/60">Step 2 of 5</p>
        </div>
        <div className="px-6 mb-6">
          <div className="h-1 bg-[#292a2e] rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#16ff9e] rounded-full transition-all duration-500" style={{ width: "40%" }} />
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          {wizardNav.map(({ id, label, Icon, href }) => {
            const isActive = id === "kernel";
            return (
              <Link key={id} href={href}
                className={`flex items-center space-x-4 px-4 py-3 mx-2 rounded-full transition-all font-label text-xs uppercase tracking-widest font-bold ${
                  isActive ? "bg-[#16ff9e] text-[#0d0e12] shadow-[0_0_20px_rgba(22,255,158,0.35)]" : "text-[#9a9aa8] hover:text-[#16ff9e]"
                }`}>
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto px-4 space-y-2">
          <button onClick={() => router.push("/forge")}
            className="w-full py-4 rounded-full btn-primary font-headline font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            Review &amp; Forge →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-28 pb-12 px-12 min-h-screen max-w-4xl">
        <header className="mb-12">
          <h1 className="text-6xl font-black font-headline tracking-tighter mb-4 text-[#e3e2e8]">Kernel</h1>
          <p className="text-[#d2c1d7] text-lg leading-relaxed">
            Choose the kernel that powers your forge. Each variant is tuned for a different goal.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {kernelOptions.map((kernel) => {
            const Icon = kernel.icon;
            const isRecommended = kernel.id === "lts";
            return (
              <div key={kernel.id}
                className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all ${isRecommended ? "bg-[#16ff9e]/10 border-[#16ff9e] shadow-[0_0_20px_rgba(22,255,158,0.15)]" : "bg-[#1a1b20] border-white/5 hover:border-white/20"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isRecommended ? "bg-[#16ff9e] text-[#0d0e12]" : "bg-white/5 text-[#9a9aa8]"}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-label text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full" style={{ color: kernel.tagColor, backgroundColor: `${kernel.tagColor}18` }}>
                    {kernel.tag}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg mb-1">{kernel.name}</h3>
                <p className="text-xs font-mono text-[#9a9aa8] mb-3">{kernel.version}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{kernel.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.push("/forge/hardware")}
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-[#9a9aa8] hover:text-white hover:border-white/30 transition-all font-label font-bold uppercase tracking-widest text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={() => router.push("/forge/drivers")}
            className="flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-label font-bold uppercase tracking-widest text-sm">
            Next: Drivers <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
