"use client";

import { useState } from "react";
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
              { label: "Gallery", href: "/" },
              { label: "Docs", href: "/" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-label text-sm uppercase tracking-widest transition-colors ${
                  link.active
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-[#343439] hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Search pill */}
          <div className="bg-[#292a2e] px-4 py-2 rounded-full flex items-center gap-3">
            <Search size={16} className="text-[#343439]" />
            <input
              id="forge-search"
              type="text"
              className="bg-transparent border-none focus:ring-0 text-sm w-48 text-[#e3e2e8] placeholder-[#343439]"
              placeholder="Search components..."
            />
          </div>
          <button
            id="forge-notifications-btn"
            className="hover:bg-[#292a2e] p-2 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-primary" />
          </button>
          <button
            id="forge-settings-btn"
            className="hover:bg-[#292a2e] p-2 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} className="text-primary" />
          </button>
          {/* User avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-primary/20 flex items-center justify-center text-white font-bold text-sm font-headline">
            R
          </div>
        </div>
      </nav>

      {/* ── Left Sidebar (Build Wizard) ── */}
      <aside
        id="forge-left-sidebar"
        className="fixed left-0 top-20 h-[calc(100vh-5rem)] flex flex-col py-8 overflow-y-auto w-64 bg-[#1a1b20]"
        suppressHydrationWarning
      >
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
              className="absolute top-0 left-0 h-full bg-secondary-container rounded-full shadow-green-glow transition-all duration-500"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col space-y-1">
          {wizardNav.map(({ id, label, Icon }) => {
            const isActive = id === activeStep;
            // Map wizard steps to routes
            const stepRoute = id === "core" ? "/forge/hardware" : "/forge";

            return (
              <Link
                key={id}
                id={`wizard-nav-${id}`}
                href={stepRoute}
                className={`flex items-center space-x-4 px-4 py-3 mx-2 rounded-full transition-all font-label text-xs uppercase tracking-widest font-bold ${
                  isActive
                    ? "bg-secondary-container text-[#121317] shadow-green-glow"
                    : "text-[#343439] hover:text-primary"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Review button at bottom of left sidebar */}
        <div className="mt-auto px-4 space-y-2">
          <button
            id="forge-review-btn"
            onClick={handleNavigateToReview}
            className="w-full py-4 rounded-full btn-primary font-headline font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
          >
            Review &amp; Forge →
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        className="ml-64 mr-80 pt-28 pb-12 px-12 min-h-screen"
        suppressHydrationWarning
      >
        {/* Step progress dots */}
        <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto">
          <div className="flex-1 h-1 bg-[#292a2e] relative">
            {/* Filled portion: 75% (step 4 of 5) */}
            <div className="absolute top-0 left-0 h-full w-[75%] bg-secondary-container shadow-green-glow" />
            {[0, 25, 50, 75, 100].map((pos, i) => {
              const isDone = i < 3;
              const isActive = i === 3;
              return (
                <div
                  key={pos}
                  className={`absolute -top-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-label font-bold transition-all ${
                    isDone
                      ? "bg-[#292a2e] border-2 border-secondary-container text-secondary-container"
                      : isActive
                      ? "bg-[#121317] border-2 border-secondary-container text-secondary-container shadow-green-glow shadow-lg"
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

      {/* ── Right: Build Cart ── */}
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
  );
}
