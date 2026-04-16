"use client";

import { CheckCircle2, Download, Trash2, ArrowRight } from "lucide-react";
import { type BuildCartItem } from "@/data/mockData";

// ---- BuildCartSidebar component ----
// Renders: sticky right-side receipt with live manifest and size tracker.
// Backend hook: "Next" should trigger a POST to /api/forge/manifest with the item IDs.
//              "Export Config" should call a GET /api/forge/config to download the JSON.
//              "Clear All" should reset the forge session.

export interface BuildCartSidebarProps {
  readonly items: BuildCartItem[];
  readonly onNext?: () => void;
  readonly onExport?: () => void;
  readonly onClearAll?: () => void;
  readonly onRemoveItem?: (id: string) => void;
}

function formatSize(mb: number): string {
  if (mb >= 1000) return `${(mb / 1000).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function BuildCartSidebar({
  items,
  onNext,
  onExport,
  onClearAll,
  onRemoveItem,
}: BuildCartSidebarProps) {
  const handleRemoveItem = (id: string) => {
    onRemoveItem?.(id);
  };

  const handleClearAll = () => {
    onClearAll?.();
  };

  const totalMb = items.reduce((sum, item) => sum + item.sizeMb, 0);
  const compressedMb = Math.round(totalMb * 0.4); // ~40% compression estimate

  const baseItems = items.filter((item) => item.isBase);
  const packageItems = items.filter((item) => !item.isBase);

  return (
    <aside
      id="build-cart-sidebar"
      className="w-80 h-full flex flex-col p-6 border-l border-[#343439]/15 bg-[#1a1b20] overflow-y-auto"
    >
      {/* ── Header ── */}
      <div className="mb-8">
        <h2 className="font-headline font-bold text-xl text-[#e3e2e8]">
          Your Custom Build
        </h2>
        <p className="font-label text-xs uppercase tracking-widest text-primary/60">
          Live manifest
        </p>
      </div>

      {/* ── Receipt card ── */}
      <div className="glass-card flex-1 p-6 rounded-[1rem] overflow-y-auto mb-6 flex flex-col">
        <div className="space-y-6 flex-1">
          {/* Base items (foundation + UI) */}
          {baseItems.map((item) => (
            <div key={item.id}>
              <span className="font-label text-[10px] uppercase tracking-widest text-[#d2c1d7]">
                {item.label}
              </span>
              <div className="flex justify-between items-center mt-2">
                <span className="text-secondary-fixed font-bold font-label">
                  {item.name}
                </span>
                <span className="text-xs text-[#d2c1d7] font-mono text-[10px]">
                  {formatSize(item.sizeMb)}
                </span>
              </div>
            </div>
          ))}

          {/* Divider */}
          {packageItems.length > 0 && (
            <div className="h-px bg-[#4f4255]/10 w-full" />
          )}

          {/* Package manifest list */}
          {packageItems.length > 0 && (
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-[#d2c1d7]">
                Package Manifest
              </span>
              <ul className="mt-3 space-y-3">
                {packageItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center group"
                  >
                    <span className="text-sm text-[#e3e2e8] flex items-center gap-2">
                      <CheckCircle2
                        size={14}
                        className="text-secondary-container shrink-0"
                      />
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#d2c1d7] font-mono">
                        {formatSize(item.sizeMb)}
                      </span>
                      {/* Remove button — only visible on hover */}
                      <button
                        id={`cart-remove-${item.id}`}
                        onClick={() => handleRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-[#ffb4ab] p-0.5 rounded"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {packageItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-40">
              <span className="text-3xl mb-3">📦</span>
              <p className="font-label text-xs uppercase tracking-widest text-[#9b8ba1]">
                No packages added yet
              </p>
            </div>
          )}
        </div>

        {/* ── Total size block ── */}
        <div className="mt-auto pt-8">
          <div className="flex justify-between items-end mb-4 border-t border-dashed border-[#4f4255]/30 pt-6">
            <span className="font-label text-xs uppercase tracking-widest text-[#d2c1d7]">
              Estimated Size
            </span>
            <div className="text-right">
              <div className="text-3xl font-black text-secondary-fixed font-headline">
                {formatSize(totalMb)}
              </div>
              <div className="text-[10px] text-error font-mono mt-1">
                Compressed (~{formatSize(compressedMb)})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="space-y-3">
        {/* Primary CTA */}
        <button
          id="cart-next-btn"
          onClick={onNext}
          className="btn-primary w-full py-4 rounded-[1rem] font-headline font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 group"
        >
          Next: Final Review
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        {/* Secondary actions row */}
        <div className="flex gap-2">
          <button
            id="cart-export-btn"
            onClick={onExport}
            className="flex-1 py-3 rounded-[1rem] border border-[#4f4255]/30 text-[#e3e2e8] font-label text-[10px] uppercase tracking-widest font-bold hover:bg-[#292a2e] transition-colors flex items-center justify-center gap-2"
          >
            <Download size={14} />
            Export Config
          </button>
          <button
            id="cart-clear-btn"
            onClick={handleClearAll}
            className="flex-1 py-3 rounded-[1rem] border border-[#4f4255]/30 text-error font-label text-[10px] uppercase tracking-widest font-bold hover:bg-[#93000a]/20 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>
    </aside>
  );
}
