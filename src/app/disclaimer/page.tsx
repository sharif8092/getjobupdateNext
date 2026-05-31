import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer | Get Job Update',
  description: 'Disclaimer and non-affiliation statement for Get Job Update.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Disclaimer</h1>
            <p className="mt-3 text-slate-400 font-medium">Important legal information regarding the use of our platform.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 text-slate-600 leading-relaxed font-medium text-[15px]">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Non-Affiliation with Government</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl">
                <p className="text-amber-900 font-bold mb-1">DECLARATION:</p>
                <p className="text-amber-800">
                  <strong>Get Job Update (getjobupdate.co.in) is an independent private educational and informational platform. We are NOT a government organization, nor do we represent any government entity, department, or recruitment board.</strong>
                </p>
              </div>
              <p>
                All information provided on this website regarding government jobs, exam dates, admit cards, and results is strictly for general informational and educational purposes. 
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Source of Information</h2>
              <p>
                We aggregate our data from various publicly available official government gazettes, press releases, and employment newspapers (like Employment News / Rozgar Samachar). While we make every effort to ensure the accuracy and reliability of the information published, we cannot guarantee it to be 100% accurate or up-to-date at all times.
              </p>
              <p>
                We highly recommend that users <strong>always cross-verify</strong> any job notification or exam update by visiting the official website of the respective department or commission before applying or paying any fees.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">No Guarantee of Employment</h2>
              <p>
                Get Job Update is merely an aggregator of news. We do not provide employment, nor do we play any role in the recruitment or selection process of any government body. We do not charge any money for job placements. Beware of fraudulent calls or emails claiming to offer jobs on our behalf.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">External Links</h2>
              <p>
                Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with Get Job Update. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-slate-100">
              <p>
                If you have any questions or concerns regarding this disclaimer, please contact us at: <br/>
                <a href="mailto:contact@getjobupdate.co.in" className="text-orange-600 font-bold hover:underline">contact@getjobupdate.co.in</a>
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
