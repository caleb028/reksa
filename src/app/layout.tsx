import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/layout/AppProviders';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

export const metadata: Metadata = {
  title: 'A&E | Ardhi and Estates — Kenya\'s Intelligent Real Estate Platform',
  description:
    'A&E (Ardhi and Estates) — Kenya\'s premier property intelligence, search and verification platform. Verified Property Passports, algorithmic yield modeling, and transparent real estate analysis across Kenya.',
  icons: {
    icon: '/images/favicon-32.png',
    apple: '/images/logo.png'
  },
  keywords: [
    'A&E',
    'Ardhi and Estates',
    'Ardhi & Estates',
    'A&E Kenya',
    'Kenya Real Estate',
    'Apartments for sale Nairobi',
    'Apartments for rent Kenya',
    'Property Verification Kenya',
    'Kilimani Apartments',
    'Kileleshwa Real Estate',
    'Kenya Property Analysis'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans">
        <AppProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <AIChatWidget />
        </AppProviders>
      </body>
    </html>
  );
}