import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OneSignalInit from '@/components/OneSignalInit';

// Load Inter Google Font for maximum readability and a clean, premium look
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-brand-accent selection:text-brand-dark">
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
