// DistroForge — Hardware Detection Step Page (Step 1 of the Forge wizard)

import type { Metadata } from "next";
import HardwareScanner from "@/components/HardwareScanner";

export const metadata: Metadata = {
  title: "Hardware Detection | DistroForge",
  description:
    "Step 1 of the Forge Wizard. DistroForge auto-detects your CPU, GPU, and RAM to recommend the optimal Linux kernel and drivers.",
};

export default function HardwarePage() {
  return (
    <main>
      <HardwareScanner step={1} totalSteps={5} />
    </main>
  );
}
