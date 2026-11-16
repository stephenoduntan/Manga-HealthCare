# MANGA HEALTHCARE (BETA) — Engineering, PRD & Design System Rules

## 1. Beta Product Scope & Clinical Safety (Non-Negotiable)
- **Primary Beta Goal:** Prove patients can book, pass emergency triage, pay (Paystack/Flutterwave), and complete remote consultations (video/audio/chat), while verified doctors/therapists (including Locums) document structured notes, generate PDF e-prescriptions, and track biweekly payout ledgers.
- **Mandatory Emergency-Symptom Triage:** No patient can enter the "Talk to Doctor Now" queue or confirm a scheduled booking without passing the rules-based 8-symptom red-flag checklist. Any red flag MUST halt booking, render a calm ambulance redirect screen with persistent tap-to-call, log to `emergency_redirect_log`, and notify Admin/Ops.
- **NDPR & MDCN Compliance:**
  - Capture explicit Telemedicine Consent + NDPR Data Processing Consent at signup/before first booking.
  - Log every read/write access to patient records in `audit_log` (`user_id`, `action`, `target_record`, `timestamp`).
  - Doctors require `mdcn_license_number` verification before going live; Locum doctors receive an admin-issued Locum ID after credential verification.
- **Role Architecture (4 Core Roles):**
  1. `PATIENT`: Sign up (Phone/Email/Patient ID + OTP), intake form, triage, Paystack/Flutterwave checkout, instant lobby queue or calendar booking (mandatory calendar booking for therapy), history/PDF prescriptions, post-consultation rating.
  2. `DOCTOR` / `THERAPIST` (including `LOCUM`): Login (Email/Doctor ID/Locum ID + OTP), profile & MDCN setup, availability slots, consultation room (Video/Audio/Chat + rash/image upload + structured Chief Complaint/Hx/Assessment/Plan notes + PDF E-Prescription + Referral), biweekly payout ledger dashboard.
  3. `ADMIN` / `OPS`: MDCN verification & Locum ID issuance, live lobby queue monitor (triggers urgent locum hire when queue spikes), emergency-redirect audit log, dispute handling, revenue/consultation analytics.
  4. `PARTNER` (Pharmacy / Lab / Referral Portal): Lookup assigned prescriptions, lab requests, or referral records by inputting `patient_id` (with consent audit logging).

## 2. Technical Stack (PRD Aligned)
- **Monorepo:** Turborepo + `pnpm` workspaces (`apps/backend`, `apps/web`, `apps/mobile`, `packages/design-system`, `packages/api-contract`).
- **Backend (`apps/backend`):** NestJS (TypeScript), PostgreSQL (Prisma ORM), Upstash Redis (instant consultation lobby queue, OTP state, rate-limiting), AWS S3 (encrypted-at-rest storage for e-prescription PDFs and consultation image uploads), Paystack/Flutterwave webhooks, Daily.co / Agora SDK token generator, Firebase Cloud Messaging (FCM).
- **Web (`apps/web`):** Next.js (App Router, TypeScript, Tailwind v4) hosting:
  - `(marketing)`: Public Website
  - `(app)`: Patient & Doctor/Therapist Web Portal + Partner Lookup View
  - `(admin)`: Internal Admin/Ops Command Center (Live Queue, MDCN Verification, Emergency Redirect Logs)
- **Mobile (`apps/mobile`):** React Native (Expo Router, TypeScript, NativeWind) — single codebase supporting Patient and Doctor/Therapist modes.

## 3. Specialized Design System (`@manga/design-system`)
Synthesize August Health EHR, Ease Health, Bevel, and Chat for Impact:
- **Surfaces (Depth via Tinted Layers, Not Heavy Gray Shadows):**
  - `--surface-canvas`: `#f8f3eb` (August Cream — default page background)
  - `--surface-paper`: `#ffffff` (Pure White — clinical forms, EHR tables, inner cards)
  - `--surface-keylime`: `#e1f4df` (Ease Keylime Wash — hero & intake panels)
  - `--surface-sage`: `#b1dbb8` (Ease Sage Mist — secondary feature/clinical panels)
  - `--surface-slate`: `#b6ced5` (Ease Slate Hush — doctor consultation workspace & UI preview containers)
  - `--surface-cloud`: `#ebf0f8` (Bevel Cloud Card — doctor payout ledger & patient metric bento cards)
  - `--surface-canopy`: `#0a3922` (Chat for Impact Canopy Green — high-contrast hero & sticky queue banners)
  - `--surface-peach-alert`: `#ffede8` (Soft calm surface for the Emergency Triage Redirect screen)
- **Typography:**
  - `--font-serif`: `'DM Serif Display'` or `'Cormorant Garamond'` — **Strictly weight 400 (Regular) or 300 (Light), NEVER bold**. Tight tracking (`-0.03em` at `48px–74px`).
  - `--font-sans`: `'DM Sans'` (`font-feature-settings: "ss03"`) — weights `400`, `500`, `600`. Uppercase eyebrows at `11px`, weight `600`, `+0.08em` tracking.
- **Action & Semantic Accents:**
  - `--ink-deep`: `#080331` | `--ink-forest`: `#0f3e17` | `--ink-charcoal`: `#222326` | `--ink-muted`: `#747679`
  - `--action-indigo`: `#4865ff` (Primary Web/Clinical CTA with warm shadow `rgba(75, 68, 57, 0.1) 0px 12px 24px 0px`)
  - `--action-forest`: `#0f3e17` (Botanical Primary CTA fill with `#fffefc` text)
  - `--action-coral`: `#ff643b` ("Talk to Doctor Now" urgent CTA & Emergency Tap-to-Call button)
  - `--metric-green`: `#31ce01` (Verified / Stable / Paid) | `--metric-blue`: `#415eee` | `--metric-gold`: `#ffca00`
- **Radii:** Pill buttons/badges/nav (`9999px`), Feature/Bento cards (`24px`), Clinical/EHR cards (`14px–16px`).