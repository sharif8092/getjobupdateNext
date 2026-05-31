import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Get Job Update',
  description: 'Privacy Policy for Get Job Update outlining data collection, cookies, and AdSense compliance.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Privacy <span className="text-orange-500">Policy</span></h1>
            <p className="mt-3 text-slate-400 font-medium">How we collect, use, and protect your information.</p>
          </div>

          <div className="p-8 md:p-12 space-y-8 text-slate-600 leading-relaxed font-medium text-[15px]">
            
            <p>
              At <strong>Get Job Update</strong>, accessible from getjobupdate.co.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Log Files</h2>
              <p>
                Get Job Update follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Cookies and Web Beacons</h2>
              <p>
                Like any other website, Get Job Update uses "cookies". These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>
            </section>

            <section className="space-y-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
              <h2 className="text-xl font-bold text-slate-900">Google DoubleClick DART Cookie</h2>
              <p>
                Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to your website or other websites.</li>
                <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Ads Settings</a>.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Push Notifications</h2>
              <p>
                We use OneSignal to deliver push notifications to users who opt-in. OneSignal may collect anonymous device information and subscription preferences. You can opt-out of push notifications at any time directly through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Third Party Privacy Policies</h2>
              <p>
                Get Job Update&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
              </p>
            </section>

            <section className="space-y-4 pt-6 border-t border-slate-100">
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at: <br/>
                <a href="mailto:contact@getjobupdate.co.in" className="text-orange-600 font-bold hover:underline">contact@getjobupdate.co.in</a>
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
