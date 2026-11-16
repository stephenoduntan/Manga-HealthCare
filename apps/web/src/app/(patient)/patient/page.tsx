import Link from 'next/link';
import { RED_FLAG_SYMPTOMS } from '@manga/api-contract';

export default function PatientDashboardPage() {
  return (
    <div className="min-h-screen bg-[#f8f3eb]">
      {/* Header */}
      <header className="border-b border-[#0f3e17]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl text-[#080331]">MANGA</Link>
            <span className="text-xs uppercase bg-[#ebf0f8] text-[#4865ff] font-semibold px-2 py-0.5 rounded-full">Patient Portal</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#747679]">Patient ID: <strong className="text-[#080331]">PAT-48291</strong></span>
            <div className="w-8 h-8 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center font-bold">
              P
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Instant Lobby Action Card */}
        <div className="bg-white rounded-[24px] p-8 border border-[#080331]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0f3e17] bg-[#e1f4df] px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-[#31ce01] animate-ping"></span>
              Doctors Online & On-Duty
            </div>
            <h1 className="font-serif text-3xl text-[#080331] font-normal">Need to see a doctor right now?</h1>
            <p className="text-[#747679] text-sm mt-1 max-w-xl">
              Initiate our instant lobby triage. You will be matched with the next available general physician or locum doctor within minutes.
            </p>
          </div>
          <button className="bg-[#ff643b] text-white px-7 py-3.5 rounded-full font-semibold hover:brightness-105 transition shadow-sm whitespace-nowrap">
            Start Triage & Join Queue
          </button>
        </div>

        {/* Clinical Safety Preview: 8 Red-Flag Emergency Symptoms */}
        <div className="bg-[#ffede8] rounded-[24px] p-8 border border-[#ff643b]/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#ff643b]"></span>
            <h2 className="font-serif text-2xl text-[#080331] font-normal">Section 6.0 Mandatory Emergency Triage Checklist</h2>
          </div>
          <p className="text-sm text-[#222326] mb-6">
            Prior to joining any queue or confirming a booking, patients must complete this strict screening. If any red flag is present, booking is immediately halted and redirected to emergency medical transport (112).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RED_FLAG_SYMPTOMS.map((symptom, idx) => (
              <div key={symptom.code} className="bg-white/80 p-3.5 rounded-xl border border-[#ff643b]/15 flex items-start gap-3">
                <span className="text-xs font-mono font-bold text-[#ff643b] bg-white px-2 py-0.5 rounded shadow-xs">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#080331]">{symptom.label}</h4>
                  <p className="text-xs text-[#747679] mt-0.5">{symptom.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Records & Prescriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[20px] p-6 border border-[#080331]/10 shadow-sm">
            <h3 className="font-serif text-xl text-[#080331] mb-4 font-normal">Past Consultations</h3>
            <div className="text-sm text-[#747679] py-8 text-center border border-dashed border-[#080331]/15 rounded-xl">
              No previous consultations recorded yet.
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-[#080331]/10 shadow-sm">
            <h3 className="font-serif text-xl text-[#080331] mb-4 font-normal">E-Prescriptions (PDF)</h3>
            <div className="text-sm text-[#747679] py-8 text-center border border-dashed border-[#080331]/15 rounded-xl">
              No prescriptions issued.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
