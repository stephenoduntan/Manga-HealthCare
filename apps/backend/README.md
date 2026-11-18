# MANGA HEALTHCARE — Backend API (`@manga/backend`)

> **High-Consequence Clinical Telemedicine API & Triage Engine**  
> Built with NestJS, Prisma ORM, PostgreSQL, Redis (Upstash), Paystack/Flutterwave, and PDFKit.

---

## 1. Overview & Architecture

`@manga/backend` powers all server-side clinical, booking, financial, and operational operations for the **MANGA HEALTHCARE** ecosystem (Web, Mobile, and Admin Back Office).

### Architectural Philosophy
* **Clinical Safety First**: Mandatory emergency-symptom triage gate evaluating 8 red-flag symptoms with automated halt & ambulance dispatch (`112` / `767`).
* **Instant Lobby & Redis Queue**: Dual booking modes supporting instant walk-in "Talk to Doctor Now" triage lobby alongside pre-scheduled slots (with mandatory scheduled slots for therapy).
* **Automated Provider Payout Splits**: Paystack/Flutterwave webhooks calculating 80% doctor fee accrual and 20% platform commission with biweekly payout cycle tracking.
* **Tamper-Evident E-Prescriptions**: Server-side PDFKit generation with verifiable verification tokens and public lookup endpoints.
* **NDPR & Audit Logging**: Global interceptor recording all sensitive clinical interactions in an immutable audit ledger.

---

## 2. Directory & Application Structure

```
apps/backend/
├── prisma/
│   ├── schema.prisma                 # Exact PostgreSQL schema with Prisma ORM
│   └── migrations/                   # Migration history
├── src/
│   ├── main.ts                       # App bootstrap, CORS, ValidationPipe, Global Interceptor
│   ├── app.module.ts                 # Root dependency injection module
│   ├── auth/                         # Identity, OTP & Consent Module
│   │   ├── auth.controller.ts        # POST /api/v1/auth/request-otp, /verify-otp, /consent
│   │   ├── auth.service.ts           # Public ID generation (PAT-XXXX, DOC-XXXX, LOC-XXXX)
│   │   ├── auth.spec.ts              # Unit & integration tests
│   │   └── dto/                      # Request & response DTOs
│   ├── triage/                       # Mandatory Emergency-Symptom Triage Engine
│   │   ├── triage.controller.ts      # POST /api/v1/triage/evaluate
│   │   ├── triage.service.ts         # 8 red-flag evaluator & emergency_redirect_log writer
│   │   └── triage.spec.ts            # Triage halt, clarify & clearance tests
│   ├── bookings/                     # Booking & Instant Lobby Priority Queue
│   │   ├── bookings.controller.ts    # POST /api/v1/bookings, GET /queue/position
│   │   ├── bookings.service.ts       # Atomic slot reservation & therapy slot rule
│   │   ├── queue.service.ts          # Upstash Redis FIFO queue & LOCUM_SURGE_ALERT trigger
│   │   └── bookings.spec.ts          # Queue depth & slot locking tests
│   ├── payments/                     # Paystack & Flutterwave Gateway Integration
│   │   ├── payments.controller.ts    # POST /api/v1/payments/initialize, /webhook
│   │   ├── payments.service.ts       # 80-20 split, 14-day follow-up discount, payout ledger
│   │   └── payments.spec.ts          # Payment verification & ledger accrual tests
│   ├── consultations/                # Clinical Encounter & E-Prescription Engine
│   │   ├── consultations.controller.ts# POST /api/v1/consultations, /prescriptions/generate
│   │   ├── consultations.service.ts  # SOAP note persistence & PDFKit prescription builder
│   │   └── consultations.spec.ts     # Consultation lifecycle & PDF tests
│   ├── admin-partners/               # Admin Back Office & Corporate Partner Lookup
│   │   ├── admin-partners.controller.ts# GET /admin/doctors/pending, /partners/lookup/:publicId
│   │   ├── admin-partners.service.ts # MDCN vetting, LOC-XXXX issuance, HMO validation
│   │   └── admin-partners.spec.ts    # Partner lookup & doctor approval tests
│   ├── common/                       # Interceptors, Filters & Guards
│   │   ├── ndpr-audit.interceptor.ts # Immutable NDPR data access logger
│   │   └── http-exception.filter.ts  # Standardized error response formatter
│   └── prisma/                       # Database Client Wrapper
│       ├── prisma.module.ts
│       └── prisma.service.ts
├── test/                             # E2E test suite
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema (`prisma/schema.prisma`)

| Table | Description | Key Fields |
| :--- | :--- | :--- |
| `users` | Primary identity table | `id`, `public_id` (`PAT-XXXX`, `DOC-XXXX`, `LOC-XXXX`), `role`, `telemedicine_consent`, `ndpr_consent` |
| `patient_profiles` | Medical intake & history | `user_id`, `allergies`, `existing_conditions`, `current_medications` |
| `doctor_profiles` | Practitioner credentials | `user_id`, `mdcn_license_number`, `specialty`, `verification_status`, `consultation_fee`, `followup_fee` |
| `availability_slots` | Physician calendar slots | `id`, `doctor_id`, `start_time`, `end_time`, `is_booked` |
| `bookings` | Encounter requests | `patient_id`, `doctor_id`, `booking_type` (`INSTANT_QUEUE`, `SCHEDULED`, `THERAPY_MANDATORY_SLOT`), `status`, `payment_status` |
| `consultations` | Active clinical sessions | `booking_id`, `mode` (`VIDEO`, `AUDIO`, `CHAT`), `notes` (SOAP format: `{ chief_complaint, hpi, assessment, plan }`), `uploaded_images` |
| `prescriptions` | Tamper-evident Rx | `consultation_id`, `items` (JSON drug array), `generated_pdf_url`, `verification_token` |
| `payments` | Financial settlements | `amount`, `platform_commission` (20%), `doctor_accrued_fee` (80%), `payout_cycle_status`, `provider` |
| `emergency_redirect_log`| Emergency diverts | `patient_id`, `symptoms_flagged`, `action_taken`, `nearest_facilities_coords` |
| `ndpr_audit_log` | Data protection ledger | `actor_id`, `action`, `target_resource`, `ip_address`, `timestamp` |
| `corporate_partners` | HMO & B2B employers | `corporate_code`, `company_name`, `eligible_patient_ids`, `active_status` |

---

## 4. Key Endpoints & API Reference

### Auth & Consent (`/api/v1/auth`)
* `POST /api/v1/auth/request-otp` — Request 4-digit SMS/Email OTP.
* `POST /api/v1/auth/verify-otp` — Verify OTP, issue signed JWT and role claims.
* `POST /api/v1/auth/consent` — Affirm Telemedicine & NDPR consent.

### Emergency Triage Engine (`/api/v1/triage`)
* `POST /api/v1/triage/evaluate` — Evaluates symptoms against the 8 red flags.
  * **Branch 1 (Red Flag detected)**: Returns `HALT_AND_REDIRECT` + nearest emergency facilities + Nigerian ambulance contacts (`112` / `767`).
  * **Branch 2 (Ambiguous query)**: Returns `ASK_CLARIFYING_QUESTION`.
  * **Branch 3 (Cleared)**: Returns `CLEAR_TO_BOOK` with a short-lived signed `triage_clearance_token`.

### Bookings & Instant Queue (`/api/v1/bookings`)
* `POST /api/v1/bookings` — Create a booking (requires `triage_clearance_token`).
* `GET /api/v1/bookings/queue/position/:id` — Live wait time and queue depth.
* `POST /api/v1/bookings/claim` — On-duty doctor/locum claims next instant queue patient.

### Payments & Doctor Ledger (`/api/v1/payments`)
* `POST /api/v1/payments/initialize` — Generate Paystack/Flutterwave checkout session.
* `POST /api/v1/payments/webhook` — Webhook handler verifying successful payment, calculating 80-20 split, and crediting doctor's biweekly payout ledger.

### Consultations & PDF E-Prescription (`/api/v1/consultations`)
* `POST /api/v1/consultations/start` — Generates WebRTC Video/Audio tokens and starts session timer.
* `POST /api/v1/consultations/notes` — Persists structured SOAP notes.
* `POST /api/v1/consultations/prescriptions/generate` — Compiles and signs PDFKit e-prescription.

### Admin & Partner Verification (`/api/v1/admin`)
* `GET /api/v1/admin/doctors/pending` — List doctors awaiting MDCN license review.
* `POST /api/v1/admin/doctors/verify` — Approve doctor and issue `LOC-XXXX` identifier.
* `GET /api/v1/partners/lookup/:publicId` — Validate employee/patient HMO eligibility.

---

## 5. Environment Variables (`.env`)

```ini
PORT=4000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/manga_healthcare?schema=public"

# Redis Cache & Instant Lobby Priority Queue (Upstash or Redis local)
REDIS_URL="redis://localhost:6379"

# Authentication & Security
JWT_SECRET="manga-super-secret-jwt-key-minimum-32-chars"
JWT_EXPIRES_IN="7d"

# Payment Gateways (Nigeria)
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxx-X"

# Emergency & Ambulance Dispatch Services
DEFAULT_AMBULANCE_NUMBER="112"
LAGOS_AMBULANCE_NUMBER="767"

# File Storage & PDF CDN (AWS S3 or Cloudinary)
STORAGE_BUCKET_URL="https://storage.mangahealth.ng"
```

---

## 6. Local Setup & Testing

```bash
# Install dependencies
pnpm install

# Run database migrations & generate Prisma client
npx prisma migrate dev
npx prisma generate

# Run backend test suite (6/6 suites, 22 tests)
pnpm --filter @manga/backend test

# Start backend in development mode
pnpm --filter @manga/backend dev
```

---

## 7. Production Deployment

* **Docker**: Containerized with Node.js 22 LTS Alpine.
* **Host Targets**: AWS ECS / Railway / Render / DigitalOcean App Platform.
* **Health Check**: `GET /api/v1/health`
