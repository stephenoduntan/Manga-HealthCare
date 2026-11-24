'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, AlertTriangle, HelpCircle, BookOpen, Scale } from 'lucide-react';
import { PersistentEmergencyBar } from '@manga/design-system';
import { getPortalUrl, PortalSurface } from '../../lib/domains';

export interface EcosystemChromeProps {
  activeSurface: 'marketing' | 'doctor' | 'partner' | 'help' | 'blog' | 'legal';
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
}

export function EcosystemTopBar({ activeSurface }: { activeSurface: EcosystemChromeProps['activeSurface'] }) {
  const roleLinks: Array<{ surface: PortalSurface; label: string; domainHint: string }> = [
    { surface: 'marketing', label: 'For Patients', domainHint: 'mangahealthcare.com' },
    { surface: 'doctor', label: 'For Doctors & Therapists', domainHint: 'doctor.mangahealthcare.com' },
    { surface: 'partner', label: 'For Pharmacies & Labs', domainHint: 'partner.mangahealthcare.com' },
  ];

  return (
    <div className="bg-[#0a3922] text-[#fffefc] px-4 py-2 text-[11px] border-b border-[#ff643b]/25">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          {roleLinks.map((item) => {
            const isCurrent = activeSurface === item.surface;
            return (
              <Link
                key={item.surface}
                href={getPortalUrl(item.surface, '/')}
                className={`transition inline-flex items-center gap-1.5 ${
                  isCurrent ? 'text-[#31ce01] font-semibold' : 'text-[#cfe7d3] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className="hidden md:inline opacity-65 font-mono text-[10px]">({item.domainHint})</span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[#cfe7d3]">
          <Link
            href={getPortalUrl('help', '/')}
            className={`hover:text-white inline-flex items-center gap-1 ${
              activeSurface === 'help' ? 'text-[#31ce01] font-semibold' : ''
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>Help Centre</span>
          </Link>
          <Link
            href={getPortalUrl('blog', '/')}
            className={`hover:text-white inline-flex items-center gap-1 ${
              activeSurface === 'blog' ? 'text-[#31ce01] font-semibold' : ''
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Blog</span>
          </Link>
          <Link
            href={getPortalUrl('legal', '/emergency-disclaimer')}
            className="text-[#ffede8] hover:text-[#ff643b] inline-flex items-center gap-1 font-semibold"
          >
            <AlertTriangle className="w-3 h-3 text-[#ff643b]" />
            <span>Emergency Protocol (112)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EcosystemCapsuleNav({ activeSurface }: { activeSurface: EcosystemChromeProps['activeSurface'] }) {
  const pathname = usePathname();

  const subtitleMap: Record<EcosystemChromeProps['activeSurface'], string> = {
    marketing: 'Clinical Telemedicine',
    doctor: 'For Clinicians',
    partner: 'Partner Network',
    help: 'Help Centre',
    blog: 'Clinical Journal',
    legal: 'NDPR & Legal Hub',
  };

  const navConfig: Record<EcosystemChromeProps['activeSurface'], NavItem[]> = {
    marketing: [
      { label: 'Features', href: getPortalUrl('marketing', '/features') },
      { label: 'How It Works', href: getPortalUrl('marketing', '/how-it-works') },
      { label: 'Pricing', href: getPortalUrl('marketing', '/pricing') },
      { label: 'Getting Started', href: getPortalUrl('marketing', '/getting-started') },
      { label: 'About Us', href: getPortalUrl('marketing', '/about') },
      { label: 'Contact', href: getPortalUrl('marketing', '/contact') },
    ],
    doctor: [
      { label: 'Features', href: getPortalUrl('doctor', '/features') },
      { label: 'How It Works', href: getPortalUrl('doctor', '/how-it-works') },
      { label: 'Compensation', href: getPortalUrl('doctor', '/pricing') },
      { label: 'Requirements', href: getPortalUrl('doctor', '/getting-started') },
      { label: 'About Us', href: getPortalUrl('doctor', '/about') },
      { label: 'Contact', href: getPortalUrl('doctor', '/contact') },
    ],
    partner: [
      { label: 'Features', href: getPortalUrl('partner', '/features') },
      { label: 'How It Works', href: getPortalUrl('partner', '/how-it-works') },
      { label: 'Partnership', href: getPortalUrl('partner', '/pricing') },
      { label: 'Getting Started', href: getPortalUrl('partner', '/getting-started') },
      { label: 'About Us', href: getPortalUrl('partner', '/about') },
      { label: 'Contact', href: getPortalUrl('partner', '/contact') },
    ],
    help: [
      { label: 'Search Hub', href: getPortalUrl('help', '/') },
      { label: 'Patients', href: getPortalUrl('help', '/patients') },
      { label: 'Doctors & Locums', href: getPortalUrl('help', '/doctors') },
      { label: 'Partners', href: getPortalUrl('help', '/partners') },
      { label: 'Contact Support', href: getPortalUrl('help', '/contact') },
    ],
    blog: [
      { label: 'All Articles', href: getPortalUrl('blog', '/') },
      { label: 'Patient Guides', href: getPortalUrl('blog', '/?cat=patient') },
      { label: 'Mental Health', href: getPortalUrl('blog', '/?cat=therapy') },
      { label: 'Clinician Journal', href: getPortalUrl('blog', '/?cat=clinical') },
    ],
    legal: [
      { label: 'Overview', href: getPortalUrl('legal', '/') },
      { label: 'Terms', href: getPortalUrl('legal', '/terms') },
      { label: 'NDPR Privacy', href: getPortalUrl('legal', '/ndpr-privacy') },
      { label: 'Telemedicine Consent', href: getPortalUrl('legal', '/telemedicine-consent') },
      { label: 'Emergency', href: getPortalUrl('legal', '/emergency-disclaimer') },
    ],
  };

  const homeHref = getPortalUrl(activeSurface, '/');

  return (
    <header className="sticky top-3 z-40 px-4 md:px-8 py-2">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-[#efeeeb] rounded-full px-5 py-3 shadow-[0_8px_24px_rgba(75,68,57,0.08)] flex items-center justify-between gap-4">
        <Link href={homeHref} className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-[#0a3922] flex items-center justify-center text-[#e1f4df] font-serif text-lg group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl tracking-tight text-[#080331] leading-none block">
              MANGA HEALTHCARE
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#0f3e17] font-semibold block mt-0.5">
              {subtitleMap[activeSurface]}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-[11px] font-semibold uppercase tracking-wider text-[#747679]">
          {navConfig[activeSurface].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`transition-colors py-1 ${
                  isActive ? 'text-[#0a3922] border-b-2 border-[#0a3922]' : 'hover:text-[#0a3922]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions per Subdomain Spec */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSurface === 'doctor' ? (
            <>
              <Link
                href={getPortalUrl('doctor', '/auth')}
                className="hidden sm:inline-flex text-xs font-semibold text-[#080331] border border-[#080331]/20 px-4 py-2 rounded-full hover:bg-neutral-50 transition"
              >
                Practitioner Login
              </Link>
              <Link
                href={getPortalUrl('doctor', '/auth?mode=apply')}
                className="bg-[#0f3e17] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#0a3922] transition inline-flex items-center gap-1.5"
              >
                <span>Apply to Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : activeSurface === 'partner' ? (
            <>
              <Link
                href={getPortalUrl('partner', '/auth')}
                className="hidden sm:inline-flex text-xs font-semibold text-[#080331] border border-[#080331]/20 px-4 py-2 rounded-full hover:bg-neutral-50 transition"
              >
                Partner Login
              </Link>
              <Link
                href={getPortalUrl('partner', '/getting-started')}
                className="bg-[#4865ff] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition inline-flex items-center gap-1.5"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href={getPortalUrl('patient', '/auth')}
                className="hidden sm:inline-flex text-xs font-semibold text-[#080331] border border-[#080331]/20 px-4 py-2 rounded-full hover:bg-neutral-50 transition"
              >
                Sign In
              </Link>
              <Link
                href={getPortalUrl('patient', '/auth?intent=instant')}
                className="bg-[#ff643b] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:brightness-105 transition shadow-[0_8px_20px_rgba(255,100,59,0.28)] inline-flex items-center gap-1.5"
              >
                <span>Talk to a Doctor Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function EcosystemFooter() {
  return (
    <footer className="border-t border-[#0f3e17]/10 bg-white/90 py-14 px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 text-xs text-[#747679]">
        <div className="md:col-span-3 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0a3922] flex items-center justify-center text-white font-serif text-lg">
              M
            </div>
            <div>
              <span className="font-serif text-lg text-[#080331] block">MANGA HEALTHCARE</span>
              <span className="text-[10px] text-[#0f3e17] font-semibold uppercase">Nigeria Beta</span>
            </div>
          </div>
          <p className="leading-relaxed">
            Safety-screened remote medical consultations, structured SOAP EHRs, and NDPR-compliant digital prescriptions.
          </p>
          <p className="text-[11px] font-medium text-[#ff643b]">
            Not for emergencies. Call 112 / 767 immediately.
          </p>
        </div>

        {/* Column 1: Role Portals */}
        <div className="md:col-span-3 space-y-2.5">
          <strong className="text-[#080331] uppercase tracking-wider text-[11px] block">
            Role Portals
          </strong>
          <div className="flex flex-col space-y-2 font-medium">
            <Link href={getPortalUrl('marketing', '/')} className="hover:text-[#0a3922]">
              Patient Website (mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('patient', '/auth')} className="hover:text-[#0a3922]">
              Patient App Login (app.mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('doctor', '/')} className="hover:text-[#0a3922]">
              Doctor & Locum Portal (doctor.mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('partner', '/')} className="hover:text-[#0a3922]">
              Pharmacy & Lab Partner (partner.mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('admin', '/auth')} className="hover:text-[#0a3922]">
              Ops Command (admin.mangahealthcare.com)
            </Link>
          </div>
        </div>

        {/* Column 2: Company & Resources */}
        <div className="md:col-span-3 space-y-2.5">
          <strong className="text-[#080331] uppercase tracking-wider text-[11px] block">
            Company & Resources
          </strong>
          <div className="flex flex-col space-y-2 font-medium">
            <Link href={getPortalUrl('marketing', '/about')} className="hover:text-[#0a3922]">
              About Us & Leadership
            </Link>
            <Link href={getPortalUrl('marketing', '/careers')} className="hover:text-[#0a3922]">
              Careers & Engineering
            </Link>
            <Link href={getPortalUrl('blog', '/')} className="hover:text-[#0a3922]">
              Health & Clinical Blog (blog.mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('help', '/')} className="hover:text-[#0a3922]">
              Help Centre (help.mangahealthcare.com)
            </Link>
            <Link href={getPortalUrl('marketing', '/contact')} className="hover:text-[#0a3922]">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Column 3: Legal & Compliance */}
        <div className="md:col-span-3 space-y-2.5">
          <strong className="text-[#080331] uppercase tracking-wider text-[11px] inline-flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-[#0f3e17]" />
            <span>Legal & Compliance</span>
          </strong>
          <div className="flex flex-col space-y-2 font-medium">
            <Link href={getPortalUrl('legal', '/terms')} className="hover:text-[#0a3922]">
              Terms of Service
            </Link>
            <Link href={getPortalUrl('legal', '/ndpr-privacy')} className="hover:text-[#0a3922]">
              NDPR Data Processing Policy
            </Link>
            <Link href={getPortalUrl('legal', '/telemedicine-consent')} className="hover:text-[#0a3922]">
              Telemedicine Informed Consent
            </Link>
            <Link href={getPortalUrl('legal', '/emergency-disclaimer')} className="hover:text-[#0a3922]">
              Emergency-Use Disclaimer
            </Link>
            <Link href={getPortalUrl('legal', '/clinician-compliance')} className="hover:text-[#0a3922]">
              MDCN Telemedicine Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingPageShell({ activeSurface, children }: EcosystemChromeProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f3eb] text-[#222326] pb-20">
      <EcosystemTopBar activeSurface={activeSurface} />
      <EcosystemCapsuleNav activeSurface={activeSurface} />
      <main className="flex-1 w-full">{children}</main>
      <EcosystemFooter />
      <PersistentEmergencyBar
        position="bottom"
        message="Manga Telehealth is for non-emergencies. In crisis, trauma, or acute chest pain, tap to call emergency ambulance:"
        ambulanceNumber="112"
        lagosEmergencyNumber="767"
      />
    </div>
  );
}
