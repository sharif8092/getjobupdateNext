import type { Metadata } from 'next';
import { Rajdhani, Baloo_2 } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OneSignalInit from '@/components/OneSignalInit';

// Load Rajdhani and Baloo 2 Google Fonts to perfectly match your theme typography
const rajdhani = Rajdhani({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
});

const baloo = Baloo_2({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Get Job Update – Latest Sarkari Naukri, Result, Admit Card',
  description: 'Sabhi government jobs, Sarkari results, admit cards, answer keys aur educational schemes ki sabse tej aur verified updates.',
  metadataBase: new URL('https://getjobupdate.co.in'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-amber-400 selection:text-slate-900">
        <OneSignalInit />
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
