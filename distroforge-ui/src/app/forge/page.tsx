// DistroForge — Forge / Linux Store Page
// Combines the DistroGrid + BuildCartSidebar in a shared layout matching the Stitch design.
// The left sidebar (Build Wizard nav) and the top nav are included here.

import type { Metadata } from "next";
import ForgeStoreClient from "./ForgeStoreClient";

export const metadata: Metadata = {
  title: "The Forge | DistroForge — Linux Store",
  description:
    "Customize your Linux distribution. Choose your desktop environment, select software packages, and build your ISO.",
};

export default function ForgePage() {
  return <ForgeStoreClient />;
}
