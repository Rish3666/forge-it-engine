# DISTROFORGE PROJECT CONTEXT

## Mission
To automate creation of custom Linux ISOs via a Webhook -> n8n -> GitHub Actions pipeline.

## System Architecture
1. Webhook receives `{apps: [], distro: "", gpu: "", userId: ""}`.
2. AI Agent (Groq) uses Tavily Search to find package names for the selected distro.
3. Structured parser forces AI output `{ "packages": "string", "distro": "string" }`.
4. GitHub node dispatches to `.github/workflows/{{distro}}-builder.yml`.

## Strict Output Rules
- `packages` must be only a space-separated string (no commas).
- No conversational filler.
- Distro must be lowercase: `arch`, `ubuntu`, or `fedora`.
