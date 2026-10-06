import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import PWAInstaller from '../components/PWAInstaller';

export const metadata: Metadata = {
  title: 'AI Nature Quest | Outdoor Exploration Game',
  description:
    'AI generates the adventure. You go live it. Put your phone away, explore nature, complete real-world quests, and return to journal your discoveries.',
  applicationName: 'AI Nature Quest',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AI Nature Quest',
  },
  keywords: [
    'nature quest',
    'outdoor game',
    'screen-free',
    'touch grass',
    'naturalist',
    'PWA',
    'AI adventure',
    'Hacktoberfest',
  ],
  authors: [{ name: 'AI Nature Quest Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#142e1d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-[#19271d] dark:text-[#edf4ee] relative">
        <div className="nature-bg-container" aria-hidden="true">
          <div className="nature-bg-overlay" />
        </div>
        <PWAInstaller />
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
