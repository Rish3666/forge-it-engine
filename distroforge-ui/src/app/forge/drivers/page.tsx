"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Terminal, Monitor, Rocket, ShoppingCart, ArrowRight, ArrowLeft, Wifi, Zap, HardDrive } from "lucide-react";

const wizardNav = [
  { id: "core", label: "Core Base", Icon: Cpu, href: "/forge/hardware" },
  { id: "kernel", label: "Kernel", Icon: Terminal, href: "/forge/kernel" },
  { id: "drivers", label: "Drivers", Icon: Monitor, href: "/forge/drivers" },
  { id: "store", label: "Linux Store", Icon: ShoppingCart, href: "/forge" },
  { id: "finalize", label: "Finalize", Icon: Rocket, href: "/forge/review" },
];

const driverGroups = [
  {
    category: "GPU Drivers",
    icon: Zap,
    options: [
      { id: "nvidia-open", name: "NVIDIA Open (Recommended)", description: "Open-source NVIDIA kernel modules — best for RTX 20+ series.", recommended: true },
      { id: "nvidia-proprietary", name: "NVIDIA Proprietary", description: "Official closed-source driver. Maximum compatibility." },
      { id: "amdgpu", name: "AMDGPU (Open Source)", description: "Built into the Linux kernel. Best for AMD Radeon RX 5000+." },
      { id: "mesa", name: "Mesa (Open Source)", description: "Open-source OpenGL/Vulkan stack for AMD, Intel, and virtual GPUs." },
    ],
  },
  {
    category: "Network & Wireless",
    icon: Wifi,
    options: [
      { id: "iwlwifi", name: "Intel WiFi (iwlwifi)", description: "For Intel Wireless cards. Included in the Linux kernel." },
      { id: "rtw89", name: "Realtek RTW89", description: "Open-source driver for newer Realtek WiFi 6 chips." },
      { id: "broadcom", name: "Broadcom (wl)", description: "Proprietary Broadcom driver for MacBooks and select laptops." },
    ],
  },
  {
    category: "Storage & Controller",
    icon: HardDrive,
    options: [
      { id: "nvme", name: "NVMe (Built-in)", description: "Native NVMe support — always enabled." },
      { id: "ahci", name: "AHCI SATA (Built-in)", description: "Standard SATA controller driver." },
      { id: "usbstorage", name: "USB Mass Storage", description: "External drives, USB sticks, and flash storage." },
    ],
  },
];

export default function DriversPage() {
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
          <p className="font-label text-xs uppercase tracking-widest text-[#e5b5ff]/60">Step 3 of 5</p>
        </div>
        <div className="px-6 mb-6">
          <div className="h-1 bg-[#292a2e] rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#16ff9e] rounded-full transition-all duration-500" style={{ width: "60%" }} />
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          {wizardNav.map(({ id, label, Icon, href }) => {
            const isActive = id === "drivers";
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
        <div className="mt-auto px-4">
          <button onClick={() => router.push("/forge")}
            className="w-full py-4 rounded-full btn-primary font-headline font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            Review &amp; Forge →
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-28 pb-12 px-12 min-h-screen max-w-4xl">
        <header className="mb-12">
          <h1 className="text-6xl font-black font-headline tracking-tighter mb-4 text-[#e3e2e8]">Drivers</h1>
          <p className="text-[#d2c1d7] text-lg leading-relaxed">
            Select driver packages for your hardware. Recommended options are pre-selected based on your detected configuration.
          </p>
        </header>

        <div className="space-y-10 mb-12">
          {driverGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.category}>
                <div className="flex items-center gap-3 mb-4">
                  <GroupIcon size={18} className="text-[#e5b5ff]" />
                  <h2 className="font-headline font-bold text-lg text-white">{group.category}</h2>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.options.map((opt) => (
                    <div key={opt.id}
                      className={`p-5 rounded-[1.25rem] border-2 cursor-pointer transition-all ${opt.recommended ? "bg-[#e5b5ff]/10 border-[#e5b5ff]/40" : "bg-[#1a1b20] border-white/5 hover:border-white/20"}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-headline font-bold text-sm">{opt.name}</h3>
                        {opt.recommended && (
                          <span className="font-label text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-[#e5b5ff]/20 text-[#e5b5ff]">
                            Auto-detected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{opt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.push("/forge/kernel")}
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-[#9a9aa8] hover:text-white hover:border-white/30 transition-all font-label font-bold uppercase tracking-widest text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={() => router.push("/forge")}
            className="flex items-center gap-2 px-8 py-4 rounded-full btn-primary font-label font-bold uppercase tracking-widest text-sm">
            Next: Linux Store <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
