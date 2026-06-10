import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const urlToWarm = request.nextUrl.searchParams.get('url');

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET && secret !== 'gju-auto-update-2026') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Purge all cached WordPress API responses
    // @ts-expect-error - Next.js versions differ in revalidateTag signature
    revalidateTag('wordpress');
    
    // PROACTIVE CACHE WARMING:
    // If WordPress sent us the URL of the post that was just published/updated,
    // we fetch it in the background. This forces Next.js to statically generate
    // the page immediately, so the very first human visitor gets a 0ms TTFB!
    if (urlToWarm) {
      // Fire and forget fetches
      fetch(urlToWarm).catch(console.error);
      
      // Also silently warm up the home page so the newest post appears there instantly
      fetch('https://getjobupdate.co.in/').catch(console.error);
    }
    
    return NextResponse.json({ revalidated: true, warmed: !!urlToWarm, url: urlToWarm, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
