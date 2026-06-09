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
    <div className="flex-1 w-full flex flex-col bg-slate-50 font-sans min-h-screen py-16">
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
                "item": "https://getjobupdate.co.in"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Sitemap",
                "item": "https://getjobupdate.co.in/site-map"
              }
            ]
          }),
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <header className="bg-slate-900 px-8 py-10 md:px-12 text-center border-b border-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 1px 1px,white 1px,transparent 0)`, backgroundSize: '28px 28px' }} />
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 mb-6 shadow-lg">
              <Compass className="w-4 h-4 text-orange-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 font-rajdhani">Platform Directory</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase font-rajdhani">
              Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Site Map</span>
            </h1>
            <p className="mt-3 text-slate-400 font-medium">
              Institutional Navigation for all job updates, results, tools and platform policies.
            </p>
          </header>

          <div className="p-6 md:p-12 space-y-10">
            {SECTIONS.map((section, idx) => (
              <section key={idx} className="group relative border-b border-slate-100 last:border-0 pb-10 last:pb-0 transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  <div className="md:w-1/3 space-y-3 shrink-0">
                    <div className={`inline-flex p-3 rounded-2xl ${section.iconColor} text-white shadow-md`}>
                      <section.icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight font-rajdhani uppercase">{section.title}</h2>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{section.description}</p>
                  </div>
                  <div className="md:w-2/3 grid sm:grid-cols-2 gap-4 w-full">
                    {section.links.map((link, linkIdx) => (
                      <Link key={linkIdx} href={link.href} className="group/link flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-sm transition-all bg-slate-50 hover:bg-white w-full">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/link:bg-orange-500 transition-all shrink-0"></span>
                          <span className="text-sm font-bold text-slate-700 group-hover/link:text-orange-600 transition-colors truncate">{link.title}</span>
                        </div>
                        {link.tag ? (
                          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 shrink-0 ml-2">
                            {link.tag}
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all group-hover/link:text-orange-500 shrink-0 ml-2" />
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
    </div>
  );
}
