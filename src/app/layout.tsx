import type { Metadata } from 'next';
import { Instrument_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});

export const viewport = {
  viewportFit: 'cover' as const,
  themeColor: '#FAFAF8',
};

export const metadata: Metadata = {
  title: 'Shiphaus | Build in a Day',
  description: 'A global community of builders who come together to ship products in a single day. Join chapters in New York, Chicago, Boulder, and Malaysia.',
  keywords: ['hackathon', 'builder', 'ship', 'startup', 'community', 'coding'],
  openGraph: {
    title: 'Shiphaus | Build in a Day',
    description: 'A global community of builders who come together to ship products in a single day.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${newsreader.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-[calc(4rem+env(safe-area-inset-top))]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
