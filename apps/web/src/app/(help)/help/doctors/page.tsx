import React from 'react';
import { HelpCategoryView } from '../../../../components/ecosystem/HelpCategoryView';

export default function HelpDoctorsPage() {
  return (
    <HelpCategoryView
      category="doctors"
      title="Clinician & Locum Guides"
      subtitle="Documentation for MDCN license verification, Admin-issued Locum IDs (LOC-XXXX), structured SOAP charting, and biweekly payouts."
      faqs={[
        {
          q: 'When does a newly verified doctor go live?',
          a: 'Once Admin/Ops verifies your MDCN Practicing License Number and degree details on admin.mangahealthcare.com, your status updates from Pending to Verified Active.',
        },
        {
          q: 'How are biweekly clinician payouts calculated?',
          a: 'Every completed, SOAP-documented encounter accrues your configured provider share into the biweekly payout ledger, settling every 1st and 15th of the month.',
        },
      ]}
    />
  );
}
