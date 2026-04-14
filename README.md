# Forge It — Enterprise Image Factory (v2) 🏢

> Principal Cloud Architect Specification: RAG-based building across 100+ Linux distributions.

## 🏗️ High-Level Architecture (Enterprise)

```
Frontend (React)
    │
    ▼ POST /forge-enterprise
  n8n Webhook (userId, base_distro, apps)
    │
    ▼
  PostgreSQL / Supabase (RAG Dictionary)
  └── SELECT package_name FROM package_dictionary
    │
    ▼
  n8n Code Node (JS)
  ├── Mapping Logic: Distro → Docker Image
  └── Aggregator: Flatten package results
    │
    ▼
  GitHub Repository Dispatch (build_enterprise_iso)
    │
    ▼
  GitHub Actions (Dynamic Container)
  └── Running on: ${{ docker_image }}
  └── Tool: mkosi (Make Operating System Image)
    └── Dynamic mkosi.default injection
```

## Features

- **Universal Builder**: No more distro-specific tools like `mkarchiso`. We use `mkosi` via `pip` inside the target distro's official Docker container.
- **RAG Dictionary**: Decouples the frontend from the build logic. Adding a new distro is a simple `INSERT` into the `package_dictionary` table.
- **Dynamic CI/CD**: A single `.github/workflows/forge-v2.yml` file handles any distro that exists as a Docker container.

## Enterprise Setup

### 1. Database (Supabase)
Run the [database/schema.sql](file:///Users/rishvarma/Documents/forge-it-engine/database/schema.sql) in your Supabase SQL editor to create the `package_dictionary`. Use this to map your "App Names" (e.g. `vscode`) to "Package Names" (e.g. `code`).

### 2. n8n Enterprise Workflow
Import the [n8n/forge-enterprise-workflow.json](file:///Users/rishvarma/Documents/forge-it-engine/n8n/forge-enterprise-workflow.json).
- **PostgreSQL Node**: Set up your connection to Supabase.
- **GitHub Node**: Assign your Personal Access Token.

### 3. Usage (Webhook)

```json
POST /webhook/forge-enterprise
{
  "userId": "enterprise_user_99",
  "base_distro": "fedora",
  "apps": ["vscode", "docker"]
}
```

## File Structure

```
forge-it-engine/
├── .github/
│   └── workflows/
│       └── forge-v2.yml           ← Unified mkosi Builder
├── database/
│   └── schema.sql                 ← RAG Dictionary Schema
├── n8n/
│   └── forge-enterprise-workflow.json
└── README.md
```