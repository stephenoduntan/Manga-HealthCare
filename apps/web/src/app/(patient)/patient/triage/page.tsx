'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import { EmergencyTriageChecklist } from '@manga/design-system';
import { evaluateTriage, RedFlagCode } from '@manga/api-contract';

export default function PatientTriageInterceptorPage() {
  const router = useRouter();
  const [patientId] = useState('PAT-48291');
  const [chiefComplaint, setChiefComplaint] = useState(
    'Fever, sore throat and mild fatigue for 2 days'
  );
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [clarificationAnswer, setClarificationAnswer] = useState('');

  const runEvaluation = (selectedCodes: string[]) => {
    const result = evaluateTriage({
      patient_id: patientId,
      selected_red_flags: selectedCodes as RedFlagCode[],
      chief_complaint: chiefComplaint,
      clarification_response: clarificationAnswer || undefined,
    });

    if (result.status === 'HALT_AND_REDIRECT') {
      const flagsParam = encodeURIComponent(result.symptoms_flagged.join(','));
      router.push(`/patient/triage/emergency-redirect?flags=${flagsParam}`);
    } else if (result.status === 'ASK_CLARIFYING_QUESTION') {
      setClarificationQuestion(
        result.clarifying_question || 'Where is the pain located and how severe is it?'
      );
    } else {
      router.push('/patient/book?triage=cleared');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <span className="eyebrow-label text-[#ff643b] bg-[#ffede8] px-3 py-1 rounded-full border border-[#ff643b]/30">
          Mandatory Safety Interceptor (/patient/triage)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#080331] font-normal mt-2">
          Emergency-Symptom Safety Screen
        </h1>
        <p className="text-xs sm:text-sm text-[#747679] mt-1">
          Required before entering &ldquo;Talk to Doctor Now&rdquo; or booking a calendar slot.
        </p>
      </div>

      {/* Optional Brief Symptom Note */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#efeeeb] shadow-[0_8px_20px_rgba(75,68,57,0.06)] space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#080331]">
          Optional Brief Symptom Note (Chief Complaint)
        </label>
        <textarea
          rows={2}
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="Describe your symptoms (e.g. headache, cough, skin rash). Note: vague terms like 'severe pain' will prompt a clarifying question."
          className="w-full text-sm border border-neutral-200 rounded-xl p-3 bg-[#f8f3eb]/20 focus:outline-none focus:border-[#4865ff]"
        />
      </div>

      {/* Single Clarifying Question Prompt */}
      {clarificationQuestion && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runEvaluation([]);
          }}
          className="bg-[#ebf0f8] rounded-3xl p-6 sm:p-8 border border-[#4865ff]/30 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4865ff] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Single Clarifying Question</span>
          </div>
          <p className="text-sm font-medium text-[#080331]">{clarificationQuestion}</p>
          <input
            type="text"
            value={clarificationAnswer}
            onChange={(e) => setClarificationAnswer(e.target.value)}
            placeholder="Specify anatomical location & whether there is chest pressure or breathing trouble..."
            className="w-full text-sm border border-neutral-300 rounded-xl p-3 bg-white focus:outline-none focus:border-[#4865ff]"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#4865ff] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Submit Clarification & Re-Evaluate
            </button>
          </div>
        </form>
      )}

      {/* 8-Point Emergency Red-Flag Checklist */}
      <EmergencyTriageChecklist
        onTriagePass={() => runEvaluation([])}
        onTriageHalt={(flags) => runEvaluation(flags)}
      />
    </div>
  );
}
