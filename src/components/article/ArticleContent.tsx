import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import Image from 'next/image';

export default function ArticleContent({ 
  finalHtml, 
  featuredImageUrl, 
  post, 
  globalAmazonId,
  renderFaq, 
  renderHowTo, 
  renderInlineAffiliate,
  faqPosition,
  howtoPosition,
  finalTagsList
}: any) {
  return (
    <>
            {/* Full Article Body */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              
              {/* Featured Image (if available) */}
              {featuredImageUrl && (
                <div className="w-full border-b border-slate-200 bg-slate-50 relative flex justify-center">
                  <Image 
                    src={featuredImageUrl} 
                    alt={post.title.rendered.replace(/<[^>]*>?/gm, '')} 
                    width={1200}
                    height={500}
                    className="w-full max-h-[500px] object-contain" 
                    priority={true}
                  />
                </div>
              )}

              <div className="px-6 py-6 md:px-8 md:py-8">
                <div id="full-article-content" className="post-content prose prose-slate max-w-none text-slate-700 text-[17px] leading-8 prose-headings:font-bold prose-h2:text-2xl">
                  {parse(finalHtml, {
                    replace: (domNode: any) => {
                      // Optimize WordPress images automatically with Next.js Image component
                      if (domNode.name === 'img' && domNode.attribs && domNode.attribs.src) {
                        return (
                          <Image
                            src={domNode.attribs.src}
                            alt={domNode.attribs.alt || ''}
                            width={domNode.attribs.width ? parseInt(domNode.attribs.width, 10) : 800}
                            height={domNode.attribs.height ? parseInt(domNode.attribs.height, 10) : 450}
                            style={{ width: '100%', height: 'auto' }}
                            className={domNode.attribs.class || 'rounded-xl shadow-sm my-6 mx-auto'}
                            loading="lazy"
                          />
                        );
                      }
                      if (domNode.attribs && domNode.attribs['data-schema'] === 'faq') {
                        return renderFaq(true, domNode.attribs['data-id']);
                      }
                      if (domNode.attribs && domNode.attribs['data-schema'] === 'howto') {
                        return renderHowTo(true, domNode.attribs['data-id']);
                      }
                      if (domNode.attribs && domNode.attribs.id === 'react-faq-placeholder') {
                        return renderFaq(true);
                      }
                      if (domNode.attribs && domNode.attribs.id === 'react-howto-placeholder') {
                        return renderHowTo(true);
                      }
                      if (domNode.attribs && domNode.attribs.class && domNode.attribs.class.includes('react-affiliate-placeholder')) {
                        return renderInlineAffiliate(domNode.attribs);
                      }
                      
                      // Intercept raw Gutenberg SEO blocks and replace them with our premium React components inline
                      if (domNode.attribs) {
                        const classes = domNode.attribs.class || '';
                        const id = domNode.attribs.id || '';
                        
                        if (classes.includes('wp-block-yoast-faq-block') || classes.includes('schema-faq') || id === 'rank-math-faq' || classes.includes('rank-math-faq')) {
                          return renderFaq(true);
                        }
                        if (classes.includes('schema-how-to') || classes.includes('rank-math-howto-block') || classes.includes('wp-block-yoast-how-to-block')) {
                          return renderHowTo(true);
                        }
                      }
                      
                      // Inject Global Amazon Affiliate ID into any existing Amazon links in content
                      if (domNode.name === 'a' && domNode.attribs && domNode.attribs.href && globalAmazonId) {
                        const href = domNode.attribs.href;
                        if (href.includes('amazon.') || href.includes('amzn.to')) {
                           let finalLink = href.replace(/([?&])tag=[^&]+(&|$)/, '$1');
                           finalLink = finalLink.replace(/[?&]$/, '');
                           finalLink += (finalLink.includes('?') ? '&' : '?') + 'tag=' + encodeURIComponent(globalAmazonId);
                           domNode.attribs.href = finalLink;
                           return domNode;
                        }
                      }
                      
                      // Make tables responsive on mobile by wrapping them in a scrollable container
                      if (domNode.name === 'table') {
                        // We do a simple React element creation to avoid infinite recursion
                        // We map basic attributes manually (class -> className, etc)
                        const props: any = {};
                        if (domNode.attribs) {
                          for (const key in domNode.attribs) {
                             if (key === 'class') props.className = domNode.attribs[key];
                             else if (key === 'colspan') props.colSpan = domNode.attribs[key];
                             else if (key === 'rowspan') props.rowSpan = domNode.attribs[key];
                             else props[key] = domNode.attribs[key];
                          }
                        }
                        // We want to process the children normally, so we don't pass 'replace' again to avoid complexity.
                        // For tables, domToReact is usually fine without recursive replacements inside.
                        return (
                          <div className="responsive-table-wrapper">
                            <table {...props}>
                              {domToReact(domNode.children as any)}
                            </table>
                          </div>
                        );
                      }
                    }
                  })}

                  {/* If position is after_content, integrate them seamlessly at the end of the article text */}
                  {faqPosition === 'after_content' && renderFaq(true)}
                  {howtoPosition === 'after_content' && renderHowTo(true)}

                  {/* Smart Tags Section */}
                  {finalTagsList.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Related Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {finalTagsList.map((tag: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors cursor-default">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


    </>
  );
}

