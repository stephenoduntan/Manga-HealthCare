# MANGA HEALTHCARE — Mobile App (`@manga/mobile`)

> **Unified Cross-Platform Mobile Application (iOS & Android)**  
> Built with React Native, Expo Router, NativeWind, and `@manga/design-system/native`.

---

## 1. Overview & Architecture

Following Section 3 of the PRD (*"Mobile app: React Native - One codebase for patient + doctor apps"*), `@manga/mobile` is engineered as a single, unified codebase that dynamically serves both **Patients** and **Healthcare Practitioners (Doctors, Locums, Therapists)** based on authenticated credentials.

### Architectural Highlights
* **Single Codebase, Dynamic Personas**: Automatically mounts either the `(patient-tabs)` or `(doctor-tabs)` navigation hierarchy based on the user's role (`PAT-XXXX` vs `DOC-XXXX`/`LOC-XXXX`).
* **Encrypted Keychain Storage**: JWTs, user identities, and affirmative NDPR consent records are stored securely via `expo-secure-store`.
* **Native Telephony Safety Integration**: Emergency symptom triage triggers immediate execution of `Linking.openURL('tel:112')` and `Linking.openURL('tel:767')` alongside a persistent ambulance bar.
* **Offline & Weak-Cellular Fallbacks**: Video encounters feature an automatic low-bandwidth text chat fallback and asynchronous camera/photo-gallery picker for rash/clinical images (`expo-image-picker`).
* **Document Portability**: Verifiable E-Prescription PDFs can be exported, saved, and shared via native share sheets (`expo-sharing`).

---

## 2. Directory & Application Structure

```
apps/mobile/
├── app/
│   ├── _layout.tsx                      # Root Stack layout, AuthProvider & notification listeners
│   ├── index.tsx                        # Unified Auth Gate (Phone/Email/ID + OTP & Demo Persona Switcher)
│   │
│   ├── (patient-tabs)/                  # Patient Mobile Journey
│   │   ├── _layout.tsx                  # Patient Bottom Tab Bar (Canopy Green & Gold accents)
│   │   ├── index.tsx                    # Patient Home ("Talk to Doctor Now" Hero + Persistent Emergency Bar)
│   │   ├── triage.tsx                   # Mandatory 8 Red-Flag Emergency Triage Sheet + Tap-to-Call
│   │   ├── checkout.tsx                 # Paystack/Flutterwave Checkout (Card, Transfer, USSD *737#)
│   │   ├── consultation/[id].tsx        # WebRTC Video/Audio Call + Chat + Rash Camera/Gallery Upload
│   │   └── records.tsx                  # Patient Health Records & PDF E-Prescription Viewer (expo-sharing)
│   │
│   └── (doctor-tabs)/                   # Practitioner & Locum Workspace
│       ├── _layout.tsx                  # Doctor Bottom Tab Bar (Deep Ink & Slate accents)
│       ├── index.tsx                    # Bevel Earnings Bento (₦210,000) & Instant Queue ("Claim Patient")
│       ├── consultation/[id].tsx        # Mobile EHR: Video Call + Structured SOAP Form + E-Prescription Builder
│       └── schedule.tsx                 # Availability Slots & Mandatory Therapy Scheduling Rules
│
├── src/
│   ├── context/
│   │   └── AuthContext.tsx              # SecureStore session manager, role router & consent tracking
│   ├── services/
│   │   └── notifications.ts             # Push notification tokens & local alerts (expo-notifications)
│   └── components/                      # Shared React Native UI components
├── package.json
└── tsconfig.json
```

---

## 3. Core Mobile Workflows

### 1. Role-Switching Navigation Shell
* Users authenticate using their phone number, email, or system identifier (`PAT-XXXX`, `DOC-XXXX`, `LOC-XXXX`) with a 4-digit OTP.
* The root `app/index.tsx` verifies credentials and directs the user:
  * `PATIENT` → dynamically routes to `/(patient-tabs)`
  * `DOCTOR` / `LOCUM` / `THERAPIST` → dynamically routes to `/(doctor-tabs)`
* Built-in one-tap **Evaluator Demo Switchers** allow instant testing between Patient and Doctor interfaces without re-authenticating.

### 2. Patient Mobile Experience (`(patient-tabs)`)
* **Emergency Triage Gate (`triage.tsx`)**:
  * Enforces the 8 PRD Red-Flag Symptoms (chest pain, breathing difficulty, severe bleeding, stroke signs, altered consciousness, anaphylaxis, severe head injury, acute poisoning).
  * Checking any red flag immediately halts the flow and presents the **Ambulance Redirect View** with direct tap-to-call buttons (`112` and `767`).
  * Free-text symptoms are evaluated with clarifying questions where ambiguous.
* **Persistent Emergency Bar**: Remains anchored to the bottom of the screen throughout the patient flow.
* **Mobile Payments (`checkout.tsx`)**:
  * Paystack & Flutterwave checkout modal supporting Nigerian Debit Cards, Bank Transfer, and USSD (`*737#`, `*894#`).
  * Automatically calculates reduced fees (₦5,000) for 14-day clinical follow-ups.
* **Clinical Photo Sharing (`consultation/[id].tsx`)**:
  * Uses `expo-image-picker` with native permissions to take high-resolution photos of skin rashes or wounds during active calls.
* **Prescription Export (`records.tsx`)**:
  * Renders digital prescriptions and triggers native iOS/Android share sheets with `expo-sharing`.

### 3. Doctor & Locum Mobile Experience (`(doctor-tabs)`)
* **Bevel-Style Earnings Bento (`index.tsx`)**:
  * Displays accrued consultation fees for the current biweekly cycle (80% provider rate, ₦7,500/visit).
  * Shows total patients seen with 100% structured note compliance.
  * Real-time countdown to the next biweekly payout (1st and 15th of the month).
  * Instant lobby queue feed with a single-tap **"Claim Next Patient"** action.
* **Mobile Clinical Documentation (`consultation/[id].tsx`)**:
  * Structured SOAP note form (Chief Complaint, History of Present Illness, Assessment, Plan).
  * Mobile E-Prescription builder with dynamic dosage, frequency, and duration rows.
* **Schedule & Availability (`schedule.tsx`)**:
  * Configures 30-minute general medicine slots and 45-minute therapy slots.
  * Enforces the PRD Section 6 rule: **Mental health & therapy consultations strictly require pre-scheduled appointments** (`THERAPY_MANDATORY_SLOT`) and cannot be initiated via the instant lobby queue.
  * Locum surge opt-in toggle for on-call practitioners.

---

## 4. Design Tokens for React Native

React Native uses pure numeric values exported from `@manga/design-system/native`:

```tsx
import {
  nativeColors,
  nativeRadii,
  nativeTypography,
  nativeShadows,
} from '@manga/design-system/native';
```

---

## 5. Local Development & Testing

```bash
# Verify TypeScript compilation (0 errors)
pnpm --filter @manga/mobile typecheck

# Start Expo development server
npx expo start

# Run on iOS Simulator (macOS required)
npx expo run:ios

# Run on Android Emulator
npx expo run:android
```

---

## 6. Build & App Store Distribution (EAS)

The project is pre-configured for **Expo Application Services (EAS Build)**:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build credentials
eas build:configure

# Build production Android APK / AAB
eas build --platform android --profile production

# Build production iOS IPA
eas build --platform ios --profile production
```
