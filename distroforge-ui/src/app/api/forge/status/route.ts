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
const WORKFLOW_FILE = "build-iso.yml";

interface GitHubArtifact {
  name: string;
  archive_download_url: string;
}

interface GitHubRun {
  id: number;
  status: string;
  conclusion: string | null;
}

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
    const targetName = `forge-it-${userId}-${distro}`;

    // List recent workflow runs for build-iso.yml
    const runsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?per_page=20`,
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

    const runs = (await runsRes.json()).workflow_runs as GitHubRun[] | undefined;

    if (!runs?.length) {
      return NextResponse.json({ status: "not_found", artifactName: targetName });
    }

    for (const run of runs) {
      const artifactsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/actions/runs/${run.id}/artifacts`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!artifactsRes.ok) {
        continue;
      }

      const artifacts = (await artifactsRes.json()).artifacts as
        | GitHubArtifact[]
        | undefined;
      const artifact = artifacts?.find((candidate) => candidate.name === targetName);

      if (artifact) {
        return NextResponse.json({
          status: run.status,
          conclusion: run.conclusion,
          runId: run.id,
          artifactName: targetName,
          downloadUrl:
            run.status === "completed" && run.conclusion === "success"
              ? artifact.archive_download_url
              : null,
        });
      }
    }

    return NextResponse.json({
      status: "not_found",
      conclusion: null,
      artifactName: targetName,
      downloadUrl: null,
    });
  } catch (err) {
    console.error("[/api/forge/status] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
