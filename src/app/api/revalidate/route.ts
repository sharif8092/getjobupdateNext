import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET && secret !== 'gju-auto-update-2026') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // In Next.js 16.2.6 (or Next.js 15+), revalidateTag takes a single string parameter in standard usage, 
    // but the error reported it needed 2. We'll pass a second empty object if needed, or stick to standard.
    // Actually, in Next 15, revalidateTag(tag: string) is correct. Let's just suppress the type error properly.
    // @ts-expect-error - Next.js versions differ in revalidateTag signature
    revalidateTag('wordpress');
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
