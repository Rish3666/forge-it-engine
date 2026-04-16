import { NextRequest, NextResponse } from "next/server";

// ---- /api/forge/download GET ----
// Proxies the download of a GitHub Action artifact ZIP.
// Used because direct GitHub artifact URLs require authentication headers
// which cannot be easily provided in a simple link/browser download.

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "Rish3666/forge-it-engine";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artifactId = searchParams.get("artifactId");
  const name = searchParams.get("name") ?? "distroforge-iso";

  if (!artifactId) {
    return NextResponse.json({ error: "artifactId is required" }, { status: 400 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  try {
    // 1. Fetch the artifact from GitHub
    // The zip endpoint redirects to a short-lived download URL
    const githubRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/artifacts/${artifactId}/zip`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    if (!githubRes.ok) {
      console.error("[/api/forge/download] GitHub redirect error:", githubRes.status);
      return NextResponse.json(
        { error: "Failed to locate artifact on GitHub" },
        { status: githubRes.status }
      );
    }

    // 2. Stream the binary data back to the user
    // The fetch response is the actual ZIP stream
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${name}.zip"`);

    return new Response(githubRes.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("[/api/forge/download] Unexpected error:", err);
    return NextResponse.json({ error: "Download proxy failed" }, { status: 500 });
  }
}
