import { NextRequest, NextResponse } from "next/server";

// ---- /api/forge/status GET ----
// Returns the status of a specific build job by polling the GitHub Actions API.
// Called by the frontend to show the user live build progress.
//
// Query params:
//   ?userId=<string>  — used to locate the artifact name
//   ?distro=<string>
//
// NOTE: Set GITHUB_TOKEN and GITHUB_REPO in your .env.local:
//   GITHUB_TOKEN=ghp_xxxx
//   GITHUB_REPO=Rish3666/forge-it-engine

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "Rish3666/forge-it-engine";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const distro = searchParams.get("distro") ?? "arch";

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (!GITHUB_TOKEN) {
    // Dev mode: return a mock in-progress status so the UI can be developed locally
    return NextResponse.json({
      status: "in_progress",
      artifactName: `forge-it-${userId}-${distro}`,
      downloadUrl: null,
      message: "Build in progress (dev mock — set GITHUB_TOKEN for live data)",
    });
  }

  try {
    // List recent workflow runs for build-iso.yml
    const runsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/build-iso.yml/runs?per_page=10`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 10 }, // re-fetch at most every 10s
      }
    );

    if (!runsRes.ok) {
      return NextResponse.json(
        { error: "GitHub API error" },
        { status: runsRes.status }
      );
    }

    const runs = await runsRes.json();
    // Find the most recent run matching this user (by artifact name prefix)
    const targetName = `forge-it-${userId}-${distro}`;
    const run = runs.workflow_runs?.[0]; // Most recent run

    if (!run) {
      return NextResponse.json({ status: "not_found", artifactName: targetName });
    }

    // If completed, get the artifact download URL
    let downloadUrl: string | null = null;
    if (run.status === "completed" && run.conclusion === "success") {
      const artifactsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/actions/runs/${run.id}/artifacts`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      const artifacts = await artifactsRes.json();
      const artifact = artifacts.artifacts?.find((a: { name: string }) =>
        a.name.startsWith(`forge-it-${userId}`)
      );
      if (artifact) {
        downloadUrl = artifact.archive_download_url;
      }
    }

    return NextResponse.json({
      status: run.status, // queued | in_progress | completed
      conclusion: run.conclusion, // success | failure | null
      runId: run.id,
      artifactName: targetName,
      downloadUrl,
    });
  } catch (err) {
    console.error("[/api/forge/status] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
