import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Support | Get Job Update',
  description: 'Contact the Get Job Update team for support, business inquiries, or technical help regarding our Sarkari Naukri portal.',
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Contact <span className="text-orange-500">Support</span></h1>
            <p className="mt-3 text-slate-400 font-medium">We are here to help. Reach out to us for any queries or assistance.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 text-slate-600 leading-relaxed font-medium text-[15px]">
            <section className="space-y-4 text-center">
              <h2 className="text-2xl font-bold text-slate-900 pb-2">Get in Touch</h2>
              <p>
                Have a question, feedback, or facing a technical issue? Our support team is ready to assist you. 
                The fastest way to reach us is via our official email address.
              </p>
              
              <div className="py-6">
                <a href="mailto:contact@getjobupdate.co.in" className="inline-flex items-center gap-3 bg-orange-50 text-orange-600 px-8 py-4 rounded-2xl border border-orange-200 hover:bg-orange-100 transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xl font-bold tracking-wide">contact@getjobupdate.co.in</span>
                </a>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>🏢</span> Regional Office
                </h3>
                <address className="not-italic text-slate-600 text-sm space-y-1">
                  <p><strong>Get Job Update</strong></p>
                  <p>Sector 62</p>
                  <p>Noida, Uttar Pradesh</p>
                  <p>India - 201301</p>
                </address>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>📱</span> Social Channels
                </h3>
                <p className="text-sm mb-4">Join our channels for instant updates on your smartphone.</p>
                <div className="space-y-3">
                  <Link prefetch={false} href="https://t.me/getjobupdatefree" className="block w-full text-center bg-blue-50 text-blue-600 font-bold py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                    Join Telegram
                  </Link>
                  <Link prefetch={false} href="https://whatsapp.com/channel/0029VbCi7hW9RZAO5fRVKO0W" className="block w-full text-center bg-green-50 text-green-600 font-bold py-2.5 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                    Join WhatsApp
                  </Link>
                </div>
              </div>
            </div>

            <section className="space-y-4 pt-6 border-t border-slate-100 text-sm text-slate-500">
              <p>
                <strong>Note:</strong> Please allow up to 24-48 business hours for our team to respond to your queries. 
                We do not ask for any passwords or personal banking information. Protect yourself from scams.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
