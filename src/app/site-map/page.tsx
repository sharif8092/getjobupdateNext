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
    <div className="flex-1 w-full flex flex-col bg-slate-50 font-sans">
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
      <header className="relative bg-[#0b1120] border-b border-slate-800 pt-16 pb-12 sm:pt-24 sm:pb-20 overflow-hidden font-sans shrink-0">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative mx-auto max-w-7xl px-4 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 mb-6 shadow-lg">
            <Compass className="w-4 h-4 text-orange-500" />
            <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 font-rajdhani">Platform Directory</span>
          </div>
          <h1 className="text-4xl font-black text-white sm:text-6xl mb-4 tracking-tight font-rajdhani uppercase">
            Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Site Map.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Institutional Navigation for all job updates, results, tools and platform policies.
          </p>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24 group/main flex-1">
        <div className="space-y-0">
          {SECTIONS.map((section, idx) => (
            <section key={idx} className="group relative border-b border-slate-200 py-12 sm:py-16 transition-all duration-500 hover:z-10 hover:bg-white hover:opacity-100 group-hover/main:opacity-50">
              <div className="grid gap-12 lg:grid-cols-12 items-start px-4">
                <div className="lg:col-span-4 space-y-4">
                  <div className={`inline-flex p-3 rounded-2xl ${section.iconColor} text-white shadow-lg`}>
                    <section.icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight font-rajdhani uppercase">{section.title}</h2>
                  <p className="text-sm font-bold text-slate-500 leading-relaxed max-w-xs">{section.description}</p>
                </div>
                <div className="lg:col-span-8 grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4">
                  {section.links.map((link, linkIdx) => (
                    <Link prefetch={false} key={linkIdx} href={link.href} className="glass-card group/link flex items-center justify-between p-4 rounded-xl border border-[var(--border)] hover:border-orange-400 hover:shadow-md transition-all bg-white">
                      <div className="flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-slate-300 group-hover/link:bg-orange-500 transition-all"></span>
                        <span className="text-[15px] font-black text-slate-700 group-hover/link:text-orange-600 transition-colors font-rajdhani uppercase tracking-wide">{link.title}</span>
                      </div>
                      {link.tag ? (
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                          {link.tag}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all group-hover/link:text-orange-500" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
