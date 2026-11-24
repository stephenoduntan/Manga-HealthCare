import React from 'react';
import { HelpCategoryView } from '../../../../components/ecosystem/HelpCategoryView';

export default function HelpPartnersPage() {
  return (
    <HelpCategoryView
      category="partners"
      title="Pharmacy, Lab & Referral Partner Guides"
      subtitle="Counter instructions for Patient ID (PAT-XXXX) lookup, e-prescription dispensing, and NDPR compliance."
      faqs={[
        {
          q: 'What does a Partner Pharmacy see when entering PAT-XXXX?',
          a: 'You see only active e-prescriptions, diagnostic lab orders, and referral notes authorized by the patient—unrelated consultation or therapy notes stay strictly hidden.',
        },
        {
          q: 'What if a patient has forgotten their Patient ID?',
          a: 'Patients can read their PAT-XXXX identifier from the top header or Profile tab of app.mangahealthcare.com or the Manga mobile app.',
        },
      ]}
    />
  );
}
