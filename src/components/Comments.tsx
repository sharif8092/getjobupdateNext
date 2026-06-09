'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author_name: string;
  date: string;
  content: {
    rendered: string;
  };
}

interface CommentsProps {
  postId: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`https://api.getjobupdate.co.in/wp-json/wp/v2/comments?post=${postId}&status=approve`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ text: '', type: '' });

    try {
      const res = await fetch(`/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: postId,
          name: name,
          email: email,
          content: content,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitMessage({ text: 'Comment submitted successfully! It is awaiting moderation.', type: 'success' });
        setName('');
        setEmail('');
        setContent('');
      } else {
        setSubmitMessage({ text: data.message || 'Failed to submit comment.', type: 'error' });
      }
    } catch (err) {
      setSubmitMessage({ text: 'A network error occurred. Please try again later.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t-2 border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 font-rajdhani tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          Join the Discussion
        </h3>
        <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-inner">
          {comments.length} Comments
        </div>
      </div>

      {/* Modern Comment Form */}
      <div className="mb-14 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <form onSubmit={handleSubmit} className="relative bg-white p-6 md:p-8 rounded-[1.8rem] border border-slate-200/50 shadow-xl shadow-slate-200/40">
          
          {submitMessage.text && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold flex items-start gap-3 ${submitMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50' : 'bg-rose-50 text-rose-800 border border-rose-200/50'}`}>
              {submitMessage.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
              {submitMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-1">Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 text-[15px] font-medium text-slate-800 outline-none transition-all placeholder-slate-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-1">Email <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 text-[15px] font-medium text-slate-800 outline-none transition-all placeholder-slate-400"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 pl-1">Your Message <span className="text-rose-500">*</span></label>
            <textarea 
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 text-[15px] font-medium text-slate-800 outline-none transition-all resize-y placeholder-slate-400 leading-relaxed"
              placeholder="What are your thoughts on this update?"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="group relative overflow-hidden bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl transition-all disabled:opacity-70 text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30"
            >
              <div className="absolute inset-0 w-0 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    Post Comment
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Floating Comments List */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-orange-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm font-medium animate-pulse">Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="relative group pl-6 md:pl-0">
                {/* Connector line for desktop */}
                <div className="hidden md:block absolute left-[1.4rem] top-[3.5rem] bottom-[-2rem] w-px bg-slate-200 group-last:hidden"></div>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 relative">
                  {/* Avatar */}
                  <div className="absolute -left-6 md:relative md:left-0 top-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-orange-500/30 transform group-hover:scale-105 group-hover:-rotate-3 transition-transform">
                      {comment.author_name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {/* Card */}
                  <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm p-6 group-hover:shadow-md transition-all hover:border-orange-200">
                    <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                      <strong className="text-[15px] font-black text-slate-900 font-sans tracking-tight">{comment.author_name}</strong>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {new Date(comment.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-[15px] text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200/60 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-slate-200/50 mb-6 rotate-3">
              <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <p className="text-xl text-slate-800 font-black tracking-tight mb-2">Be the first to comment!</p>
            <p className="text-sm text-slate-500 font-medium">Share your thoughts or ask a question.</p>
          </div>
        )}
      </div>
    </div>
  );
}
