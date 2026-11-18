# MANGA HEALTHCARE — Web Application (`@manga/web`)

> **Patient, Doctor, Marketing & Partner Portals**  
> Built with Next.js 15 (App Router), Tailwind CSS v4, and `@manga/design-system`.

---

## 1. Overview & Scope

`@manga/web` houses the core web-based patient journey, clinical consultation workspace for physicians, public marketing surface, and corporate HMO lookup portal for **MANGA HEALTHCARE**.

### Design Philosophy
* **Synthesized Clinical Aesthetic**: Blends the editorial warmth of **August Health** (Warm Cream `#f8f3eb`, regular-weight `DM Serif Display` `400`), the numeric precision of **Bevel** (`-0.03em` tracked earnings numerals and `#31ce01` recovery green rings), the clean clinical workflows of **Ease Health** (two-pane SOAP EHR panels), and the life-saving clarity of **Chat for Impact** (unambiguous emergency triage sheets).
* **Clinical Safety First**: Enforces the 8 red-flag emergency check before enabling any instant queue entry or slot confirmation, paired with persistent ambulance tap-to-call banners (`112` / `767`).

---

## 2. Directory & Application Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (Google Fonts DM Serif & DM Sans, global styles)
│   │   ├── globals.css               # Tailwind v4 @theme, custom properties & typography rules
│   │   │
│   │   ├── (marketing)/              # Public Surface & Landing Pages
│   │   │   ├── page.tsx              # High-conversion landing page & value proposition
│   │   │   └── layout.tsx            # Marketing header, navigation, and trust badges
│   │   │
│   │   ├── (patient)/                # Patient Portal & Booking Flow
│   │   │   ├── patient/
│   │   │   │   ├── page.tsx          # Patient dashboard: records, consultations & prescriptions
│   │   │   │   ├── onboarding/
│   │   │   │   │   └── page.tsx      # Phone/Email/PAT-ID + OTP auth & NDPR consent
│   │   │   │   ├── book/
│   │   │   │   │   └── page.tsx      # Triage gate, instant lobby queue, slot picker & Paystack checkout
│   │   │   │   └── consultation/[id]/
│   │   │   │       └── page.tsx      # WebRTC video room, low-bandwidth chat & rash upload
│   │   │
│   │   ├── (doctor)/                 # Doctor & Locum Practitioner Workspace
│   │   │   ├── doctor/
│   │   │   │   ├── page.tsx          # Bevel earnings bento, biweekly payout ledger & live queue claim
│   │   │   │   ├── onboarding/
│   │   │   │   │   └── page.tsx      # MDCN license submission & credentials upload
│   │   │   │   └── consultation/[id]/
│   │   │   │       └── page.tsx      # Clinical EHR workspace (SOAP note form & E-Prescription builder)
│   │   │
│   │   ├── (partner)/                # Corporate HMO & Employer Portal
│   │   │   └── partner/
│   │   │       ├── page.tsx          # Partner overview & corporate wellness coverage
│   │   │       └── lookup/
│   │   │           └── page.tsx      # Real-time PAT-XXXX eligibility & benefit verification
│   │   │
│   │   └── design-system/            # Living Design System & Token Showcase
│   │       └── page.tsx              # Component gallery & color token auditor
│   └── components/                   # Web-specific presentation components
├── package.json
└── tsconfig.json
```

---

## 3. Route Matrix & User Journeys

| Route | User Role | Core Features |
| :--- | :--- | :--- |
| `/` | Public Visitor | Hero banner, "Talk to Doctor Now" CTA, safety guarantees, MDCN verification proof |
| `/patient/onboarding` | Patient | Phone/Email/ID authentication, SMS OTP input, mandatory Telemed & NDPR consent check |
| `/patient/book` | Patient | **Emergency Triage Gate** (8 red flags with immediate ambulance halt), Instant Lobby queue card, calendar slot booking, Paystack/Flutterwave checkout modal |
| `/patient/consultation/[id]` | Patient | Live Video/Audio encounter, chat fallback for weak network, clinical rash/photo upload |
| `/patient` | Patient | Patient encounter history, active prescription viewer with verified QR code |
| `/doctor/onboarding` | Clinician | MDCN license number input, medical degree details, certificate upload |
| `/doctor` | Clinician | **Bevel-Style Bento**: Biweekly fee ledger (`₦210,000`), payout cycle countdown, one-tap "Claim Next Patient in Queue" |
| `/doctor/consultation/[id]` | Clinician | **Ease-Style EHR**: Live encounter timer, Chief Complaint / HPI / Assessment / Plan form, dynamic multi-item E-Prescription builder |
| `/partner` & `/partner/lookup` | Corporate / HMO | Real-time `PAT-XXXX` lookup validating coverage status, corporate subsidization, and active plan |
| `/design-system` | Developer / QA | Interactive visual verification of typography, color tokens, and 5 PRD components |

---

## 4. Design System Integration (`@manga/design-system`)

The web application imports verified tokens and components from `@manga/design-system`:

```tsx
import {
  EmergencyTriageChecklist,
  TalkToDoctorLobbyCard,
  DoctorPayoutBento,
  StructuredSOAPForm,
  EPrescriptionBuilder,
  PersistentEmergencyBar,
} from '@manga/design-system';
```

### Color Palette Reference
* **Warm Cream Canvas**: `#f8f3eb` (Background surface)
* **Paper White**: `#ffffff` (Elevated cards with `16px` radius)
* **Canopy Green**: `#0a3922` (Primary brand & instant lobby hero cards)
* **Coral Pulse**: `#ff643b` (Emergency alerts & primary actions)
* **Cloud Card**: `#ebf0f8` (Bevel-style practitioner metrics)
* **Recovery Green**: `#31ce01` (Active status & metrics)

---

## 5. Environment Variables (`.env.local`)

```ini
# Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"

# Payment Gateways (Public Keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxx-X"

# Emergency Dispatch Lines
NEXT_PUBLIC_EMERGENCY_AMBULANCE="112"
NEXT_PUBLIC_LAGOS_EMERGENCY="767"

# WebRTC Video Provider (Daily.co or Agora)
NEXT_PUBLIC_DAILY_DOMAIN="https://mangahealth.daily.co"
```

---

## 6. Local Setup & Build

```bash
# Start development server on port 3000
pnpm --filter @manga/web dev

# Build for production
pnpm --filter @manga/web build

# Start production build
pnpm --filter @manga/web start
```

---

## 7. Production Deployment (Vercel / Netlify)

* **Root Directory**: `apps/web` (if deploying standalone) or configure Turborepo root on Vercel.
* **Build Command**: `cd ../.. && pnpm build --filter=@manga/web...`
* **Output Directory**: `.next`
