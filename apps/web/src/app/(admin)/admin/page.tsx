import Link from 'next/link';

export default function AdminOpsPage() {
  return (
    <div className="min-h-screen bg-[#f8f3eb]">
      {/* Header */}
      <header className="border-b border-[#0f3e17]/10 bg-[#0a3922] text-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-2xl text-white">MANGA</Link>
            <span className="text-xs uppercase bg-[#ff643b] text-white font-semibold px-2 py-0.5 rounded-full">
              Admin & Ops Command Center
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-white/10 px-3 py-1 rounded-full text-white/90">
              NDPR Audit Trail Active
            </span>
            <span>Admin ID: <strong className="text-white">ADM-001</strong></span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Live Lobby Queue & Locum Surge Trigger */}
        <div className="bg-white rounded-[24px] p-8 border border-[#080331]/10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-block uppercase text-[11px] font-semibold tracking-wider text-[#0f3e17] bg-[#e1f4df] px-2.5 py-0.5 rounded-full mb-1">
                PRD Section 4.8 Operational Metric
              </div>
              <h2 className="font-serif text-2xl text-[#080331] font-normal">Live Instant Queue Monitor</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#747679]">Wait Time Threshold: <strong>7 mins</strong></span>
              <button className="bg-[#ff643b] text-white text-xs px-4 py-2 rounded-full font-semibold hover:brightness-105 transition shadow-xs">
                Trigger Urgent Locum Dispatch
              </button>
            </div>
          </div>

          <div className="border border-neutral-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8f3eb] text-xs uppercase tracking-wider text-[#747679]">
                <tr>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Queue Type</th>
                  <th className="p-3">Time in Queue</th>
                  <th className="p-3">Triage Check</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="p-3 font-mono font-medium text-[#080331]">PAT-48291</td>
                  <td className="p-3">INSTANT_QUEUE</td>
                  <td className="p-3 text-[#ff643b] font-semibold">4 mins 12s</td>
                  <td className="p-3 text-[#31ce01] font-semibold">Cleared (0 Red Flags)</td>
                  <td className="p-3">
                    <button className="text-xs text-[#4865ff] font-medium hover:underline">Reassign Doctor</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Emergency-Redirect Event Log */}
        <div className="bg-[#ffede8] rounded-[24px] p-8 border border-[#ff643b]/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-2xl text-[#080331] font-normal">Emergency Redirect Event Log (`emergency_redirect_log`)</h3>
              <p className="text-xs text-[#747679]">Audit trail for patient triage safety incidents and regulatory scrutiny</p>
            </div>
            <span className="text-xs bg-[#ff643b] text-white px-2.5 py-1 rounded-full font-semibold">
              Live Monitoring
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#ff643b]/20 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f3eb] text-[11px] uppercase tracking-wider text-[#747679]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Symptoms Flagged</th>
                  <th className="p-3">Action Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="p-3 font-mono text-[#747679]">2026-11-16 23:15</td>
                  <td className="p-3 font-mono font-medium">PAT-10822</td>
                  <td className="p-3 text-[#ff643b] font-semibold">CHEST_PAIN_PRESSURE</td>
                  <td className="p-3">HALTED & REDIRECTED TO AMBULANCE 112</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
