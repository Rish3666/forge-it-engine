# Project context: DistroForge Engine
**Objective**: Automate custom Linux ISO builds (Arch, Ubuntu, Fedora) via a Webhook -> n8n -> GitHub pipeline.

## Current Infrastructure
- **Webhook**: Receives `{ "distro": "arch", "apps": ["firefox"], "userId": "user123" }`.
- **AI Agent**: Groq Llama-3 + Tavily Search.
- **n8n Output**: Must be a JSON object: `{ "packages": "string", "distro": "string" }`.
- **GitHub Target**: `.github/workflows/{{distro}}-builder.yml`.

## Strict Requirements
1. **Packages**: Must be a space-separated string of valid names for the specific distro's package manager (pacman/apt/dnf).
2. **Filenames**: Workflows must be named exactly `arch-builder.yml`, `ubuntu-builder.yml`, and `fedora-builder.yml`.
3. **Inputs**: All workflows must accept `packages` (string) and `userId` (string) via `workflow_dispatch`.

## 4. Frontend Integration (Next.js)
- **Trigger**: User clicks 'Forge' on the Next.js UI.
- **Payload**: Next.js sends a JSON POST to n8n Production Webhook.
- **Feedback**: The website should display a 'Building...' state until GitHub Actions finishes (or show the user a link to the GitHub Actions tab).
