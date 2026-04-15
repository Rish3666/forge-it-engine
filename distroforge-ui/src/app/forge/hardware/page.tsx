"use client";

import { useRouter } from "next/navigation";
import HardwareScanner from "@/components/HardwareScanner";

export default function HardwarePage() {
  const router = useRouter();

  return (
    <main>
      <HardwareScanner
        step={1}
        totalSteps={5}
        onContinue={() => router.push("/forge")}
        onBack={() => router.push("/")}
      />
    </main>
  );
}
