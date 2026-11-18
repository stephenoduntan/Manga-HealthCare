# MANGA HEALTHCARE — Admin Back Office (`@manga/admin`)

> **Operations, Clinical Governance & Regulatory Compliance Hub**  
> Built with Next.js 15 (App Router), Tailwind CSS v4, and `@manga/design-system`.

---

## 1. Overview & Operational Scope

`@manga/admin` is the dedicated administrative back-office portal for the **MANGA HEALTHCARE** clinical operations team, chief medical officers, and regulatory compliance officers.

### Core Governance Responsibilities
* **Live Operations & Queue Telemetry**: Real-time monitoring of instant lobby queue depth and automated trigger of **Locum Surge Alerts** when patient wait times exceed the 7-minute clinical safety threshold.
* **MDCN Clinician Credential Vetting**: Strict license verification against Medical & Dental Council of Nigeria records before issuing practicing Locum IDs (`LOC-XXXX`).
* **Emergency Divert Audit Trail**: Live log of all patients redirected to Nigerian emergency lines (`112` / `767`) from the triage gate.
* **NDPR Compliance Ledger**: Immutable, timestamped record of every access, creation, and alteration of electronic health records.
* **Financial Ledger & Settlement**: Financial breakdown tracking gross GMV, 80% doctor accruals, 20% platform margins, and biweekly settlement exports.

---

## 2. Directory & Application Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Admin header, active tab navigation & PersistentEmergencyBar
│   │   ├── globals.css               # Design system tokens & typography rules
│   │   │
│   │   ├── page.tsx                  # Operations & Live Queue Monitor (Lobby depth & Locum Surge Dispatch)
│   │   ├── doctors/
│   │   │   └── page.tsx              # MDCN Doctor & Locum Verification Workspace (Approve/Reject & LOC-XXXX Issuance)
│   │   ├── redirects/
│   │   │   └── page.tsx              # Emergency Diverts Log & NDPR Immutable Audit Trail
│   │   └── analytics/
│   │       └── page.tsx              # Platform Revenue, Paystack Settlements & Follow-Up Analytics
│   └── components/                   # Admin UI widgets & telemetry panels
├── package.json
└── tsconfig.json
```

---

## 3. Administrative Modules & Capabilities

### 1. Operations & Queue Monitor (`/`)
* **Live Telemetry Cards**:
  * Waiting queue depth (patients who passed triage and payment).
  * Active encrypted WebRTC video encounters.
  * Real-time average lobby wait time with target threshold indicator (`< 7 mins`).
  * Total emergency diverts today.
* **Surge Protection & Urgent Locum Dispatch**:
  * Visual surge alert badge appears when any patient's wait exceeds 7 minutes.
  * Modal allowing operations to immediately authorize and dispatch backup locum doctors with temporary `LOC-XXXX` identifiers.

### 2. MDCN Doctor Vetting Workspace (`/doctors`)
* **Practitioner Verification Queue**:
  * Displays pending physician onboarding submissions.
  * Shows MDCN license folio, medical degrees (e.g. `MBBS (UI), FWACS`), years of experience, and official email.
  * Direct inspection of uploaded license certificates.
* **Credential Approval**:
  * One-tap credential approval generates an official practicing `LOC-XXXX` ID.
  * Rejection notifies the physician with regulatory explanation.

### 3. Emergency Diverts & NDPR Audit Ledgers (`/redirects`)
* **Emergency Divert Log (`emergency_redirect_log`)**:
  * Captures every acute emergency halted at the triage gate (e.g., chest pain, stroke signs, breathing difficulty).
  * Records patient public ID, timestamp, symptoms flagged, and action taken (`HALTED & REDIRECTED TO AMBULANCE 112 / 767`).
* **NDPR Access Audit Log (`audit_log`)**:
  * Immutable ledger recording every actor identity, clinical action executed (e.g. `READ_EHR_RECORD`, `LOOKUP_E_PRESCRIPTION`), target patient record, and origin IP address.

### 4. Financial & Clinical Analytics (`/analytics`)
* **Revenue Metrics**:
  * Gross GMV processed via Paystack/Flutterwave.
  * 80% doctor fee accrual ledger settled biweekly on the 1st and 15th.
  * 20% platform infrastructure and operations margin.
  * Follow-up consultation retention rate (38.4% within 14-day window).
* **Track Breakdown**:
  * General Physician Teleconsultation (₦10,000 / encounter).
  * Mental Health Therapy Sessions (₦15,000 / encounter).
  * 14-Day Follow-Up Reviews (₦5,000 / encounter).

---

## 4. Environment Variables (`.env.local`)

```ini
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"

# Admin Authentication Secret
ADMIN_AUTH_TOKEN="manga-admin-super-secret-key"

# Emergency Dispatch Reference Numbers
NEXT_PUBLIC_EMERGENCY_AMBULANCE="112"
NEXT_PUBLIC_LAGOS_EMERGENCY="767"
```

---

## 5. Local Setup & Build

```bash
# Start development server on port 3001
pnpm --filter @manga/admin dev

# Build for production
pnpm --filter @manga/admin build

# Start production build
pnpm --filter @manga/admin start
```

---

## 6. Production Deployment

* **Host Targets**: Vercel / Netlify / AWS Amplify.
* **Port Configuration**: Configured to run on port `3001` to allow running simultaneously alongside the user-facing web app (`3000`) and backend API (`4000`).
