import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, name, email, content } = body;

    if (!postId || !name || !email || !content) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Authenticate with WordPress using Application Password
    const username = process.env.WP_API_USER;
    const appPassword = process.env.WP_API_APP_PASSWORD;

    if (!username || !appPassword) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const token = Buffer.from(`${username}:${appPassword}`).toString('base64');

    const res = await fetch('https://api.getjobupdate.co.in/wp-json/wp/v2/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
      },
      body: JSON.stringify({
        post: postId,
        author_name: name,
        author_email: email,
        content: content,
        status: 'hold', // 'hold' means pending moderation
      }),
    });

    const data = await res.json();

    if (res.ok) {
      return NextResponse.json({
        success: true,
        message: 'Comment submitted successfully! It is awaiting moderation.',
        comment_id: data.id,
      });
    } else {
      console.error('WP API Error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to submit comment.' },
        { status: res.status }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, message: 'A server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
