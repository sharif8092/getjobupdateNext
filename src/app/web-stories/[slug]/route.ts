import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/wordpress';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // Fetch post (using aziz_job as primary, but you can extend to check others)
  const post = await getPostBySlug('aziz_job', slug);
  
  if (!post) {
    return new NextResponse('Story not found', { status: 404 });
  }

  const meta = post.custom_meta || {};
  const coverImage = post.seo_meta?.og_image || 'https://getjobupdate.co.in/default-story-bg.jpg';
  const logo = 'https://getjobupdate.co.in/icon.png';
  const publisher = 'Get Job Update';
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getjobupdate.co.in';
  const canonicalUrl = `${siteUrl}/jobs/${post.slug}`;

  // Build the AMP HTML string
  const ampHtml = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <title>${post.title.rendered} - Web Story</title>
    <link rel="canonical" href="${canonicalUrl}">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <style amp-custom>
      amp-story {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
      .bg-overlay {
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%);
        position: absolute;
        bottom: 0; left: 0; right: 0; top: 0;
      }
      .content {
        position: absolute;
        bottom: 10%;
        left: 8%;
        right: 8%;
        color: white;
      }
      .tag {
        background-color: #2563eb;
        color: white;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
        display: inline-block;
        margin-bottom: 15px;
      }
      h1 {
        font-size: 2.2em;
        font-weight: 800;
        line-height: 1.2;
        margin: 0 0 15px 0;
      }
      p {
        font-size: 1.2em;
        line-height: 1.5;
        margin: 0 0 10px 0;
        opacity: 0.9;
      }
      .highlight-box {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-left: 4px solid #3b82f6;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .highlight-box strong {
        color: #93c5fd;
        display: block;
        font-size: 0.9em;
        text-transform: uppercase;
        margin-bottom: 5px;
      }
      .btn {
        display: inline-block;
        background-color: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        font-weight: bold;
        text-decoration: none;
        font-size: 1.1em;
        margin-top: 20px;
        text-align: center;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <amp-story standalone
        title="${post.title.rendered}"
        publisher="${publisher}"
        publisher-logo-src="${logo}"
        poster-portrait-src="${coverImage}">
      
      <!-- Page 1: Cover -->
      <amp-story-page id="page1">
        <amp-story-grid-layer template="fill">
          <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" alt="Cover background"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill">
          <div class="bg-overlay"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <div class="content">
            <span class="tag">New Notification</span>
            <h1>${post.title.rendered}</h1>
            <p>${meta.aziz_department || 'Govt Department'} has released a new recruitment notification.</p>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <!-- Page 2: Key Details -->
      <amp-story-page id="page2">
        <amp-story-grid-layer template="fill">
          <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" alt="Details background"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill">
          <div class="bg-overlay"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <div class="content">
            <span class="tag">Vacancy Details</span>
            <h1>${meta.aziz_total_posts || 'Various Posts'}</h1>
            
            <div class="highlight-box">
              <strong>Qualification</strong>
              ${meta.aziz_qualification || 'Check Notification'}
            </div>
            <div class="highlight-box">
              <strong>Age Limit</strong>
              ${meta.aziz_age_limit || 'As per rules'}
            </div>
            <div class="highlight-box">
              <strong>Salary</strong>
              ${meta.aziz_salary || 'As per norms'}
            </div>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

      <!-- Page 3: Call to Action -->
      <amp-story-page id="page3">
        <amp-story-grid-layer template="fill">
          <amp-img src="${coverImage}" width="720" height="1280" layout="responsive" alt="CTA background"></amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="fill">
          <div class="bg-overlay"></div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical">
          <div class="content">
            <span class="tag">Important Dates</span>
            <h1>Last Date: ${meta.aziz_apply_end || 'See Notification'}</h1>
            <p>Don't miss out on this opportunity. Read the full syllabus, exam pattern, and apply online before the deadline.</p>
            
            <amp-story-page-outlink layout="nodisplay">
              <a href="${canonicalUrl}" title="Read Full Notification">Read Full Notification</a>
            </amp-story-page-outlink>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>

    </amp-story>
  </body>
</html>`;

  return new NextResponse(ampHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
