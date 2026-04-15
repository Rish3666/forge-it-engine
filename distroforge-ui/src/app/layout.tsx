import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DistroForge — The Ultimate Linux Experience",
  description:
    "Forge your perfect Linux distribution with systemic elegance. No bloat, no friction. Hardware detection, distro selection, and one-click ISO builds.",
  keywords: ["linux", "distro", "iso", "arch linux", "custom linux", "distroforge"],
  authors: [{ name: "DistroForge" }],
  openGraph: {
    title: "DistroForge — The Ultimate Linux Experience",
    description: "Build your perfect Linux distribution with systemic elegance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-[#0b0c10] text-[#e3e2e8] font-body antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
