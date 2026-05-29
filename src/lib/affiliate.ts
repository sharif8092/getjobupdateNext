export interface AffiliateProduct {
  id: string;
  title: string;
  author: string;
  image: string; // Dynamic icons/emojis/placeholder paths (styled beautifully in cards)
  price: string;
  originalPrice?: string;
  rating: number;
  buyLink: string; // Amazon Affiliate redirect url
  categoryTags: string[]; // ['ssc', 'banking', 'railway', 'gk', 'police', 'civil-services']
  description: string;
  discountBadge?: string;
}

// Curated database of high-converting exam-preparation books & materials
export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  // SSC Book Set
  {
    id: 'ssc-gs-kiran',
    title: 'Kiran SSC General Studies Chapterwise Solved Papers',
    author: 'Kiran Editorial Board',
    image: '📚',
    price: '₹535',
    originalPrice: '₹695',
    rating: 4.6,
    buyLink: 'https://amzn.to/3ABC123', // Replace with user's actual affiliate links
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts'],
    description: 'Comprehensive chapterwise solved papers from 1999 to present, covering History, Polity, Geography, Economics, and Science.',
    discountBadge: '23% OFF'
  },
  {
    id: 'ssc-english-neetu',
    title: 'English for General Competitions - Vol. 1',
    author: 'Neetu Singh (KD Publication)',
    image: '📖',
    price: '₹340',
    originalPrice: '₹450',
    rating: 4.8,
    buyLink: 'https://amzn.to/3DEF456',
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts', 'banking'],
    description: 'The golden book for competitive grammar rules, idioms, vocabulary, and paragraph-comprehension practice sets.',
    discountBadge: '24% OFF'
  },
  // UPSC & Civil Services
  {
    id: 'upsc-polity-laxmikanth',
    title: 'Indian Polity for Civil Services Examinations',
    author: 'M. Laxmikanth (McGraw Hill)',
    image: '🏛️',
    price: '₹710',
    originalPrice: '₹895',
    rating: 4.9,
    buyLink: 'https://amzn.to/3GHI789',
    categoryTags: ['civil-services', 'upsc', 'ias', 'psc', 'state'],
    description: 'The bible for Indian constitution, parliamentary structure, local government, and executive systems. Essential for IAS aspirants.',
    discountBadge: '21% OFF'
  },
  {
    id: 'upsc-geography-gc',
    title: 'Certificate Physical and Human Geography',
    author: 'G.C. Leong',
    image: '🌍',
    price: '₹315',
    originalPrice: '₹399',
    rating: 4.7,
    buyLink: 'https://amzn.to/3JKL012',
    categoryTags: ['civil-services', 'upsc', 'ias', 'psc', 'geography'],
    description: 'Clear, concise descriptions of climate zones, landforms, vegetation, and mapping keys for pre-lims and mains exams.',
    discountBadge: '21% OFF'
  },
  // Railways (RRB)
  {
    id: 'rrb-ntpc-arihant',
    title: 'Arihant RRB NTPC & Group D Solved Practice Guide',
    author: 'Arihant Experts',
    image: '🚂',
    price: '₹265',
    originalPrice: '₹350',
    rating: 4.5,
    buyLink: 'https://amzn.to/3MNO345',
    categoryTags: ['railway', 'rrb', 'ntpc', 'group-d', 'jobs'],
    description: 'Specialized model test papers with answers, covering numerical ability, general reasoning, and railway GK concepts.',
    discountBadge: '24% OFF'
  },
  {
    id: 'rrb-speedy-science',
    title: 'Speedy Railway General Science (Hindi/English)',
    author: 'Speedy Publications',
    image: '🧪',
    price: '₹180',
    originalPrice: '₹250',
    rating: 4.6,
    buyLink: 'https://amzn.to/3PQR567',
    categoryTags: ['railway', 'rrb', 'jobs', 'science', 'group-d'],
    description: 'Extremely popular quick-revision guide compiling 20+ years of previous science question banks for rapid recall.',
    discountBadge: '28% OFF'
  },
  // Banking (IBPS/SBI)
  {
    id: 'bank-quant-rs',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal (S. Chand)',
    image: '🧮',
    price: '₹580',
    originalPrice: '₹725',
    rating: 4.7,
    buyLink: 'https://amzn.to/3STU678',
    categoryTags: ['banking', 'ibps', 'sbi', 'po', 'clerk', 'jobs'],
    description: 'The foundation manual for commercial math, data interpretation, equations, fractions, and percentage charts.',
    discountBadge: '20% OFF'
  },
  {
    id: 'bank-awareness-arihant',
    title: 'Banking Awareness & Financial Systems',
    author: 'Arihant Experts',
    image: '💳',
    price: '₹220',
    originalPrice: '₹295',
    rating: 4.4,
    buyLink: 'https://amzn.to/3VWX789',
    categoryTags: ['banking', 'ibps', 'sbi', 'jobs'],
    description: 'Detailed analysis of RBI guidelines, monetary policies, banking history, digital transactions, and money market concepts.',
    discountBadge: '25% OFF'
  },
  // Universal Fallbacks / General Knowledge / Police & State Exams
  {
    id: 'lucent-gk',
    title: 'Lucent General Knowledge (Latest 2026 Edition)',
    author: 'Dr. Binay Karna',
    image: '📝',
    price: '₹240',
    originalPrice: '₹310',
    rating: 4.8,
    buyLink: 'https://amzn.to/3YZA890',
    categoryTags: ['gk', 'police', 'jobs', 'state', 'admit', 'result'],
    description: 'The universal reference book containing structured notes for History, Geography, Polity, Science, and Miscellaneous GK facts.',
    discountBadge: '22% OFF'
  },
  {
    id: 'arihant-gk-pandey',
    title: 'General Knowledge 2026 for State Board Recruitments',
    author: 'Manohar Pandey (Arihant)',
    image: '👑',
    price: '₹140',
    originalPrice: '₹175',
    rating: 4.6,
    buyLink: 'https://amzn.to/3BCD123',
    categoryTags: ['gk', 'police', 'state', 'yojana', 'jobs'],
    description: 'High-speed booklet outlining Indian national struggles, census figures, science keys, and hot current affairs summaries.',
    discountBadge: '20% OFF'
  }
];

/**
 * Perform smart matching based on post text keywords or categories.
 * Fallbacks to GK / Lucent if no specific boards or categories match.
 */
export function getRecommendedProducts(tags: string[], limit: number = 3): AffiliateProduct[] {
  // Clean and normalize input tags to lowercase
  const normalizedTags = tags.map(tag => tag.toLowerCase().trim());

  // Perform filtering based on overlaps
  let matched = AFFILIATE_PRODUCTS.filter(product => {
    return product.categoryTags.some(prodTag => 
      normalizedTags.some(userTag => userTag.includes(prodTag) || prodTag.includes(userTag))
    );
  });

  // If no match found, fill with GK (Universal Fallbacks)
  if (matched.length === 0) {
    matched = AFFILIATE_PRODUCTS.filter(product => product.categoryTags.includes('gk'));
  }

  // Ensure unique elements and slice by limit
  return Array.from(new Set(matched)).slice(0, limit);
}
