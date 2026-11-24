import React from 'react';
import { HelpCategoryView } from '../../../../components/ecosystem/HelpCategoryView';

export default function HelpPatientsPage() {
  return (
    <HelpCategoryView
      category="patients"
      title="Patient Support & Triage Guides"
      subtitle="Everything you need to know about OTP onboarding, emergency triage screening, Paystack/USSD checkout, and PDF prescriptions."
      faqs={[
        {
          q: 'Why does Manga Healthcare ask 8 emergency questions before booking?',
          a: 'Remote telemedicine cannot safely stabilize heart attacks, strokes, or acute trauma. Our mandatory screen ensures red-flag patients immediately see 112 / 767 ambulance dialers before paying.',
        },
        {
          q: 'Can I switch from Video to Audio or Chat if my network drops?',
          a: 'Yes. Inside app.mangahealthcare.com/consultation, tap the Video or Chat toggle anytime without losing session notes or uploaded clinical photos.',
        },
      ]}
    />
  );
}
