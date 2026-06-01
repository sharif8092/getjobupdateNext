'use server';

import { searchPosts, WordPressPost } from '@/lib/wordpress';

export async function getLiveSearchResults(query: string): Promise<WordPressPost[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    // Search for 5 results max for autocomplete
    const results = await searchPosts(query.trim(), 5);
    return results;
  } catch (error) {
    console.error("Live search failed", error);
    return [];
  }
}
