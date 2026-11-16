import Link from 'next/link';

export default function DoctorWorkspacePage() {
  return (
    <div className="min-h-screen bg-[#f8f3eb]">
      {/* Header */}
      <header className="border-b border-[#0f3e17]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl text-[#080331]">MANGA</Link>
            <span className="text-xs uppercase bg-[#b6ced5] text-[#080331] font-semibold px-2 py-0.5 rounded-full">Clinical Workspace</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-xs bg-[#e1f4df] text-[#0f3e17] px-2.5 py-1 rounded-full font-semibold border border-[#b1dbb8]">
              MDCN: Verified (#MDCN-78320)
            </span>
            <span className="text-[#747679]">Provider ID: <strong className="text-[#080331]">LOC-9941</strong></span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Bento Stat Cards (Cloud Card design per rules.md) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#ebf0f8] rounded-[24px] p-6 border border-[#4865ff]/20">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4865ff] block mb-2">
              Patients In Instant Queue
            </span>
            <div className="text-4xl font-serif text-[#080331]">3</div>
            <p className="text-xs text-[#747679] mt-2">Ready for instant consultation claim</p>
          </div>

          <div className="bg-[#ebf0f8] rounded-[24px] p-6 border border-[#4865ff]/20">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0f3e17] block mb-2">
              Biweekly Accrued Payout
            </span>
            <div className="text-4xl font-serif text-[#080331]">₦145,000</div>
            <p className="text-xs text-[#747679] mt-2">Next settlement: Friday, Biweekly cycle</p>
          </div>

          <div className="bg-[#ebf0f8] rounded-[24px] p-6 border border-[#4865ff]/20">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#080331] block mb-2">
              Completed Consultations
            </span>
            <div className="text-4xl font-serif text-[#080331]">18</div>
            <p className="text-xs text-[#747679] mt-2">100% structured note compliance</p>
          </div>
        </div>

        {/* Structured Clinical Documentation Preview */}
        <div className="bg-white rounded-[24px] p-8 border border-[#080331]/10 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <div>
              <h2 className="font-serif text-2xl text-[#080331] font-normal">Active Encounter Clinical Note Form</h2>
              <p className="text-xs text-[#747679] mt-0.5">Mandatory structured documentation per PRD Section 4.6</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-[#e1f4df] text-[#0f3e17] rounded-full">
              Patient: PAT-48291
            </span>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#747679] mb-1">
                  1. Chief Complaint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sore throat and mild fever for 3 days"
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff]"
                  readOnly
                  value="Low-grade fever and nasal congestion for 2 days"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#747679] mb-1">
                  2. History of Present Illness (HPI)
                </label>
                <input
                  type="text"
                  placeholder="Detailed chronology, severity, aggravating factors"
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff]"
                  readOnly
                  value="Patient reports gradual onset rhinitis, no shortness of breath, no chest pain."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#747679] mb-1">
                  3. Clinical Assessment / Diagnosis
                </label>
                <input
                  type="text"
                  placeholder="Provisional diagnosis or clinical assessment"
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff]"
                  readOnly
                  value="Acute viral upper respiratory tract infection (URTI)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#747679] mb-1">
                  4. Plan & Non-Pharmacological Advice
                </label>
                <input
                  type="text"
                  placeholder="Management plan, hydration, warning signs"
                  className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#4865ff]"
                  readOnly
                  value="Adequate hydration, steam inhalation, paracetamol for fever, review if symptoms worsen."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                className="bg-[#0f3e17] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#0a3922] transition"
              >
                Save Encounter & Generate E-Prescription PDF
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
