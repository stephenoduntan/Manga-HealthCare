import React from 'react';
import { LegalSheet } from '../../../components/ecosystem/LegalSheet';
import { LEGAL_DOCS } from '../../../components/ecosystem/ecosystemData';

export default function LegalOverviewPage() {
  return <LegalSheet doc={LEGAL_DOCS['ndpr-privacy']} />;
}
