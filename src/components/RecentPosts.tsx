import React from 'react';
import Link from 'next/link';
import { WordPressPost, POST_TYPE_MAP } from '@/lib/wordpress';

export default function RecentPosts({ posts }: { posts: WordPressPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900">
        <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[11px] font-black text-white uppercase tracking-widest">Recent Updates</span>
      </div>
      <div className="flex flex-col">
        {posts.map((post) => {
          const typeSlug = POST_TYPE_MAP[post.type] || post.type;
          return (
            <Link key={post.id} href={`/${typeSlug}/${post.slug}`} className="group p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-orange-600 transition-colors leading-relaxed" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                <span className="uppercase tracking-wider">{typeSlug.replace('-', ' ')}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
