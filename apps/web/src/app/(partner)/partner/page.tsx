import Link from 'next/link';

export default function PartnerPortalPage() {
  return (
    <div className="min-h-screen bg-[#f8f3eb]">
      {/* Header */}
      <header className="border-b border-[#0f3e17]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl text-[#080331]">MANGA</Link>
            <span className="text-xs uppercase bg-[#b1dbb8] text-[#0f3e17] font-semibold px-2 py-0.5 rounded-full">
              Partner Portal (Pharmacy / Lab)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#747679]">Partner ID: <strong className="text-[#080331]">PRT-LAGOS-01</strong></span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-white rounded-[24px] p-8 border border-[#080331]/10 shadow-sm">
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full">
              Section 2.0 Partner Role
            </span>
            <h1 className="font-serif text-3xl text-[#080331] font-normal mt-2">
              Prescription & Diagnostic Lab Order Lookup
            </h1>
            <p className="text-sm text-[#747679] mt-2 leading-relaxed">
              Enter the Patient Public ID (formatted as <code>PAT-XXXX</code>) provided by the patient. Every lookup records an immutable consent access entry in the NDPR <code>audit_log</code>.
            </p>
          </div>

          <form className="mt-8 flex gap-3">
            <input
              type="text"
              placeholder="e.g. PAT-48291"
              className="flex-1 text-sm border border-neutral-200 rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-[#4865ff]"
            />
            <button
              type="button"
              className="bg-[#0f3e17] text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-[#0a3922] transition"
            >
              Verify & Fetch Orders
            </button>
          </form>

          <div className="mt-8 p-4 bg-[#f8f3eb] rounded-xl text-xs text-[#747679] border border-[#080331]/10">
            <strong>NDPR Compliance Notice:</strong> By querying this patient record, you certify that the patient has presented their valid Patient ID at your dispensary or laboratory counter. Unauthorized access is audited under Nigerian Data Protection Regulation (NDPR).
          </div>
        </div>
      </main>
    </div>
  );
}
