import { NextResponse } from 'next/server';
import { getPosts } from '@/lib/wordpress';

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  try {
    const posts = await getPosts('aziz_job', 8);
    const slim = posts.map(p => ({
      slug: p.slug,
      type: p.type,
      title: { rendered: p.title.rendered },
    }));
    return NextResponse.json(slim, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json([]);
  }
}
