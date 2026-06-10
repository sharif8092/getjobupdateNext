import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Get Job Update',
  description: 'Learn more about Get Job Update, India\'s leading portal for verified Sarkari Naukri, exam alerts, and government job notifications.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">About <span className="text-orange-500">Us</span></h1>
            <p className="mt-3 text-slate-400 font-medium">Your trusted partner in securing a successful career in the government sector.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 text-slate-600 leading-relaxed font-medium text-[15px]">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Our Mission</h2>
              <p>
                Welcome to <strong>Get Job Update</strong>, India&apos;s most reliable and lightning-fast portal for all government job-related information. 
                Our mission is simple: to bridge the gap between aspiring candidates and their dream government jobs by providing accurate, timely, and accessible information.
              </p>
              <p>
                In today&apos;s highly competitive environment, missing a single deadline can cost a candidate an entire year of preparation. We exist to ensure that never happens to you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">What We Do</h2>
              <p>
                Navigating through dozens of official government websites, complex gazettes, and confusing employment news can be overwhelming. 
                At Get Job Update, our dedicated team monitors official portals 24/7 to bring you curated updates on:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Latest Sarkari Naukri:</strong> Updates on state and central government recruitment.</li>
                <li><strong>Admit Cards:</strong> Direct links to download exam hall tickets.</li>
                <li><strong>Sarkari Results:</strong> Instant access to exam results, cut-offs, and merit lists.</li>
                <li><strong>Answer Keys & Syllabi:</strong> Comprehensive resources to help you prepare better.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Why Trust Us?</h2>
              <p>
                We prioritize <strong>accuracy and authenticity</strong> above all else. Every notification posted on Get Job Update is cross-verified with official government gazettes, press releases, or official recruitment portals. We provide direct links to official websites so you can verify the information yourself.
              </p>
              <p>
                Get Job Update is an independent educational platform. We are <strong>not affiliated with any government organization</strong>, but we serve as a dedicated resource to help you navigate public sector opportunities safely and efficiently.
              </p>
            </section>

            <section className="space-y-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900">Join Our Community</h2>
              <p>
                Don&apos;t miss out on life-changing opportunities. Join millions of students who trust our real-time alerts. 
                Connect with us on our <Link prefetch={false} href="https://t.me/getjobupdatefree" className="text-orange-600 font-bold hover:underline">Telegram Channel</Link> and <Link prefetch={false} href="https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W" className="text-orange-600 font-bold hover:underline">WhatsApp Channel</Link> for instant notifications directly to your phone.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
