// DistroForge — Mock Data Layer
// All static content lives here for clean data/presentation separation.
// Wire these up to a Node.js/Supabase backend by replacing with API calls.

// ---- Types ----

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface FeatureBlock {
  tag: string;
  tagColor: "emerald" | "primary";
  title: string;
  description: string;
}

export interface DesktopEnv {
  id: string;
  name: string;
  description: string;
  sizeMb: number;
  icon: string; // lucide icon name
}

export interface SoftwarePackage {
  id: string;
  name: string;
  description: string;
  sizeMb: number;
  category: "gaming" | "development" | "media" | "productivity" | "browser";
  // Icon placeholder — swap for real logo URLs from Supabase storage
  iconBg: string;
}

export interface DistroCard {
  id: string;
  name: string;
  tagline: string;
  matchPercent: number;
  difficulty: "Beginner" | "Intermediate" | "Hard";
  difficultyColor: "emerald" | "fuchsia" | "red";
  useCase: string;
  releaseModel: string;
  minRam: string;
  storage: string;
  cpu: string;
  gpu: string;
  audience: string;
  features: string[];
}

export interface BuildCartItem {
  id: string;
  label: string;
  name: string;
  sizeMb: number;
  isBase?: boolean;
}

export interface HardwareLine {
  prefix: string;
  prefixColor: string;
  content: string;
  contentColor: string;
}

// ---- Navigation ----

export const navLinks: NavLink[] = [
  { label: "Directory", href: "/directory" },
  { label: "The Forge", href: "/forge", active: true },
  { label: "Sponsor", href: "/sponsor" },
  { label: "GitHub", href: "https://github.com" },
];

// ---- Hero feature blocks ----

export const featureBlocks: FeatureBlock[] = [
  {
    tag: "Simplicity",
    tagColor: "emerald",
    title: "Designed to get out of your way",
    description:
      "We believe your OS should be invisible. DistroForge strips away the noise and focuses on a high-performance, distraction-free environment.",
  },
  {
    tag: "Performance",
    tagColor: "primary",
    title: "Works with your hardware",
    description:
      "Native driver support and kernel optimization for the latest AMD and NVIDIA architectures. We don't just run; we fly.",
  },
  {
    tag: "Integrity",
    tagColor: "emerald",
    title: "Always safe and sound",
    description:
      "Security-hardened defaults with immutable root filesystem options. Your system remains pristine, update after update.",
  },
  {
    tag: "Play",
    tagColor: "primary",
    title: "Best gaming practices by default",
    description:
      "Pre-configured GameMode, Proton-GE, and Steam optimizations. Gaming on Linux isn't an afterthought—it's a priority.",
  },
];

// ---- Hardware detection terminal output ----

export const terminalLines: HardwareLine[] = [
  { prefix: "$", prefixColor: "#56ffa8", content: "curl -sSfL https://forge.distro.dev/detect.sh | sh", contentColor: "#ffffff" },
  { prefix: "[info]", prefixColor: "#6b7280", content: "Initializing hardware probe...", contentColor: "#6b7280" },
  { prefix: "[info]", prefixColor: "#6b7280", content: "Scanning PCI bus...", contentColor: "#9ca3af" },
  { prefix: "Detected:", prefixColor: "#9ca3af", content: "NVIDIA GeForce RTX 4080", contentColor: "#e5b5ff" },
  { prefix: "Detected:", prefixColor: "#9ca3af", content: "Intel Core i9-13900K", contentColor: "#e5b5ff" },
  { prefix: "Memory:", prefixColor: "#9ca3af", content: "64GB DDR5-6000MHz", contentColor: "#e5b5ff" },
];

export const cpuOptions = [
  "Intel Core i9-13900K (Detected)",
  "AMD Ryzen 9 7950X",
  "Intel Core i7-12700K",
  "Generic x86_64",
];

export const gpuOptions = [
  "NVIDIA GeForce RTX 4080 (Detected)",
  "AMD Radeon RX 7900 XTX",
  "Intel Arc A770",
  "Virtual / Integrated Graphics",
];

export const ramOptions = [
  "64GB DDR5 (Detected)",
  "32GB DDR5",
  "16GB DDR4",
  "Custom Allocation",
];

// ---- Desktop environments ----

export const desktopEnvironments: DesktopEnv[] = [
  { id: "kde", name: "KDE Plasma", description: "Powerful, flexible, and fully feature-rich.", sizeMb: 820, icon: "Layers" },
  { id: "gnome", name: "GNOME", description: "Elegant, modern, and focused simplicity.", sizeMb: 750, icon: "LayoutGrid" },
  { id: "hyprland", name: "Hyprland", description: "Dynamic tiling Wayland compositor.", sizeMb: 120, icon: "Grid" },
  { id: "xfce", name: "XFCE", description: "Stable, lightweight, and blazing fast.", sizeMb: 450, icon: "Mouse" },
];

// ---- Software packages ----

export const softwarePackages: SoftwarePackage[] = [
  { id: "steam", name: "Steam", description: "The ultimate gaming platform.", sizeMb: 180, category: "gaming", iconBg: "#1b2838" },
  { id: "discord", name: "Discord", description: "Voice, video, and text chat.", sizeMb: 150, category: "productivity", iconBg: "#5865F2" },
  { id: "vscode", name: "VS Code", description: "Code editing. Redefined.", sizeMb: 320, category: "development", iconBg: "#007ACC" },
  { id: "obs", name: "OBS Studio", description: "Free and open source recording.", sizeMb: 210, category: "media", iconBg: "#302e31" },
  { id: "blender", name: "Blender", description: "The 3D creation suite.", sizeMb: 950, category: "media", iconBg: "#ea7600" },
  { id: "firefox", name: "Firefox", description: "Privacy-focused browsing.", sizeMb: 120, category: "browser", iconBg: "#e66000" },
  { id: "neovim", name: "Neovim", description: "Hyperextensible Vim-based editor.", sizeMb: 45, category: "development", iconBg: "#57a143" },
  { id: "lutris", name: "Lutris", description: "Open gaming platform.", sizeMb: 90, category: "gaming", iconBg: "#ff5900" },
  { id: "vlc", name: "VLC Media Player", description: "The universal media player.", sizeMb: 80, category: "media", iconBg: "#ff8800" },
];

export const packageCategories = [
  "Desktop Environments",
  "Gaming",
  "Software Development",
  "Media Production",
];

// ---- Distro directory cards ----

export const distroCards: DistroCard[] = [
  {
    id: "arch",
    name: "Arch Linux",
    tagline: "The Power User's Canvas",
    matchPercent: 98,
    difficulty: "Hard",
    difficultyColor: "red",
    useCase: "Power User",
    releaseModel: "Rolling Release",
    minRam: "4GB DDR4",
    storage: "20GB NVMe",
    cpu: "64-bit Multi",
    gpu: "NVIDIA/AMD",
    audience:
      "Designed for proficient users who desire full control over their operating system. Ideal for developers, system administrators, and enthusiasts who prefer building their environment from the terminal up.",
    features: [
      "Rolling release model for continuous updates.",
      "Arch User Repository (AUR) access.",
      "Pacman package manager efficiency.",
    ],
  },
  {
    id: "fedora",
    name: "Fedora",
    tagline: "The Developer's Standard",
    matchPercent: 84,
    difficulty: "Intermediate",
    difficultyColor: "fuchsia",
    useCase: "Developer",
    releaseModel: "Standard Release",
    minRam: "2GB DDR4",
    storage: "15GB SSD",
    cpu: "64-bit",
    gpu: "Any",
    audience:
      "Perfect for developers who want a cutting-edge yet stable platform backed by Red Hat engineering. Ships the latest GNOME release.",
    features: [
      "SELinux security from the ground up.",
      "Flatpak natively integrated.",
      "DNF5 package manager — fast and modern.",
    ],
  },
  {
    id: "mint",
    name: "Linux Mint",
    tagline: "The Desktop Comfort Zone",
    matchPercent: 72,
    difficulty: "Beginner",
    difficultyColor: "emerald",
    useCase: "Classic User",
    releaseModel: "LTS Support",
    minRam: "2GB DDR3",
    storage: "20GB HDD",
    cpu: "64-bit",
    gpu: "Any",
    audience:
      "The ideal starting point for Windows users migrating to Linux. Familiar UI, rock-solid stability, and long-term support.",
    features: [
      "Cinnamon DE — Windows-like familiarity.",
      "Ubuntu/Debian package ecosystem.",
      "5-year LTS support cycle.",
    ],
  },
  {
    id: "kali",
    name: "Kali Linux",
    tagline: "The Security Practitioner's Forge",
    matchPercent: 55,
    difficulty: "Hard",
    difficultyColor: "red",
    useCase: "SecOps",
    releaseModel: "Penetration Testing",
    minRam: "8GB DDR4",
    storage: "50GB SSD",
    cpu: "64-bit",
    gpu: "NVIDIA (CUDA)",
    audience:
      "Purpose-built for penetration testing, ethical hacking, and digital forensics. Ships 600+ security tools pre-installed.",
    features: [
      "600+ pre-installed security tools.",
      "Undercover mode mimics Windows.",
      "WSL2 and Docker support.",
    ],
  },
];

// ---- Build cart default items ----

export const defaultCartItems: BuildCartItem[] = [
  { id: "base", label: "Base Foundation", name: "Arch Linux", sizeMb: 650, isBase: true },
  { id: "ui", label: "User Interface", name: "GNOME", sizeMb: 750, isBase: true },
  { id: "discord", label: "Package", name: "Discord", sizeMb: 150 },
  { id: "firefox", label: "Package", name: "Firefox", sizeMb: 120 },
  { id: "git", label: "Package", name: "Git Toolkit", sizeMb: 45 },
];
