import React from 'react';
import Link from 'next/link';
import { getPostsByQualification, getPosts, POST_TYPE_MAP, WordPressPost } from '@/lib/wordpress';

interface Props {
  department?: string;
  qualification?: string;
  postType?: string;
}

export default async function RelatedJobs({ department, qualification, postType }: Props) {
  // Fetch related jobs based on qualification, fallback to general recent jobs
  let related: WordPressPost[] = [];
  
  const isResult = postType === 'aziz_result';
  const fetchType = isResult ? 'aziz_result' : 'jobs';
  
  if (qualification && !isResult) {
    related = await getPostsByQualification(qualification, 3);
  }

  if (related.length === 0) {
    related = await getPosts(fetchType, 3);
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-10 mb-6">
      <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isResult ? 'bg-green-100' : 'bg-orange-100'}`}>
          <svg className={`w-4 h-4 ${isResult ? 'text-green-600' : 'text-orange-600'}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {isResult ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </>
            )}
          </svg>
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">{isResult ? 'Related Results' : 'Related Govt Jobs'}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((post) => {
          const typeSlug = POST_TYPE_MAP[post.type] || post.type;
          const meta = post.custom_meta || {};
          
          return (
            <Link key={post.id} href={`/${typeSlug}/${post.slug}`} className={`group bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px] ${isResult ? 'hover:border-green-300' : 'hover:border-orange-300'}`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider ${isResult ? 'bg-green-500' : 'bg-orange-500'}`}>
                    {isResult ? 'RESULT' : (meta.aziz_badge_type || 'JOB')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <h4 className={`text-sm font-bold text-slate-800 leading-snug line-clamp-2 transition-colors ${isResult ? 'group-hover:text-green-600' : 'group-hover:text-orange-600'}`} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span className="truncate max-w-[60%]">{meta.aziz_department || 'Government Org'}</span>
                <span className={`transition-transform group-hover:translate-x-1 ${isResult ? 'text-green-500' : 'text-orange-500'}`}>
                  {isResult ? 'Check Result →' : 'Apply →'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
