import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Get Job Update',
  description: 'Terms and conditions for using the Get Job Update website.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Terms & <span className="text-orange-500">Conditions</span></h1>
            <p className="mt-3 text-slate-400 font-medium">Rules and guidelines for using Get Job Update.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 text-slate-600 leading-relaxed font-medium text-[15px]">
            
            <p>
              Welcome to Get Job Update! These terms and conditions outline the rules and regulations for the use of Get Job Update&apos;s Website, located at getjobupdate.co.in.
            </p>
            <p>
              By accessing this website we assume you accept these terms and conditions. Do not continue to use Get Job Update if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">1. License and Intellectual Property</h2>
              <p>
                Unless otherwise stated, Get Job Update and/or its licensors own the intellectual property rights for all original material on Get Job Update. All intellectual property rights are reserved. You may access this from Get Job Update for your own personal use subjected to restrictions set in these terms and conditions.
              </p>
              <p>You must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Republish material from Get Job Update without proper credit.</li>
                <li>Sell, rent or sub-license material from Get Job Update.</li>
                <li>Reproduce, duplicate or copy material from Get Job Update.</li>
              </ul>
              <p className="text-sm italic mt-2">Note: Government logos, gazette documents, and official notifications belong to their respective government bodies.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">2. User Comments and Contributions</h2>
              <p>
                Parts of this website may offer an opportunity for users to post and exchange opinions and information in certain areas. Get Job Update does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Get Job Update.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">3. Accuracy of Information</h2>
              <p>
                We strive to provide highly accurate and updated information regarding government jobs and results. However, we do not warrant the completeness or accuracy of the information published on this website; nor do we commit to ensuring that the website remains available or that the material on the website is kept up to date. Users must verify all information independently from official sources.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">4. Limitation of Liability</h2>
              <p>
                In no event shall Get Job Update, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website. Get Job Update shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-slate-100">
              <p>
                If you have any queries regarding our Terms & Conditions, please reach out to us at: <br/>
                <a href="mailto:contact@getjobupdate.co.in" className="text-orange-600 font-bold hover:underline">contact@getjobupdate.co.in</a>
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
