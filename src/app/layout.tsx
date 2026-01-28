import type { Metadata } from 'next';
import { Instrument_Sans, Newsreader } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

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
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
