import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OneSignalInit from '@/components/OneSignalInit';
import dynamic from 'next/dynamic';
const FloatingSocial = dynamic(() => import('@/components/FloatingSocial'));
const LiveTicker = dynamic(() => import('@/components/LiveTicker'));

// Load Inter Google Font for maximum readability and a clean, premium look
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sarkari Result | Free Job Alert | Latest Sarkari Naukri Updates - Get Job Update',
  description: 'Get Job Update provides the latest Sarkari Naukri, Free Job Alert, Sarkari Result, Admit Card, Answer Key, and Syllabus updates. Find all upcoming government jobs in India.',
  keywords: 'Sarkari Result, Sarkari Naukri, Free Job Alert, Sarkari Exam, Government Jobs, Govt Jobs in India, Upcoming Govt Jobs, Rojgar Result, Sarkari Yojana, Admit Card, Answer Key, Syllabus',
  metadataBase: new URL('https://getjobupdate.co.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sarkari Result & Free Job Alerts | Get Job Update',
    description: 'Sabhi government jobs, Sarkari results, admit cards, answer keys aur educational schemes ki sabse tej aur verified updates. Best site for Sarkari Naukri.',
    url: 'https://getjobupdate.co.in',
    siteName: 'Get Job Update',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Sarkari Naukri & Sarkari Result - Get Job Update',
    description: 'Find the latest government jobs, results, and admit cards instantly.',
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
      <head>
        {/* ── Critical Resource Hints ──
            These resolve DNS and open TCP connections before the browser
            discovers the resource in HTML/JS — reduces fetch latency for
            API calls that drive every page's LCP content. */}
        <link rel="preconnect" href="https://api.getjobupdate.co.in" />
        <link rel="dns-prefetch" href="https://api.getjobupdate.co.in" />

        <link rel="dns-prefetch" href="https://onesignal.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-brand-accent selection:text-brand-dark">
        {/* Google Analytics Tag (Only in Production to prevent localhost cookie warnings) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-XD4FQTDP9X" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XD4FQTDP9X');
              `}
            </Script>
            
            {/* Google AdSense Verification & Auto Ads (Lazy Loaded) */}
            <Script
              id="adsbygoogle-init"
              strategy="lazyOnload"
              crossOrigin="anonymous"
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4677190099981876"
            />
          </>
        )}
        
        <OneSignalInit />
        <LiveTicker />
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
        <FloatingSocial />
      </body>
    </html>
  );
}



