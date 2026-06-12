import sys

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''      {/* Exam Guide */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <h2 className="font-black text-white text-sm tracking-wide">Exam Preparation Hub</h2>
          </div>
          <Link prefetch={false} href="/exams" className="text-[10px] font-black uppercase tracking-widest text-indigo-400">View All</Link>
        </div>
        <div className="flex flex-col divide-y divide-slate-50">
          {examGuideUpdates.map((post) => (
            <Link prefetch={false} key={post.id} href={//}
              className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Link>
          ))}
        </div>
      </div>'''

replacement = '''      {/* Exam Guide */}
      <FeedCard 
        title="Exam Preparation Hub" 
        typeSlug="exams" 
        posts={exams} 
        accentColor="text-indigo-400"
        iconBg="bg-indigo-500" 
        hoverText="group-hover:text-indigo-600"
        icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
      />'''

content = content.replace(target, replacement)

# We can also remove examGuideUpdates since it's not used anymore!
target_2 = '''  const examGuideUpdates = [...jobs]
    .map(p => ({ ...p, routePrefix: POST_TYPE_MAP[p.type] || 'blog' }))
    .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
    .slice(0, 5);'''
content = content.replace(target_2, '')

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
