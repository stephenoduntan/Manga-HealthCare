# MANGA HEALTHCARE — Monorepo Architecture

> **High-Consequence Clinical Telemedicine, Emergency Triage & Health Governance Platform**  
> Architected according to `MANGA_HEALTHCARE.pdf` and `.antigravity/rules.md`.

---

## 1. System Architecture Overview

MANGA HEALTHCARE is structured as a high-performance **Turborepo Monorepo** delivering a shared single source of truth across clinical contracts and design tokens, while providing four dedicated, independently-deployable application stacks:

```
Manga-HealthCare/
├── apps/
│   ├── backend/                      # NestJS REST API, Prisma ORM, Redis Queue, Paystack & PDFKit
│   ├── web/                          # Next.js 15: Patient, Doctor, Marketing & Partner Portals
│   ├── mobile/                       # Expo Router React Native: Unified iOS & Android App
│   └── admin/                        # Next.js 15: Operations, MDCN Vetting & Regulatory Hub
│
├── packages/
│   ├── api-contract/                 # Shared Zod Schemas & 8 Red-Flag Emergency Triage Engine
│   └── design-system/                # Web Tailwind v4 Presets & React Native Design Tokens
│
├── package.json                      # Workspace scripts & Turborepo config
├── pnpm-workspace.yaml               # PNPM monorepo package registry
└── turbo.json                        # Pipeline task caching & orchestration
```

---

## 2. Dedicated Application Stacks

Each application stack is fully decoupled and maintains its own dedicated `README.md` with deep structural outlines:

| Application | Stack / Framework | Primary Purpose | Dedicated Guide |
| :--- | :--- | :--- | :--- |
| **Backend API** | NestJS + PostgreSQL + Redis | Clinical REST API, emergency triage gate, priority queue, 80-20 payment splits, PDF prescriptions | [apps/backend/README.md](file:///c:/Users/OlawoleSOduntan/Desktop/Manga-HealthCare/apps/backend/README.md) |
| **Frontend Web** | Next.js 15 App Router | Patient consultations, doctor workspace, marketing landing, corporate HMO lookup | [apps/web/README.md](file:///c:/Users/OlawoleSOduntan/Desktop/Manga-HealthCare/apps/web/README.md) |
| **Mobile App** | Expo Router (React Native) | Unified iOS & Android app for Patients and Doctors, native camera rash uploads, 112 dialer | [apps/mobile/README.md](file:///c:/Users/OlawoleSOduntan/Desktop/Manga-HealthCare/apps/mobile/README.md) |
| **Admin Back Office** | Next.js 15 App Router | Live queue telemetry, locum surge dispatch, MDCN doctor vetting, emergency divert audit trail | [apps/admin/README.md](file:///c:/Users/OlawoleSOduntan/Desktop/Manga-HealthCare/apps/admin/README.md) |

---

## 3. Shared Packages

### `@manga/api-contract` (`packages/api-contract`)
* **10 Prisma-Matched Zod Schemas**: Guarantees zero contract drift across all 4 apps.
* **Emergency Triage Engine**: Implements the 8 red flags, ambiguous symptom clarification, and signed clearance token generator.
* **100% Automated Test Coverage**: Verified with Jest (`5/5` test suites passing).

### `@manga/design-system` (`packages/design-system`)
* **Synthesized Design Tokens**: Combines the editorial warmth of **August Health**, numeric bento cards of **Bevel**, structured EHR forms of **Ease Health**, and crisis clarity of **Chat for Impact**.
* **Dual Exports**:
  * Web: Tailwind CSS v4 `@theme` tokens and 5 PRD web components.
  * Mobile: `@manga/design-system/native` exporting pure numeric values (`nativeColors`, `nativeRadii`, `nativeTypography`, `nativeShadows`).

---

## 4. Port Allocation & Development Matrix

When running the full stack locally, each application operates on its own dedicated port:

| Service | Port | Description |
| :--- | :--- | :--- |
| **Backend API** | `http://localhost:4000` | REST API, Swagger docs & Webhook receiver |
| **Frontend Web** | `http://localhost:3000` | Patient & Doctor web portals |
| **Admin Back Office** | `http://localhost:3001` | Operations & clinical governance dashboard |
| **Mobile Bundler** | `http://localhost:8081` | Expo Metro bundler for iOS & Android |

---

## 5. Quick Start & Developer Commands

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` LTS
* **PNPM**: `v12.x`
* **PostgreSQL**: `v15+`
* **Redis**: `v7+` (or Upstash Redis URL)

### 1. Install All Dependencies
```bash
pnpm install
```

### 2. Setup Database & Prisma
```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
cd ../..
```

### 3. Run Applications
```bash
# Run all applications simultaneously
pnpm dev

# Or run individual applications:
pnpm --filter @manga/backend dev    # Backend API on port 4000
pnpm --filter @manga/web dev        # Web App on port 3000
pnpm --filter @manga/admin dev      # Admin Portal on port 3001
pnpm --filter @manga/mobile dev     # Expo Mobile App on port 8081
```

### 4. Build All Applications
```bash
pnpm build
```

### 5. Run All Test Suites
```bash
pnpm test
```

---

## 6. Future Multi-Repo / Polyrepo Transition

If your organization later requires strict repository separation (e.g. for external contractor permissions or isolated CI/CD pipelines):
1. Each directory in `apps/` (`backend`, `web`, `mobile`, `admin`) is already fully modular with its own `package.json`, `tsconfig.json`, and `README.md`.
2. To extract into independent git repositories:
   * Create 4 separate GitHub repositories (`manga-backend`, `manga-web`, `manga-mobile`, `manga-admin`).
   * Copy the corresponding app folder into the new repo.
   * Vendor the shared contracts and tokens or publish `@manga/api-contract` and `@manga/design-system` to GitHub Packages or private npm.
