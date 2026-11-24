import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Manga Healthcare — Clinical Telemedicine & Emergency Triage',
  description:
    'Connect with licensed doctors and therapists remotely with clinical emergency triage, e-prescriptions, and continuous care.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased min-h-screen bg-[#f8f3eb] text-[#222326] font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
