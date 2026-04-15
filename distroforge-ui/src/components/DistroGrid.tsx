"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Layers,
  LayoutGrid,
  Grid,
  Mouse,
  Plus,
  Search,
} from "lucide-react";
import {
  desktopEnvironments,
  softwarePackages,
  packageCategories,
  type SoftwarePackage,
} from "@/data/mockData";

// ---- DistroGrid component ----
// Renders: category tabs, desktop environment cards (4-col), software packages grid (3-col).
// Backend hook: Selected IDs should be sent to /api/forge/packages as a POST.

export interface DistroGridProps {
  readonly selectedDesktop: string;
  readonly selectedPackages: string[];
  readonly onDesktopChange?: (desktopId: string) => void;
  readonly onSelectionChange?: (selected: string[]) => void;
}

// Map icon string names to lucide components
const deIcon = (icon: string) => {
  const map: Record<string, React.ElementType> = {
    Layers,
    LayoutGrid,
    Grid,
    Mouse,
  };
  const Icon = map[icon] ?? Layers;
  return <Icon size={36} className="text-primary" />;
};

// Package icon avatar — renders a colored circle with initial letter
function PkgIcon({
  name,
  bg,
}: Readonly<{ name: string; bg: string }>) {
  return (
    <div
      className="w-14 h-14 rounded-[1rem] flex items-center justify-center text-white text-xl font-bold font-headline border border-white/10 shadow-inner"
      style={{ backgroundColor: bg }}
    >
      {name[0]}
    </div>
  );
}

export default function DistroGrid({
  selectedDesktop,
  selectedPackages,
  onDesktopChange,
  onSelectionChange,
}: DistroGridProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTogglePackage = (pkg: SoftwarePackage) => {
    let next: string[];
    if (selectedPackages.includes(pkg.id)) {
      next = selectedPackages.filter((p) => p !== pkg.id);
    } else {
      next = [...selectedPackages, pkg.id];
    }
    onSelectionChange?.(next);
  };

  const filteredPackages = softwarePackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* ── Category Tabs ── */}
      <div className="flex gap-8 mb-10 border-b border-[#4f4255]/10 pb-4 overflow-x-auto">
        {packageCategories.map((cat, i) => (
          <button
            key={cat}
            id={`tab-${cat.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => setActiveTab(i)}
            className={`font-label text-sm uppercase tracking-widest whitespace-nowrap pb-4 transition-colors ${
              activeTab === i
                ? "text-secondary-container border-b-2 border-secondary-container"
                : "text-[#d2c1d7] hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Desktop Environments: 4-col card grid ── */}
      <section id="desktop-envs-section" className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {desktopEnvironments.map((de) => {
            const isSelected = selectedDesktop === de.id;
            return (
              <div
                key={de.id}
                id={`de-card-${de.id}`}
                className={`glass-card p-6 rounded-[1rem] group hover:border-primary/40 transition-all flex flex-col items-center text-center relative overflow-hidden cursor-pointer ${
                  isSelected ? "border-primary shadow-primary-md" : ""
                }`}
                onClick={() => onDesktopChange?.(de.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onDesktopChange?.(de.id)}
              >
                {/* Size badge */}
                <div className="absolute top-0 right-0 p-4 font-label text-[10px] text-primary bg-primary/10 rounded-bl-[1rem] font-bold">
                  +{de.sizeMb} MB
                </div>

                {/* Icon container */}
                <div
                  className={`w-20 h-20 mb-6 rounded-[1rem] flex items-center justify-center ${
                    isSelected
                      ? "bg-primary"
                      : "bg-gradient-to-tr from-[#292a2e] to-primary/10"
                  }`}
                >
                  {isSelected ? (
                    <div className="text-[#4e0078]">{deIcon(de.icon)}</div>
                  ) : (
                    deIcon(de.icon)
                  )}
                </div>

                <h3 className="font-headline font-bold text-xl mb-2">
                  {de.name}
                </h3>
                <p className="text-xs text-[#d2c1d7] mb-6 leading-relaxed">
                  {de.description}
                </p>

                {/* Select button */}
                <button
                  id={`de-select-${de.id}`}
                  className={`w-full py-2 rounded-full font-label text-xs uppercase tracking-widest font-bold transition-all ${
                    isSelected
                      ? "bg-primary text-[#4e0078]"
                      : "border border-[#4f4255] text-[#e3e2e8] group-hover:bg-primary group-hover:text-[#4e0078]"
                  }`}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} /> Selected
                    </span>
                  ) : (
                    "Select"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Software Packages: 3-col list grid ── */}
      <section id="packages-section">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline font-bold text-3xl tracking-tight">
            Software Packages
          </h2>
          <div className="h-px flex-1 bg-[#4f4255]/10 mx-8" />

          {/* Search */}
          <div className="relative group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d2c1d7] group-focus-within:text-primary transition-colors"
            />
            <input
              id="pkg-search"
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1b20] border border-[#4f4255]/20 rounded-full py-2 pl-10 pr-4 text-sm font-label focus:border-primary/50 focus:ring-0 w-64 transition-all text-[#e3e2e8] placeholder-[#9b8ba1]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPackages.map((pkg) => {
            const isSelected = selectedPackages.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                id={`pkg-card-${pkg.id}`}
                className="bg-[#1a1b20] p-4 rounded-[1rem] flex items-center gap-5 hover:bg-[#292a2e] transition-all border border-[#4f4255]/10 hover:border-primary/30 group shadow-lg shadow-black/20"
              >
                <PkgIcon name={pkg.name} bg={pkg.iconBg} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-headline font-bold text-sm truncate">
                      {pkg.name}
                    </h4>
                    <span className="font-label text-[10px] text-[#d2c1d7] bg-[#343439] px-2 py-0.5 rounded shrink-0 ml-2">
                      +{pkg.sizeMb}MB
                    </span>
                  </div>
                  <p className="text-xs text-[#d2c1d7]">{pkg.description}</p>
                </div>

                {/* Toggle button */}
                <button
                  id={`pkg-toggle-${pkg.id}`}
                  onClick={() => handleTogglePackage(pkg)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? "Remove" : "Add"} ${pkg.name}`}
                  className={`p-2 rounded-full transition-colors shrink-0 ${
                    isSelected
                      ? "bg-secondary-container text-[#007243]"
                      : "bg-secondary-container/10 text-secondary-container hover:bg-secondary-container hover:text-[#007243]"
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Next action */}
        <div className="mt-12 flex justify-end">
          <button
            id="packages-next-btn"
            className="btn-primary px-10 py-4 rounded-[1rem] font-bold text-sm font-label tracking-widest uppercase flex items-center gap-3"
          >
            Next: Final Review
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
