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
      const res = await fetch(`https://api.getjobupdate.co.in/wp-json/gju/v1/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          author_name: name,
          author_email: email,
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
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span>💬</span> Discussion ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-5 rounded-xl border border-slate-100">
        <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Leave a Reply</h4>
        
        {submitMessage.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${submitMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {submitMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Name <span className="text-rose-500">*</span></label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email <span className="text-rose-500">*</span></label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
              placeholder="Your Email (will not be published)"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Comment <span className="text-rose-500">*</span></label>
          <textarea 
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all resize-y"
            placeholder="Write your comment here..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      <div>
        {loading ? (
          <div className="text-center py-4 text-slate-500 text-sm">Loading comments...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0 uppercase">
                  {comment.author_name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4">
                    <div className="flex items-baseline justify-between mb-2 gap-4">
                      <strong className="text-sm text-slate-800">{comment.author_name}</strong>
                      <span className="text-xs text-slate-400 shrink-0">
                        {new Date(comment.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
            No comments yet. Be the first to start the discussion!
          </div>
        )}
      </div>
    </div>
  );
}
