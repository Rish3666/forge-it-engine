# Forge It Engine 🔥

> Autonomous Arch Linux ISO builder — powered by n8n, Gemini AI, Redis, and GitHub Actions.

## How It Works

```
Frontend (React)
    │
    ▼ POST /forge-request
  n8n Webhook
    │
    ▼
  AI Agent (Gemini 1.5 Pro)
  ├── System prompt: translate apps → pacman package names
  └── Redis Chat Memory (session per userId)
    │
    ▼
  GitHub Repository Dispatch → build_iso
    │
    ▼
  GitHub Actions (archiso)
    └── Injects packages → builds ISO → uploads artifact
```

## Webhook Payload

```json
POST /webhook/forge-request
Content-Type: application/json

{
  "userId": "user_abc123",
  "apps": ["vscode", "spotify", "discord", "steam"],
  "gpu": "NVIDIA"
}
```

## Response (202 Accepted)

```json
{
  "status": "accepted",
  "message": "Forge process initiated for user_abc123",
  "packages": "code,spotify,discord,steam,nvidia-dkms,nvidia-utils"
}
```

## Setup

### 1. Import n8n Workflow

Import `n8n/forge-it-workflow.json` into your n8n instance via **Settings → Import from File**.

### 2. Configure Credentials in n8n

| Credential | Used By |
|---|---|
| Google Gemini API Key | Gemini Chat Model node |
| Redis connection | Redis Chat Memory node |
| GitHub Personal Access Token (repo scope) | GitHub node |

### 3. Activate the Workflow

Toggle the workflow to **Active** in n8n. The webhook will be live at:
```
https://<your-n8n-host>/webhook/forge-request
```

### 4. GitHub Actions

The `.github/workflows/build-iso.yml` is automatically triggered when n8n fires the `build_iso` repository dispatch event. The built ISO is uploaded as a GitHub Actions artifact (retained 3 days).

## Repository Dispatch Event

The n8n GitHub node fires this event:

```json
{
  "event_type": "build_iso",
  "client_payload": {
    "packages": "code,spotify,discord,nvidia-dkms,nvidia-utils",
    "userId": "user_abc123",
    "gpu": "NVIDIA"
  }
}
```

## Project Structure

```
forge-it-engine/
├── .github/
│   └── workflows/
│       └── build-iso.yml           ← GitHub Actions ISO builder
├── n8n/
│   └── forge-it-workflow.json      ← n8n workflow (import this)
├── releng/                         ← mkarchiso profile
│   ├── profiledef.sh               ← ISO identity (name, boot modes, arch)
│   ├── packages.x86_64             ← Base packages; user picks appended here
│   └── pacman.conf                 ← Pacman config with [multilib] enabled
└── README.md
```

## releng Profile

| File | Purpose |
|---|---|
| `profiledef.sh` | ISO metadata — name, label, boot modes, compression |
| `packages.x86_64` | Base package list; n8n-injected packages are appended at build time |
| `pacman.conf` | Pacman mirrors + `[multilib]` enabled for Steam/Wine/32-bit support |