'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  colors,
  shadows,
  EmergencyTriageChecklist,
  TalkToDoctorLobbyCard,
  DoctorPayoutBento,
  StructuredSOAPForm,
  EPrescriptionBuilder,
  PersistentEmergencyBar,
} from '@manga/design-system';

export default function DesignSystemShowcasePage() {
  const [triageHaltLog, setTriageHaltLog] = useState<string | null>(null);
  const [showPersistentBar, setShowPersistentBar] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8f3eb] pb-32 text-[#222326]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-[#f8f3eb]/95 backdrop-blur border-b border-[#0f3e17]/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl text-[#080331]">
              MANGA
            </Link>
            <span className="text-xs uppercase bg-[#e1f4df] text-[#0f3e17] font-semibold px-2.5 py-0.5 rounded-full">
              Clinical Design System v1.0
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-[#747679]">
              August Health • Bevel • Ease • Chat for Impact
            </span>
            <Link
              href="/"
              className="bg-[#0f3e17] text-white px-4 py-2 rounded-full font-medium hover:bg-[#0a3922] transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Page Hero */}
        <section className="space-y-4">
          <div className="inline-block eyebrow-label text-[#0f3e17] bg-[#b1dbb8]/40 px-3 py-1 rounded-full">
            Synthesized Clinical Specification
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#080331] leading-tight max-w-3xl">
            Humanist Healthcare Design System
          </h1>
          <p className="text-[#747679] text-base md:text-lg max-w-2xl leading-relaxed">
            Engineered for clinical safety, regulatory NDPR compliance, and patient calm.
            Synthesizing Warm Cream Canvas, regular-weight editorial serif typography, botanical greenhouse panels, and urgent emergency ambulance redirection.
          </p>
        </section>

        {/* SECTION 1: COLOR PALETTE & SURFACES */}
        <section className="space-y-6">
          <div className="border-b border-[#080331]/10 pb-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#080331]">1. Synthesized Palette & Surfaces</h2>
            <span className="text-xs text-[#747679]">11 Canonical Tokens</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Swatch 1: Warm Cream Canvas */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl border border-neutral-200 bg-[#f8f3eb]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Warm Cream Canvas</div>
                <div className="text-[11px] font-mono text-[#747679]">#f8f3eb</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">August Page Base</div>
              </div>
            </div>

            {/* Swatch 2: Paper White */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl border border-neutral-200 bg-[#ffffff]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Paper White</div>
                <div className="text-[11px] font-mono text-[#747679]">#ffffff</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Clinical Forms / Inner Cards</div>
              </div>
            </div>

            {/* Swatch 3: Keylime Wash */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#e1f4df]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Keylime Wash</div>
                <div className="text-[11px] font-mono text-[#747679]">#e1f4df</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Ease Hero & Intake Wash</div>
              </div>
            </div>

            {/* Swatch 4: Sage Mist */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#b1dbb8]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Sage Mist</div>
                <div className="text-[11px] font-mono text-[#747679]">#b1dbb8</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Secondary Clinical Panels</div>
              </div>
            </div>

            {/* Swatch 5: Slate Hush */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#b6ced5]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Slate Hush</div>
                <div className="text-[11px] font-mono text-[#747679]">#b6ced5</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Doctor EHR Workspace</div>
              </div>
            </div>

            {/* Swatch 6: Cloud Card */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#ebf0f8]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Cloud Card</div>
                <div className="text-[11px] font-mono text-[#747679]">#ebf0f8</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Bevel Payout Bento</div>
              </div>
            </div>

            {/* Swatch 7: Canopy Green */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#0a3922]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Canopy Green</div>
                <div className="text-[11px] font-mono text-[#747679]">#0a3922</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Chat for Impact Hero</div>
              </div>
            </div>

            {/* Swatch 8: Deep Ink */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#080331]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Deep Ink</div>
                <div className="text-[11px] font-mono text-[#747679]">#080331</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Primary Headlines</div>
              </div>
            </div>

            {/* Swatch 9: Forest Ink */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#0f3e17]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Forest Ink</div>
                <div className="text-[11px] font-mono text-[#747679]">#0f3e17</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">Botanical Actions</div>
              </div>
            </div>

            {/* Swatch 10: Primary Indigo */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#4865ff]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Primary Indigo</div>
                <div className="text-[11px] font-mono text-[#747679]">#4865ff</div>
                <div className="text-[10px] text-[#0f3e17] mt-0.5">August Web CTA</div>
              </div>
            </div>

            {/* Swatch 11: Coral Pulse */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#ff643b]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Coral Pulse</div>
                <div className="text-[11px] font-mono text-[#747679]">#ff643b</div>
                <div className="text-[10px] text-[#ff643b] mt-0.5">Urgent Queue & Ambulance</div>
              </div>
            </div>

            {/* Swatch 12: Peach Wash (Emergency) */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
              <div className="w-full h-16 rounded-xl bg-[#ffede8]" />
              <div>
                <div className="font-semibold text-xs text-[#080331]">Peach Wash</div>
                <div className="text-[11px] font-mono text-[#747679]">#ffede8</div>
                <div className="text-[10px] text-[#ff643b] mt-0.5">Calm Triage Redirect</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: EDITORIAL TYPOGRAPHY & ELEVATION RULES */}
        <section className="space-y-6">
          <div className="border-b border-[#080331]/10 pb-3">
            <h2 className="font-serif text-2xl text-[#080331]">2. Editorial Typography & Warm Elevation</h2>
            <p className="text-xs text-[#747679] mt-1">
              Strict Rule: Serif headings MUST be regular weight (400) or light (300). Bold serifs are strictly prohibited.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[20px] border border-neutral-200 space-y-4">
              <span className="eyebrow-label text-[#0f3e17]">Editorial Serif Hierarchy</span>
              <div className="space-y-3">
                <div className="font-serif text-4xl text-[#080331]">
                  Headline Large (48px, Weight 400)
                </div>
                <div className="font-serif text-2xl text-[#080331]">
                  Section Subheading (24px, Weight 400)
                </div>
                <p className="text-sm text-[#747679] leading-relaxed">
                  Notice the quiet literary authority. Unlike shouty bold enterprise software, regular-weight serif display typography communicates empathy, precision, and patient safety.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[20px] border border-neutral-200 space-y-4">
              <span className="eyebrow-label text-[#4865ff]">Warm Brown Elevation Shadows</span>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white text-xs font-mono text-[#080331] shadow-[0_12px_24px_rgba(75,68,57,0.1)]">
                  shadows.warmLg: rgba(75, 68, 57, 0.1) 0px 12px 24px 0px
                </div>
                <div className="p-4 rounded-xl bg-white text-xs font-mono text-[#080331] shadow-[0_4px_4px_rgba(75,68,57,0.05)]">
                  shadows.warmSm: rgba(75, 68, 57, 0.05) 0px 4px 4px 0px
                </div>
                <p className="text-xs text-[#747679]">
                  Shadows avoid sterile gray/black offsets, using warm brown tinted shadows (<code className="text-[#080331]">rgba(75,68,57,0.1)</code>) that fuse harmoniously with the Warm Cream Canvas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: PRD COMPONENT 1 — EMERGENCY TRIAGE CHECKLIST */}
        <section className="space-y-4">
          <div className="border-b border-[#080331]/10 pb-3">
            <span className="eyebrow-label text-[#ff643b]">PRD Component 01</span>
            <h2 className="font-serif text-3xl text-[#080331] mt-1">
              Emergency Triage Checklist & Ambulance Redirect Modal
            </h2>
            <p className="text-xs text-[#747679]">
              Paper White card over Warm Cream canvas. Evaluates the 8 red flags from PRD Section 6.0 and triggers the calm Peach Wash redirect modal.
            </p>
          </div>

          <EmergencyTriageChecklist
            onTriagePass={() => setTriageHaltLog('Triage Cleared: Proceeding to instant queue or booking.')}
            onTriageHalt={(flags) => setTriageHaltLog(`Emergency Halted: Flagged symptoms: ${flags.join(', ')}`)}
          />

          {triageHaltLog && (
            <div className="max-w-3xl mx-auto p-3.5 bg-white rounded-xl border border-neutral-200 text-xs font-mono text-[#080331]">
              <strong>Event State:</strong> {triageHaltLog}
            </div>
          )}
        </section>

        {/* SECTION 4: PRD COMPONENT 2 — TALK TO DOCTOR LOBBY CARD */}
        <section className="space-y-4">
          <div className="border-b border-[#080331]/10 pb-3">
            <span className="eyebrow-label text-[#0f3e17]">PRD Component 02</span>
            <h2 className="font-serif text-3xl text-[#080331] mt-1">
              Talk to Doctor Now — Instant Lobby Card
            </h2>
            <p className="text-xs text-[#747679]">
              Canopy Green (#0a3922) high-contrast status card with live queue position, estimated wait time, Coral Pulse CTA, and Ghost Outline button.
            </p>
          </div>

          <TalkToDoctorLobbyCard
            queuePosition={2}
            estimatedWaitMinutes={4}
            doctorsOnline={8}
            onJoinQueue={() => alert('Entering Redis-backed lobby queue...')}
            onScheduleSlot={() => alert('Opening calendar slot picker...')}
          />
        </section>

        {/* SECTION 5: PRD COMPONENT 3 — DOCTOR PAYOUT BENTO */}
        <section className="space-y-4">
          <div className="border-b border-[#080331]/10 pb-3">
            <span className="eyebrow-label text-[#415eee]">PRD Component 03</span>
            <h2 className="font-serif text-3xl text-[#080331] mt-1">
              Doctor Payout Bento (Bevel Style)
            </h2>
            <p className="text-xs text-[#747679]">
              Cloud Card (#ebf0f8, 24px radius, 32px padding) displaying total patients seen, consultation fees accrued, and biweekly settlement countdown ring in #31ce01 Recovery Green.
            </p>
          </div>

          <DoctorPayoutBento
            doctorName="Dr. Precious David-Okoro"
            providerId="DOC-001"
            totalPatientsSeen={38}
            accruedFeesNgn={342000}
            daysUntilBiweeklyPayout={3}
            verificationStatus="VERIFIED"
          />
        </section>

        {/* SECTION 6: PRD COMPONENT 4 & 4B — STRUCTURED SOAP NOTE & E-PRESCRIPTION */}
        <section className="space-y-6">
          <div className="border-b border-[#080331]/10 pb-3">
            <span className="eyebrow-label text-[#080331]">PRD Component 04 & 04b</span>
            <h2 className="font-serif text-3xl text-[#080331] mt-1">
              Structured SOAP Form & E-Prescription Builder (Ease + August EHR)
            </h2>
            <p className="text-xs text-[#747679]">
              Slate Hush (#b6ced5) outer workspace panel housing Paper White cards (14px radius) for Chief Complaint, HPI, Assessment, Plan, and dynamic Drug/Dosage/Frequency rows.
            </p>
          </div>

          <div className="space-y-8">
            <StructuredSOAPForm
              patientId="PAT-48291"
              patientName="Amaka Adeleke"
              onSave={(data) => alert(`Saved SOAP Note:\n${JSON.stringify(data, null, 2)}`)}
            />

            <EPrescriptionBuilder
              patientId="PAT-48291"
              patientName="Amaka Adeleke"
              doctorName="Dr. Precious David-Okoro"
              mdcnNumber="MDCN-78320"
              onGeneratePdf={(items) =>
                alert(`Generating PDF with ${items.length} items for pharmacy partner lookup.`)
              }
            />
          </div>
        </section>

        {/* SECTION 7: PRD COMPONENT 5 — PERSISTENT EMERGENCY BAR */}
        <section className="space-y-4">
          <div className="border-b border-[#080331]/10 pb-3 flex items-center justify-between">
            <div>
              <span className="eyebrow-label text-[#ff643b]">PRD Component 05</span>
              <h2 className="font-serif text-3xl text-[#080331] mt-1">
                Persistent Emergency Safety Bar
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowPersistentBar(!showPersistentBar)}
              className="text-xs underline text-[#080331]"
            >
              {showPersistentBar ? 'Hide Bottom Bar' : 'Show Bottom Bar'}
            </button>
          </div>
          <p className="text-xs text-[#747679]">
            Keeps national (112) and ambulance (767) hotlines 1 tap away even if the patient dismisses the redirect modal. Pinned to the viewport bottom.
          </p>
        </section>
      </main>

      {/* PRD Component 5: Persistent Emergency Bar (Sticky Bottom) */}
      {showPersistentBar && (
        <PersistentEmergencyBar
          ambulanceNumber="112"
          lagosEmergencyNumber="767"
          message="Clinical Safety Guarantee: In life-threatening emergencies or acute trauma, tap immediately for ambulance dispatch:"
        />
      )}
    </div>
  );
}
