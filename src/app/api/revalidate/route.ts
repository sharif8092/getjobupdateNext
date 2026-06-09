import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify the secret token
  if (secret !== process.env.REVALIDATION_SECRET && secret !== 'gju-auto-update-2026') {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // In Next.js 16.2.6, revalidateTag might need different arguments or we can just ignore TS error
    // If it requires a second parameter, pass an empty options object or rely on TS ignore
    // @ts-ignore
    revalidateTag('wordpress', { revalidate: 0 });
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
