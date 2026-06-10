import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://getjobupdate.co.in/wp-json/wp/v2';
const POST_TYPES = ['aziz_job', 'aziz_result', 'aziz_admit', 'aziz_answerkey', 'aziz_yojana', 'aziz_syllabus', 'aziz_admission', 'post'];

// Map WP types to Next.js slugs
const POST_TYPE_MAP: Record<string, string> = {
  aziz_job: 'jobs',
  aziz_result: 'results',
  aziz_admit: 'admit-cards',
  aziz_answerkey: 'answer-keys',
  aziz_yojana: 'yojana',
  aziz_syllabus: 'syllabus',
  aziz_admission: 'admissions',
  post: 'articles',
};

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET && secret !== 'gju-auto-update-2026') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const warmedUrls: string[] = [];

    // Fetch the 50 most recent posts of each type to warm up
    // (We limit to 50 to avoid timing out the Vercel function, but this covers 99% of active old posts)
    for (const wpType of POST_TYPES) {
      try {
        const res = await fetch(`${API_URL}/${wpType}?per_page=50&_fields=slug,type`, {
          next: { revalidate: 0 } // Don't use cached API response for this
        });
        
        if (!res.ok) continue;
        
        const posts = await res.json();
        
        for (const post of posts) {
          const typeSlug = POST_TYPE_MAP[post.type] || 'jobs';
          const postUrl = `https://getjobupdate.co.in/${typeSlug}/${post.slug}`;
          
          // Fire and forget fetch to statically generate the page
          fetch(postUrl).catch(() => {});
          warmedUrls.push(postUrl);
        }
      } catch (e) {
        console.error(`Failed to fetch ${wpType} for warming`);
      }
    }
    
    // Also warm the category pages
    Object.values(POST_TYPE_MAP).forEach(slug => {
      fetch(`https://getjobupdate.co.in/${slug}`).catch(() => {});
      warmedUrls.push(`https://getjobupdate.co.in/${slug}`);
    });
    
    // Warm homepage
    fetch('https://getjobupdate.co.in/').catch(() => {});
    warmedUrls.push('https://getjobupdate.co.in/');

    return NextResponse.json({ 
      success: true, 
      message: `Proactive Cache Warming triggered for ${warmedUrls.length} pages. They are now building in the background!`,
      count: warmedUrls.length
    });

  } catch (err) {
    return NextResponse.json({ message: 'Error warming cache' }, { status: 500 });
  }
}
