import Link from 'next/link';

export default function MarketingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner: Emergency Disclaimer per PRD Section 4.9 & 6.0 */}
      <div className="bg-[#0a3922] text-[#fffefc] px-4 py-2.5 text-center text-xs tracking-wide font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#ff643b] animate-pulse"></span>
        <span>
          <strong>Emergency Notice:</strong> Manga Healthcare is for non-emergency clinical telemedicine. If experiencing chest pain, severe bleeding, or acute crisis, call <strong>112</strong> immediately.
        </span>
      </div>

      {/* Navigation */}
      <header className="border-b border-[#0f3e17]/10 bg-[#f8f3eb]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0f3e17] flex items-center justify-center text-white font-serif text-xl">
              M
            </div>
            <div>
              <span className="font-serif text-2xl tracking-tight text-[#080331]">MANGA</span>
              <span className="text-xs uppercase tracking-widest text-[#0f3e17] block font-semibold -mt-1">Healthcare</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#222326]">
            <Link href="/patient" className="hover:text-[#4865ff] transition-colors">Patient Portal</Link>
            <Link href="/doctor" className="hover:text-[#4865ff] transition-colors">Doctor Workspace</Link>
            <Link href="/partner" className="hover:text-[#4865ff] transition-colors">Partner Lookup</Link>
            <Link href="/admin" className="hover:text-[#4865ff] transition-colors">Admin / Ops</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/patient"
              className="bg-[#ff643b] text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight hover:brightness-105 transition shadow-sm flex items-center gap-2"
            >
              <span>Talk to Doctor Now</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full flex flex-col justify-center">
        <div className="rounded-[24px] bg-[#e1f4df] p-10 md:p-16 border border-[#b1dbb8]/50 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-block uppercase text-[11px] font-semibold tracking-[0.08em] text-[#0f3e17] bg-[#b1dbb8]/50 px-3 py-1 rounded-full mb-6">
              Clinical Telemedicine & Triage Platform (Beta)
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-[#080331] leading-tight mb-6 font-normal tracking-[-0.03em]">
              Licensed healthcare on demand, anchored by clinical safety.
            </h1>
            <p className="text-[#222326] text-lg mb-8 leading-relaxed">
              Connect with MDCN-verified physicians and therapists in minutes. Complete mandatory red-flag triage, pay securely with Paystack/Flutterwave, and receive structured documentation with verifiable e-prescriptions.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/patient"
                className="bg-[#0f3e17] text-[#fffefc] px-7 py-3.5 rounded-full font-medium hover:bg-[#0a3922] transition shadow-md"
              >
                Enter Patient Lobby
              </Link>
              <Link
                href="/doctor"
                className="bg-white text-[#080331] border border-[#080331]/20 px-7 py-3.5 rounded-full font-medium hover:bg-neutral-50 transition"
              >
                Doctor & Locum Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-8 rounded-[20px] border border-[#080331]/10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#ffede8] text-[#ff643b] flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="font-serif text-xl text-[#080331] mb-2 font-normal">8-Point Emergency Triage</h3>
            <p className="text-[#747679] text-sm leading-relaxed">
              Automated rules-based safety screening prevents acute emergencies from entering telehealth queues, immediately redirecting to 112 ambulance services.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[20px] border border-[#080331]/10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#ebf0f8] text-[#4865ff] flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="font-serif text-xl text-[#080331] mb-2 font-normal">MDCN License Verification</h3>
            <p className="text-[#747679] text-sm leading-relaxed">
              Strict credential vetting for general physicians, therapists, and locum doctors with automated biometric and license validation before going live.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[20px] border border-[#080331]/10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#e1f4df] text-[#0f3e17] flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="font-serif text-xl text-[#080331] mb-2 font-normal">Structured EHR & PDF Rx</h3>
            <p className="text-[#747679] text-sm leading-relaxed">
              Standardized clinical encounter notes (Chief Complaint, HPI, Assessment, Plan) and digitally generated e-prescriptions accessible to partnered pharmacies.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#0f3e17]/10 bg-[#f8f3eb] py-8 text-center text-xs text-[#747679]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Manga Health Limited. Compliant with NDPR & MDCN Telemedicine Guidelines.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:underline">Internal Admin</Link>
            <Link href="/partner" className="hover:underline">Pharmacy & Lab Lookup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
