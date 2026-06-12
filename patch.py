import sys

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'let answerkeys: WordPressPost[] = [];',
    'let answerkeys: WordPressPost[] = [];\n  let careers: WordPressPost[] = [];'
)
c = c.replace(
    '''answerkeys = await getPosts('aziz_answerkey', 4);''',
    '''answerkeys = await getPosts('aziz_answerkey', 4);\n    careers = await getPosts('aziz_career', 4);'''
)
c = c.replace(
    'let yojanas: WordPressPost[] = [];',
    'let yojanas: WordPressPost[] = [];\n  let careers: WordPressPost[] = [];'
)
c = c.replace(
    '''yojanas = await getPosts('aziz_yojana', 4);''',
    '''yojanas = await getPosts('aziz_yojana', 4);\n    careers = await getPosts('aziz_career', 4);'''
)
c = c.replace(
    '[...jobs, ...results, ...admits, ...yojanas]',
    '[...jobs, ...results, ...admits, ...yojanas, ...careers]'
)

feed_card = '''      <FeedCard title="Syllabus" typeSlug="syllabus" posts={syllabus} accentColor="text-[var(--color-brand-blue)]"
        iconBg="bg-indigo-500" hoverText="group-hover:text-indigo-600"
        icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
      />'''

new_feed_card = feed_card + '''
      <FeedCard title="Career Updates" typeSlug="careers" posts={careers} accentColor="text-pink-400"
        iconBg="bg-pink-500" hoverText="group-hover:text-pink-600"
        icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>}
      />'''

c = c.replace(feed_card, new_feed_card)

cat_str = '''  { href: '/exams', label: 'PREPARATION', name: 'Exam Guide', iconBg: 'bg-purple-100 text-purple-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg> },'''

new_cat_str = cat_str + '''
  { href: '/careers', label: 'CAREER GUIDE', name: 'Careers', iconBg: 'bg-pink-100 text-pink-600', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6.75h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg> },'''

c = c.replace(cat_str, new_cat_str)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
