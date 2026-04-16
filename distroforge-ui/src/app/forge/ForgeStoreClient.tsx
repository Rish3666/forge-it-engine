"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Terminal,
  Monitor,
  Rocket,
  ShoppingCart,
  Search,
  Bell,
  Settings,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  LogOut,
  Moon,
  Palette,
  Shield,
  Zap,
  GitBranch,
} from "lucide-react";
import DistroGrid from "@/components/DistroGrid";
import BuildCartSidebar from "@/components/BuildCartSidebar";
import {
  desktopEnvironments,
  softwarePackages,
  distroOptions,
  type BuildCartItem,
} from "@/data/mockData";

// Wizard step sidebar config
const wizardNav = [
  { id: "core", label: "Core Base", Icon: Cpu },
  { id: "kernel", label: "Kernel", Icon: Terminal },
  { id: "drivers", label: "Drivers", Icon: Monitor },
  { id: "store", label: "Linux Store", Icon: ShoppingCart },
  { id: "finalize", label: "Finalize", Icon: Rocket },
];

export default function ForgeStoreClient() {
  const router = useRouter();
  const activeStep = "store";
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, icon: GitBranch, color: "#16ff9e", title: "Build pipeline ready", sub: "Your last build finished — 2 min ago" },
    { id: 2, icon: Zap, color: "#e5b5ff", title: "Kernel update available", sub: "Linux 6.14 is now supported" },
    { id: 3, icon: Shield, color: "#ffb4ab", title: "Security advisory", sub: "1 driver has a known CVE" },
  ]);
  const navRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns when clicking outside the nav
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
        setSettingsOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [selectedDistro, setSelectedDistro] = useState("arch");
  const [selectedDesktop, setSelectedDesktop] = useState("gnome");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([
    "discord",
    "firefox",
  ]);

  const selectedDistroData =
    distroOptions.find((d) => d.id === selectedDistro) ?? distroOptions[0];
  const selectedDesktopData =
    desktopEnvironments.find((desktop) => desktop.id === selectedDesktop) ??
    desktopEnvironments[0];
  const selectedPackageItems = selectedPackages
    .map((pkgId) => softwarePackages.find((pkg) => pkg.id === pkgId))
    .filter((pkg): pkg is (typeof softwarePackages)[number] => Boolean(pkg));
  const cartItems: BuildCartItem[] = [
    {
      id: "base",
      label: "Base Foundation",
      name: selectedDistroData.name,
      sizeMb: selectedDistroData.sizeMb,
      isBase: true,
    },
    {
      id: selectedDesktopData.id,
      label: "User Interface",
      name: selectedDesktopData.name,
      sizeMb: selectedDesktopData.sizeMb,
      isBase: true,
    },
    ...selectedPackageItems.map((pkg) => ({
      id: pkg.id,
      label: "Package",
      name: pkg.name,
      sizeMb: pkg.sizeMb,
    })),
  ];

  const handleNavigateToReview = () => {
    const params = new URLSearchParams({
      distro: selectedDistro,
      desktop: selectedDesktop,
      packages: selectedPackages.join(","),
      gpu: "Auto-Detected",
      ram: "16GB DDR4",
      cpu: "Generic x86_64",
    });
    router.push(`/forge/review?${params.toString()}`);
  };

  return (
    <div
      className="min-h-screen bg-[#121317] text-[#e3e2e8] font-body"
      suppressHydrationWarning
    >
      {/* ── Top Nav ── */}
      <nav
        id="forge-top-nav"
        className="fixed top-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-[#121317]"
        suppressHydrationWarning
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-primary font-headline hover:text-white transition-colors"
          >
            Cybernetic Forge
          </Link>
          <div className="hidden md:flex space-x-6">
            {[
              { label: "Dashboard", href: "/" },
              { label: "Forge", href: "/forge", active: true },
              { label: "Gallery", href: "/gallery" },
              { label: "Docs", href: "/docs" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-label text-sm uppercase tracking-widest transition-colors ${
                  link.active
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-[#9a9aa8] hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4" ref={navRef}>
          {/* ── Notifications ── */}
          <div className="relative">
            <button
              id="forge-notifications-btn"
              onClick={() => { setNotifOpen(o => !o); setSettingsOpen(false); setProfileOpen(false); }}
              className={`p-2 rounded-full transition-colors relative ${
                notifOpen ? "bg-[#292a2e]" : "hover:bg-[#292a2e]"
              }`}
              aria-label="Notifications"
            >
              <Bell size={20} className="text-primary" />
              {/* unread dot */}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#16ff9e] rounded-full border border-[#121317]" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#1a1b20] border border-white/10 rounded-[1.25rem] shadow-2xl shadow-black/40 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <span className="font-headline font-bold text-sm">Notifications</span>
                  <button onClick={() => setNotifOpen(false)} className="text-[#9a9aa8] hover:text-white"><X size={14} /></button>
                </div>
                {notifications.length > 0 ? (
                  <ul className="divide-y divide-white/5">
                    {notifications.map(({ id, icon: Icon, color, title, sub }) => (
                      <li key={id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                          <Icon size={14} style={{ color }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#e3e2e8]">{title}</p>
                          <p className="text-xs text-[#9a9aa8] mt-0.5">{sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm text-[#9a9aa8]">No new notifications.</p>
                  </div>
                )}
                {notifications.length > 0 && (
                  <div className="px-5 py-3 border-t border-white/5">
                    <button onClick={() => setNotifications([])} className="text-xs font-label uppercase tracking-widest text-[#e5b5ff] hover:text-white transition-colors">Mark all as read</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Settings ── */}
          <div className="relative">
            <button
              id="forge-settings-btn"
              onClick={() => { setSettingsOpen(o => !o); setNotifOpen(false); setProfileOpen(false); }}
              className={`p-2 rounded-full transition-colors ${
                settingsOpen ? "bg-[#292a2e]" : "hover:bg-[#292a2e]"
              }`}
              aria-label="Settings"
            >
              <Settings size={20} className={settingsOpen ? "text-white" : "text-primary"} />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 top-12 w-72 bg-[#1a1b20] border border-white/10 rounded-[1.25rem] shadow-2xl shadow-black/40 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <span className="font-headline font-bold text-sm">Settings</span>
                  <button onClick={() => setSettingsOpen(false)} className="text-[#9a9aa8] hover:text-white"><X size={14} /></button>
                </div>
                <ul className="py-2">
                  {[
                    { Icon: Moon,    label: "Dark Mode",       sub: "Always on",   toggle: true },
                    { Icon: Palette, label: "Accent Color",    sub: "Neon Purple",  toggle: false },
                    { Icon: Zap,     label: "Turbopack",       sub: "Enabled",     toggle: true },
                    { Icon: Shield,  label: "Build Sandboxing",sub: "Enabled",     toggle: true },
                  ].map(({ Icon, label, sub, toggle }) => (
                    <li key={label} className="flex items-center justify-between px-5 py-3 hover:bg-white/5 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon size={16} className="text-[#9a9aa8]" />
                        <div>
                          <p className="text-sm font-bold text-[#e3e2e8]">{label}</p>
                          <p className="text-xs text-[#9a9aa8]">{sub}</p>
                        </div>
                      </div>
                      {toggle && (
                        <div className="w-9 h-5 rounded-full bg-[#16ff9e]/80 flex items-center px-0.5">
                          <div className="w-4 h-4 rounded-full bg-[#0d0e12] ml-auto" />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Profile ── */}
          <div className="relative">
            <button
              id="forge-profile-btn"
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setSettingsOpen(false); }}
              className={`w-10 h-10 rounded-full bg-primary-container border-2 flex items-center justify-center text-white font-bold text-sm font-headline transition-all ${
                profileOpen ? "border-primary scale-95" : "border-primary/20 hover:border-primary/60"
              }`}
            >
              R
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 bg-[#1a1b20] border border-white/10 rounded-[1.25rem] shadow-2xl shadow-black/40 z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <p className="font-headline font-bold text-[#e3e2e8]">Rish</p>
                  <p className="text-xs text-[#9a9aa8] mt-0.5">rish@forgeit.dev</p>
                </div>
                <ul className="py-2">
                  {[
                    { Icon: User,   label: "My Profile",   href: "/" },
                    { Icon: GitBranch, label: "My Builds", href: "/" },
                    { Icon: Settings, label: "Account",   href: "/" },
                  ].map(({ Icon, label, href }) => (
                    <li key={label}>
                      <Link href={href} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
                        <Icon size={15} className="text-[#9a9aa8]" />
                        <span className="text-sm text-[#e3e2e8]">{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/5 py-2">
                  <button className="flex items-center gap-3 px-5 py-3 hover:bg-[#ffb4ab]/10 transition-colors w-full text-left">
                    <LogOut size={15} className="text-[#ffb4ab]" />
                    <span className="text-sm text-[#ffb4ab]">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Left Sidebar (Build Wizard) ── */}
      <aside
        id="forge-left-sidebar"
        style={{ width: leftOpen ? "16rem" : "0px" }}
        className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#1a1b20] transition-all duration-300 z-40"
        suppressHydrationWarning
      >
        <div className="w-64 flex flex-col h-full overflow-y-auto py-8">
          <div className="px-6 mb-8">
            <h2 className="font-headline font-bold text-[#e3e2e8]">
              Build Wizard
            </h2>
            <p className="font-label text-xs uppercase tracking-widest text-primary/60">
              Step 4 of 5
            </p>
          </div>

          {/* Progress bar */}
          <div className="px-6 mb-6">
            <div className="h-1 bg-[#292a2e] rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-[#16ff9e] rounded-full transition-all duration-500"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          {/* Nav items */}
          <div className="flex flex-col space-y-1">
            {wizardNav.map(({ id, label, Icon }) => {
              const isActive = id === activeStep;
              const stepRoutes: Record<string, string> = {
                core: "/forge/hardware",
                kernel: "/forge/kernel",
                drivers: "/forge/drivers",
                store: "/forge",
                finalize: "/forge/review",
              };
              const stepRoute = stepRoutes[id] ?? "/forge";
              return (
                <Link
                  key={id}
                  id={`wizard-nav-${id}`}
                  href={stepRoute}
                  className={`flex items-center space-x-4 px-4 py-3 mx-2 rounded-full transition-all font-label text-xs uppercase tracking-widest font-bold whitespace-nowrap ${
                    isActive
                      ? "bg-[#16ff9e] text-[#0d0e12] shadow-[0_0_20px_rgba(22,255,158,0.35)]"
                      : "text-[#9a9aa8] hover:text-[#16ff9e]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Review button at bottom */}
          <div className="mt-auto px-4">
            <button
              id="forge-review-btn"
              onClick={handleNavigateToReview}
              className="w-full py-4 rounded-full btn-primary font-headline font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Review &amp; Forge →
            </button>
          </div>
        </div>
      </aside>

      {/* ── Left Toggle Tab ── */}
      <button
        id="left-sidebar-toggle"
        onClick={() => setLeftOpen((o) => !o)}
        aria-label={leftOpen ? "Collapse sidebar" : "Expand sidebar"}
        style={{ left: leftOpen ? "16rem" : "0px" }}
        className="fixed top-1/2 -translate-y-1/2 z-50 w-5 h-16 bg-[#1a1b20] hover:bg-[#16ff9e]/20 border-y border-r border-white/10 hover:border-[#16ff9e]/40 rounded-r-lg flex items-center justify-center transition-all duration-300 group"
      >
        {leftOpen
          ? <ChevronLeft size={14} className="text-[#9a9aa8] group-hover:text-[#16ff9e]" />
          : <ChevronRight size={14} className="text-[#9a9aa8] group-hover:text-[#16ff9e]" />
        }
      </button>

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: leftOpen ? "16rem" : "0px",
          marginRight: rightOpen ? "20rem" : "0px",
        }}
        className="pt-28 pb-12 px-12 min-h-screen transition-all duration-300"
        suppressHydrationWarning
      >
        {/* Step progress dots */}
        <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto">
          <div className="flex-1 h-1 bg-[#292a2e] relative">
            <div className="absolute top-0 left-0 h-full w-[75%] bg-[#16ff9e]" />
            {[0, 25, 50, 75, 100].map((pos, i) => {
              const isDone = i < 3;
              const isActive = i === 3;
              return (
                <div
                  key={pos}
                  className={`absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-label font-bold transition-all ${
                    isDone
                      ? "bg-[#292a2e] border-2 border-[#16ff9e] text-[#16ff9e]"
                      : isActive
                      ? "bg-[#121317] border-2 border-[#16ff9e] text-[#16ff9e] shadow-[0_0_12px_rgba(22,255,158,0.4)]"
                      : "bg-[#292a2e] border-2 border-[#4f4255] text-[#4f4255]"
                  }`}
                  style={{ left: `calc(${pos}% - 16px)` }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Page header */}
        <header className="mb-12">
          <h1 className="text-6xl font-black font-headline tracking-tighter mb-4 text-[#e3e2e8]">
            Linux Store
          </h1>
          <p className="text-[#d2c1d7] max-w-2xl text-lg leading-relaxed">
            Select your visual environment and toolsets. Each addition is
            optimized for the forge kernel.
          </p>
        </header>

        {/* Distro Selection Section */}
        <section id="distro-selection" className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline font-bold text-2xl text-white">
              1. Choose Base Distro
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {distroOptions.map((distro) => {
              const isActive = selectedDistro === distro.id;
              return (
                <button
                  key={distro.id}
                  onClick={() => setSelectedDistro(distro.id)}
                  className={`p-6 rounded-[1.5rem] border-2 text-left transition-all ${
                    isActive
                      ? "bg-primary/10 border-primary shadow-primary-md"
                      : "bg-[#1a1b20] border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                        isActive ? "bg-primary text-black" : "bg-white/5"
                      }`}
                    >
                      {distro.name[0]}
                    </div>
                    {isActive && (
                      <CheckCircle2 size={20} className="text-primary" />
                    )}
                  </div>
                  <h3 className="font-headline font-bold text-lg mb-1">
                    {distro.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{distro.tagline}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid: desktop environments + packages */}
        <DistroGrid
          selectedDesktop={selectedDesktop}
          selectedPackages={selectedPackages}
          onDesktopChange={setSelectedDesktop}
          onSelectionChange={setSelectedPackages}
        />
      </main>

      {/* ── Right Toggle Tab ── */}
      <button
        id="right-sidebar-toggle"
        onClick={() => setRightOpen((o) => !o)}
        aria-label={rightOpen ? "Collapse cart" : "Expand cart"}
        style={{ right: rightOpen ? "20rem" : "0px" }}
        className="fixed top-1/2 -translate-y-1/2 z-50 w-5 h-16 bg-[#1a1b20] hover:bg-[#e5b5ff]/20 border-y border-l border-white/10 hover:border-[#e5b5ff]/40 rounded-l-lg flex items-center justify-center transition-all duration-300 group"
      >
        {rightOpen
          ? <ChevronRight size={14} className="text-[#9a9aa8] group-hover:text-[#e5b5ff]" />
          : <ChevronLeft size={14} className="text-[#9a9aa8] group-hover:text-[#e5b5ff]" />
        }
      </button>

      {/* ── Right: Build Cart ── */}
      <div
        style={{ width: rightOpen ? "20rem" : "0px" }}
        className="fixed right-0 top-20 h-[calc(100vh-5rem)] overflow-hidden transition-all duration-300 z-40"
      >
        <BuildCartSidebar
          items={cartItems}
          onNext={handleNavigateToReview}
          onExport={() => console.log("Export config JSON")}
          onClearAll={() => setSelectedPackages([])}
          onRemoveItem={(id) =>
            setSelectedPackages((prev) => prev.filter((pkgId) => pkgId !== id))
          }
        />
      </div>
    </div>
  );
}
