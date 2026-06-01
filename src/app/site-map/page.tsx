import Link from "next/link";
import { Metadata } from "next";
import { Compass, LayoutGrid, History, Scale, Building2, MapPin, ChevronRight, FileSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap - Complete Page Directory | Get Job Update",
  description: "Navigate through Get Job Update quickly using our complete HTML sitemap. Find all pages including jobs, results, admit cards, states, and legal pages.",
};

const SECTIONS = [
  {
    title: "Primary Updates",
    description: "Real-time notifications for the latest recruitment cycle.",
    icon: LayoutGrid,
    iconColor: "bg-blue-500",
    links: [
      { title: "Sarkari Job Updates", href: "/jobs", tag: "Daily" },
      { title: "Exam Results", href: "/results", tag: "Live" },
      { title: "Admit Card Download", href: "/admit-cards" },
      { title: "Official Answer Keys", href: "/answer-keys" },
      { title: "Syllabus & Guides", href: "/syllabus" },
    ]
  },
  {
    title: "Legacy Archives",
    description: "Essential resources for preparation and analysis.",
    icon: History,
    iconColor: "bg-amber-500",
    links: [
      { title: "Admissions & Exams", href: "/exams" },
      { title: "Scholarships", href: "/scholarships" },
      { title: "Govt. Schemes", href: "/sarkari-yojana" },
      { title: "Web Stories", href: "/web-stories" },
    ]
  },
  {
    title: "Platform Tools",
    description: "Helpful tools for aspirants.",
    icon: Building2,
    iconColor: "bg-indigo-500",
    links: [
      { title: "Age Calculator", href: "/age-calculator" },
      { title: "Job Matcher", href: "/job-matcher" },
    ]
  },
  {
    title: "Directories & Taxonomies",
    description: "Browse updates by specific categories.",
    icon: FileSearch,
    iconColor: "bg-purple-500",
    links: [
      { title: "Browse by State", href: "/state" },
      { title: "Browse by Qualification", href: "/qualification" },
      { title: "Advanced Search", href: "/search" },
    ]
  },
  {
    title: "Legal & Corporate",
    description: "Platform guidelines, terms and contact information.",
    icon: Scale,
    iconColor: "bg-emerald-500",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Contact Support", href: "/contact" },
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Disclaimer", href: "/disclaimer" },
    ]
  }
];

export default function SiteMapPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://getjobupdate.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Sitemap",
                "item": "https://getjobupdate.com/site-map"
              }
            ]
          }),
        }}
      />
      <header className="relative bg-white border-b border-slate-100 pt-16 pb-12 sm:pt-24 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[80px]"></div>
        </div>
        <div className="container relative mx-auto max-w-7xl px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Platform Directory</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 sm:text-6xl mb-4 tracking-tight">
            Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Site Map.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-500 font-medium leading-relaxed">
            Institutional Navigation for all job updates, results, tools and platform policies.
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-16 sm:py-24 group/main">
        <div className="space-y-0">
          {SECTIONS.map((section, idx) => (
            <section key={idx} className="group relative border-b border-slate-100 py-12 sm:py-16 transition-all duration-500 hover:z-10 hover:bg-slate-50/50 hover:opacity-100 group-hover/main:opacity-40">
              <div className="grid gap-12 lg:grid-cols-12 items-start">
                <div className="lg:col-span-4 space-y-4">
                  <div className={`inline-flex p-3 rounded-2xl ${section.iconColor} text-white shadow-lg shadow-black/5`}>
                    <section.icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{section.description}</p>
                </div>
                <div className="lg:col-span-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6">
                  {section.links.map((link, linkIdx) => (
                    <Link key={linkIdx} href={link.href} className="group/link flex items-center justify-between py-2 border-b border-transparent hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-blue-600 transition-all"></span>
                        <span className="text-sm font-bold text-slate-600 group-hover/link:text-slate-900 transition-colors">{link.title}</span>
                      </div>
                      {link.tag ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {link.tag}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
