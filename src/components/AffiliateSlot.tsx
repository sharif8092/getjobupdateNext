import React from 'react';
import AffiliateAd from './AffiliateAd';
import { getAffiliateSettings } from '@/lib/wordpress';

interface AffiliateSlotProps {
  position: string;
  slots?: Array<{ position: string; tags: string[] }>;
  fallbackTags?: string[];
  department?: string;
  postType?: string;
}

export default async function AffiliateSlot({ position, slots, fallbackTags, department, postType }: AffiliateSlotProps) {
  // Find matching slot from backend data if available
  const match = slots?.find(s => s.position === position);
  
  const tagsToUse = match?.tags || fallbackTags;
  
  if (!tagsToUse || tagsToUse.length === 0) {
    return null; // Don't render if no tags and no fallback
  }

  // Inject contextual tags
  const contextualTags = [...tagsToUse];
  if (department) contextualTags.push(department);
  if (postType) contextualTags.push(postType);

  // Fetch the global Amazon Affiliate ID from WordPress Settings
  const settings = await getAffiliateSettings();
  const amazonId = settings?.amazon_id || '';

  return (
    <div className="mb-6 affiliate-slot-container" data-position={position}>
      <AffiliateAd tags={contextualTags} globalAmazonId={amazonId} variant={position === 'before_content' ? 'highlight' : 'list'} position={position} />
    </div>
  );
}
