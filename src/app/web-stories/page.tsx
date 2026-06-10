import React from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/wordpress';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Web Stories – Get Job Update',
  description: 'Latest Government Jobs, Results, and Admit Cards in visual Web Stories format.',
};

export default async function WebStoriesArchive() {
  const posts = await getPosts('aziz_job', 20);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Sarkari Web Stories
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
            Swipe through the latest job updates visually.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {posts.map((post) => {
            const meta = post.custom_meta || {};
            const featuredImage = post.seo_meta?.og_image || 'https://getjobupdate.co.in/default-story-bg.jpg';
            
            return (
              <Link prefetch={false} 
                key={post.id} 
                href={`/web-stories/${post.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${featuredImage}')` }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                    {meta.aziz_department || 'Govt Job'}
                  </span>
                  <h3 className="text-white font-bold leading-snug line-clamp-3">
                    {post.title.rendered}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
