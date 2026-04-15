import { NextRequest, NextResponse } from "next/server";

// ---- /api/forge POST ----
// Proxies the user's build selection to the n8n webhook.
// Keeps the n8n URL and any secrets server-side.
//
// Expected request body:
// {
//   userId: string;
//   distro: "arch" | "ubuntu" | "fedora";
//   gpu: string;
//   apps: string[];          // user-friendly names: ["steam", "discord", ...]
//   desktop: string;         // "kde" | "gnome" | "hyprland" | "xfce"
// }
//
// n8n forge-it-workflow responds with 202 and:
// {
//   status: "accepted";
//   message: string;
//   packages: string;        // comma-separated Arch package names
// }

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ?? "http://localhost:55000/webhook/forge-request";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.userId || !body.distro) {
      return NextResponse.json(
        { error: "userId and distro are required" },
        { status: 400 }
      );
    }

    // Forward to n8n
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: body.userId,
        distro: body.distro,
        gpu: body.gpu ?? "Generic",
        apps: body.apps ?? [],
        desktop: body.desktop ?? "gnome",
      }),
    });

    if (!n8nResponse.ok) {
      const errText = await n8nResponse.text();
      console.error("[/api/forge] n8n error:", errText);
      return NextResponse.json(
        { error: "Build pipeline error. Try again." },
        { status: 502 }
      );
    }

    const data = await n8nResponse.json();
    return NextResponse.json(data, { status: 202 });
  } catch (err) {
    console.error("[/api/forge] Unexpected error:", err);
    const message =
      err instanceof Error && /fetch failed|ECONNREFUSED|ENOTFOUND/i.test(err.message)
        ? "Cannot reach n8n webhook. Set N8N_WEBHOOK_URL or start n8n on port 55000."
        : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "forge-api" });
}
