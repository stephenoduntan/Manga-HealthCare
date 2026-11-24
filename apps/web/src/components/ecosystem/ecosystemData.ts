export interface HelpArticle {
  slug: string;
  category: 'patients' | 'doctors' | 'partners' | 'privacy';
  title: string;
  summary: string;
  steps: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'emergency-triage-and-ambulance-redirect',
    category: 'patients',
    title: 'How the Mandatory 8-Point Emergency Triage Gate Works',
    summary: 'Why Manga Healthcare screens for 8 life-threatening symptoms before allowing consultation payment or lobby entry.',
    steps: [
      'Select your care mode ("Talk to Doctor Now" or Scheduled Calendar) after OTP sign-in.',
      'Review the 8 red-flag emergency symptoms carefully and enter an optional chief complaint.',
      'If any red flag is present, booking halts immediately and displays 112 / 767 ambulance hotlines and nearest Nigerian emergency rooms.',
      'If your free-text contains ambiguous pain terms, answer the single clarifying question to verify safety.',
    ],
  },
  {
    slug: 'paystack-ussd-and-followup-pricing',
    category: 'patients',
    title: 'Paystack, Bank Transfer, USSD & 14-Day Follow-Up Discounts',
    summary: 'Supported Nigerian payment channels and how automatic follow-up pricing works.',
    steps: [
      'Standard GP consultations cost ₦10,000; scheduled therapy sessions cost ₦15,000.',
      'If you completed a consultation with a practitioner within the past 14 days, the ₦5,000 follow-up rate applies automatically.',
      'Choose Card, Direct Bank Transfer, or USSD (*737#, *919#, *894#) on the Paystack / Flutterwave checkout screen.',
    ],
  },
  {
    slug: 'mdcn-verification-and-locum-ids',
    category: 'doctors',
    title: 'MDCN Credential Verification & Locum ID (LOC-XXXX) Activation',
    summary: 'Steps for standard clinicians and on-call locums to clear verification and go live.',
    steps: [
      'Register on doctor.mangahealthcare.com/auth using email or Doctor ID + 6-digit OTP.',
      'Upload your active MDCN folio license number, medical degree details, languages, and fee schedule.',
      'Your profile stays in Pending Verification (cannot go live) until Admin/Ops approves your license.',
      'Locum clinicians receive an Admin-issued LOC-XXXX credential for rapid surge-shift login.',
    ],
  },
  {
    slug: 'structured-soap-and-pdf-eprescriptions',
    category: 'doctors',
    title: 'Completing Structured SOAP Notes & Issuing PDF E-Prescriptions',
    summary: 'Clinical documentation standards required before concluding a remote consultation.',
    steps: [
      'Review the patient’s pinned Allergy Warning, existing conditions, and uploaded photos in the left column.',
      'Complete all four SOAP sections: Chief Complaint, History of Present Illness, Assessment, and Plan.',
      'Add drug rows (Drug, Dosage, Frequency, Duration) in the E-Prescription builder to generate an MDCN-stamped PDF.',
    ],
  },
  {
    slug: 'partner-patient-id-prescription-lookup',
    category: 'partners',
    title: 'Verifying Prescriptions & Lab Orders via Patient ID (PAT-XXXX)',
    summary: 'Counter workflow for community pharmacies, diagnostic labs, and referral clinics.',
    steps: [
      'Log into partner.mangahealthcare.com/auth with your Partner Organization ID and 6-digit OTP.',
      'Ask the patient for their unique PAT-XXXX identifier shown in their Manga app.',
      'Enter PAT-XXXX in the lookup bar to verify NDPR consent and retrieve active e-prescriptions or lab requests.',
      'Mark the order as Fulfilled / Dispensed once completed; every view is recorded in audit_log.',
    ],
  },
  {
    slug: 'ndpr-consent-and-audit-logs',
    category: 'privacy',
    title: 'Understanding NDPR Consent & Immutable Health Record Audit Logs',
    summary: 'How Manga Healthcare safeguards Nigerian patient data under NDPA/NDPR.',
    steps: [
      'Patients grant explicit Telemedicine, NDPR Data Processing, and Emergency Disclaimer consent prior to booking.',
      'All intake fields, rash images, SOAP notes, and PDFs are encrypted in transit and at rest.',
      'Every doctor or partner access writes an immutable timestamped record to audit_log.',
    ],
  },
];

export interface BlogPost {
  slug: string;
  category: 'Patient Health Guides' | 'Mental Health & Therapy' | 'Clinical Practice & Telemedicine' | 'Product & Safety Updates';
  title: string;
  excerpt: string;
  authorName: string;
  authorSlug: string;
  authorRole: string;
  mdcn: string;
  publishedAt: string;
  readTime: string;
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-every-telemedicine-visit-starts-with-red-flag-triage',
    category: 'Product & Safety Updates',
    title: 'Why Every Telemedicine Visit Must Start With an 8-Point Emergency Gate',
    excerpt: 'Remote clinical care should never delay life-saving emergency resuscitation. Inside Manga Healthcare’s non-negotiable triage architecture.',
    authorName: 'Dr. Precious David-Okoro',
    authorSlug: 'dr-precious-david-okoro',
    authorRole: 'Founder & Clinical Governance Lead',
    mdcn: 'MDCN-61042',
    publishedAt: '18 Nov 2026',
    readTime: '4 min read',
    body: [
      'Digital health has transformed primary care access across Lagos, Abuja, and Port Harcourt—but speed without clinical triage creates real danger. A patient experiencing radiating chest pressure or sudden unilateral weakness should never sit in an online waiting queue.',
      'That is why Manga Healthcare enforces a mandatory 8-symptom red-flag checklist prior to payment or queue entry. If any acute flag is selected—or confirmed through our clarifying-question check—the platform halts remote booking immediately.',
      'Instead of an error message, patients see our calm Peach Wash emergency redirect screen with direct tap-to-call dialers for 112 and 767 LASAMBUS ambulance dispatch alongside nearest trauma center contacts.',
    ],
  },
  {
    slug: 'managing-hypertension-and-malaria-safely-online',
    category: 'Patient Health Guides',
    title: 'When to Use Telehealth for Fever, Skin Rashes & Chronic Medication Reviews',
    excerpt: 'Understanding which acute and chronic primary-care issues resolve cleanly over Video, Audio, or low-data Chat.',
    authorName: 'Dr. Chidi Okafor',
    authorSlug: 'dr-chidi-okafor',
    authorRole: 'Senior General Practitioner & Locum Lead',
    mdcn: 'MDCN-78320',
    publishedAt: '14 Nov 2026',
    readTime: '5 min read',
    body: [
      'Uncomplicated malaria symptoms, acute viral upper-respiratory infections, allergic skin rashes, and routine hypertension prescription refills are ideal candidates for structured telemedicine.',
      'Even on 3G mobile networks, Manga patients can switch from HD Video to voice-only Audio or Text Chat while uploading clear clinical photographs of skin lesions directly into the consultation room.',
      'After the consultation, your physician issues a diagnostic lab order or signed PDF E-Prescription verifiable at any partner pharmacy using your Patient ID (PAT-XXXX).',
    ],
  },
  {
    slug: 'protected-calendar-slots-for-mental-health-therapy',
    category: 'Mental Health & Therapy',
    title: 'Why Therapy Appointments Require Dedicated Calendar Slots Instead of Instant Queues',
    excerpt: 'Confidential mental health care needs continuity, preparation, and uninterrupted 45-minute clinical space.',
    authorName: 'Dr. Folake Davies',
    authorSlug: 'dr-folake-davies',
    authorRole: 'Clinical Psychologist & Behavioral Lead',
    mdcn: 'MDCN-65110',
    publishedAt: '10 Nov 2026',
    readTime: '4 min read',
    body: [
      'Unlike a quick 10-minute sore throat check, psychotherapy and behavioral counseling require uninterrupted therapeutic alliance and scheduled continuity with the same clinician.',
      'At the architectural level, Manga Healthcare blocks therapy bookings from entering the ad-hoc instant queue. Patients select a licensed therapist’s protected 45-minute calendar slot.',
      'Furthermore, sensitive therapy notes remain strictly shielded from external pharmacy or lab lookups—partners only ever view authorized prescriptions or lab orders.',
    ],
  },
  {
    slug: 'structured-soap-ehr-for-nigerian-clinicians',
    category: 'Clinical Practice & Telemedicine',
    title: 'Eliminating Unstructured Notes: How SOAP Templates Improve Clinical Safety',
    excerpt: 'Why standardized Chief Complaint, HPI, Assessment, and Plan charting reduces prescribing errors and speeds up biweekly clinician workflows.',
    authorName: 'Dr. Chidi Okafor',
    authorSlug: 'dr-chidi-okafor',
    authorRole: 'Senior General Practitioner & Locum Lead',
    mdcn: 'MDCN-78320',
    publishedAt: '05 Nov 2026',
    readTime: '6 min read',
    body: [
      'Traditional free-text medical notes make 14-day follow-up reviews slow and error-prone. Manga’s split-screen Slate Hush EHR workspace pairs patient allergy alerts directly beside structured SOAP inputs.',
      'Every drug row entered in the E-Prescription builder auto-renders a cryptographically stamped PDF ready for pharmacy verification at partner.mangahealthcare.com.',
    ],
  },
];

export interface LegalSectionDoc {
  slug: 'terms' | 'ndpr-privacy' | 'telemedicine-consent' | 'emergency-disclaimer' | 'clinician-compliance';
  title: string;
  version: string;
  effectiveDate: string;
  summary: string;
  clauses: Array<{ heading: string; body: string }>;
}

export const LEGAL_DOCS: Record<LegalSectionDoc['slug'], LegalSectionDoc> = {
  terms: {
    slug: 'terms',
    title: 'Terms of Service',
    version: 'Beta v1.2',
    effectiveDate: '01 Nov 2026',
    summary: 'Governing contractual terms for Patients, Doctors/Therapists, Locums, and Fulfillment Partners using the Manga Healthcare ecosystem.',
    clauses: [
      {
        heading: '1. Scope of Non-Emergency Telemedicine',
        body: 'Manga Healthcare Ltd provides a digital healthcare platform connecting patients with MDCN-licensed practitioners for non-emergency medical consultations and therapy sessions. Remote consultations do not replace in-person hospital stabilization or emergency surgical care.',
      },
      {
        heading: '2. Role Isolation & Account Authentication',
        body: 'Each user role operates on dedicated portals (app.mangahealthcare.com, doctor.mangahealthcare.com, partner.mangahealthcare.com, and admin.mangahealthcare.com) authenticated via time-sensitive OTP verification.',
      },
      {
        heading: '3. Consultation Fees & Refund Policy',
        body: 'Consultations are billed transparently per encounter via Paystack or Flutterwave (Card, Bank Transfer, USSD). Bookings halted during pre-payment emergency triage incur zero charges. Verified clinician no-shows qualify for instant re-assignment or full refund via Admin/Ops.',
      },
    ],
  },
  'ndpr-privacy': {
    slug: 'ndpr-privacy',
    title: 'NDPR Data Processing & Privacy Policy',
    version: 'NDPA/NDPR v1.4',
    effectiveDate: '01 Nov 2026',
    summary: 'How Manga Healthcare encrypts, stores, audits, and restricts access to personal health information under Nigerian Data Protection law.',
    clauses: [
      {
        heading: '1. Explicit Affirmative Consent',
        body: 'Health intake records (allergies, existing conditions, current medications, preferred language) are collected only after explicit affirmative NDPR consent during patient onboarding.',
      },
      {
        heading: '2. Encryption in Transit & at Rest',
        body: 'All web, mobile, and API traffic operates exclusively over TLS. Consultation notes, clinical photos (e.g., rash uploads), and PDF prescriptions are encrypted at rest.',
      },
      {
        heading: '3. Immutable NDPR Access Audit Trail (audit_log)',
        body: 'Every read/write inspection of a patient medical record by a physician, admin officer, or external partner pharmacy writes an immutable record to audit_log detailing actor ID, timestamp, and resource scope.',
      },
      {
        heading: '4. Scoped Need-to-Know Access for Partners',
        body: 'Pharmacies and laboratories querying PAT-XXXX on partner.mangahealthcare.com can view only active e-prescriptions, lab requests, and referral notes—private therapy notes remain strictly inaccessible.',
      },
    ],
  },
  'telemedicine-consent': {
    slug: 'telemedicine-consent',
    title: 'Telemedicine Informed Consent',
    version: 'MDCN Consent v1.1',
    effectiveDate: '01 Nov 2026',
    summary: 'Mandatory disclosure of capabilities, clinical limitations, and patient responsibilities for remote Video, Audio, and Chat care.',
    clauses: [
      {
        heading: '1. Nature of Remote Evaluation',
        body: 'Telemedicine relies on visual, auditory, and patient-reported information without physical palpation or vital-sign telemetry unless provided by the patient.',
      },
      {
        heading: '2. Right to Escalate to In-Person Care',
        body: 'Practitioners may conclude any consultation with a diagnostic lab request or specialist hospital referral whenever remote evaluation is insufficient for safe clinical management.',
      },
    ],
  },
  'emergency-disclaimer': {
    slug: 'emergency-disclaimer',
    title: 'Emergency-Use Disclaimer & Triage Protocol',
    version: 'Safety Gate v1.0',
    effectiveDate: '01 Nov 2026',
    summary: 'Regulatory disclosure outlining the 8 acute red-flag symptoms that trigger mandatory booking halts and emergency ambulance redirection.',
    clauses: [
      {
        heading: '1. The 8 Mandatory Red-Flag Symptoms',
        body: 'Booking is immediately halted if a patient reports: (1) Chest pain/pressure, (2) Difficulty breathing, (3) Severe/uncontrolled bleeding, (4) Sudden weakness/facial drooping/slurred speech, (5) Loss of consciousness or seizure, (6) Severe allergic reaction, (7) Suicidal ideation or self-harm intent, or (8) Severe abdominal pain/bleeding in pregnancy.',
      },
      {
        heading: '2. Persistent Tap-to-Call Hotlines & Audit Logging',
        body: 'All red-flag halts record an entry in emergency_redirect_log, notify Ops on admin.mangahealthcare.com, and present direct tap-to-call access for 112 and 767 (LASAMBUS) ambulance dispatch.',
      },
    ],
  },
  'clinician-compliance': {
    slug: 'clinician-compliance',
    title: 'MDCN Practitioner & Locum Compliance Policy',
    version: 'Clinical Ops v1.3',
    effectiveDate: '01 Nov 2026',
    summary: 'Credential verification rules, clinical charting duties, and biweekly payout terms for participating clinicians.',
    clauses: [
      {
        heading: '1. Pre-Activation MDCN License Vetting',
        body: 'Doctors and Therapists cannot go live or claim patients until Admin/Ops verifies their MDCN Practicing License Number and degree certificates. Vetted locums receive an Admin-issued LOC-XXXX identifier.',
      },
      {
        heading: '2. Mandatory SOAP Completion & Biweekly Ledger',
        body: 'Every consultation automatically logs start_time and end_time. Practitioners must submit structured SOAP notes prior to encounter closure; accrued provider fees settle on a transparent biweekly ledger cycle.',
      },
    ],
  },
};
