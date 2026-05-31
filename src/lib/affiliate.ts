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

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'lucent-gk',
    title: 'Lucent General Knowledge (Latest Edition)',
    author: 'Dr. Binay Karna',
    image: 'https://m.media-amazon.com/images/I/71Bh1Nn7wGL._SL1500_.jpg',
    price: '₹225',
    originalPrice: '₹305',
    rating: 4.8,
    buyLink: 'https://www.amazon.in/dp/9384761540?tag=shark0e6-21',
    // ✅ ASIN valid — no change needed
    categoryTags: ['gk', 'police', 'state', 'railway', 'ssc', 'jobs', 'result', 'admit'],
    description: 'The universal reference book containing structured notes for History, Geography, Polity, Science, and Miscellaneous GK facts.',
    discountBadge: '26% OFF'
  },
  {
    id: 'ssc-gs-kiran',
    title: 'Kiran SSC General Awareness Chapterwise & Typewise Solved Papers (14000+ Questions)',
    author: 'Kiran Institute of Career Excellence',
    image: 'https://m.media-amazon.com/images/I/61ZMLgcFunL.jpg',
    price: '₹535',
    originalPrice: '₹695',
    rating: 4.6,
    buyLink: 'https://www.amazon.in/dp/9395499958?tag=shark0e6-21',
    // ⚠️ OLD ASIN 9357156947 → NEW ASIN 9395499958
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts'],
    description: 'Comprehensive chapterwise solved papers from 1999 to present, covering History, Polity, Geography, Economics, and Science.',
    discountBadge: '23% OFF'
  },
  {
    id: 'ssc-english-neetu',
    title: 'English for General Competitions Vol. 1 (2025 Edition)',
    author: 'Neetu Singh (KD Publication)',
    image: 'https://m.media-amazon.com/images/I/818S5CnzFiL._SL1500_.jpg',
    price: '₹340',
    originalPrice: '₹450',
    rating: 4.8,
    buyLink: 'https://www.amazon.in/dp/B0DXR9MT8Y?tag=shark0e6-21',
    // ⚠️ OLD ASIN 9391122176 → NEW ASIN B0DXR9MT8Y (2025 edition)
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts', 'banking'],
    description: 'The golden book for competitive grammar rules, idioms, vocabulary, and paragraph-comprehension practice sets.',
    discountBadge: '24% OFF'
  },
  {
    id: 'upsc-polity-laxmikanth',
    title: 'Indian Polity for Civil Services Examinations (7th Edition)',
    author: 'M. Laxmikanth (McGraw Hill)',
    image: 'https://m.media-amazon.com/images/I/71CrTyKsazL._SL1500_.jpg',
    price: '₹710',
    originalPrice: '₹895',
    rating: 4.9,
    buyLink: 'https://www.amazon.in/dp/9355325347?tag=shark0e6-21',
    // ⚠️ OLD ASIN 935260363X → NEW ASIN 9355325347 (7th edition, latest)
    categoryTags: ['civil-services', 'upsc', 'ias', 'psc', 'state'],
    description: 'The bible for Indian constitution, parliamentary structure, local government, and executive systems. Essential for IAS aspirants.',
    discountBadge: '21% OFF'
  },
  {
    id: 'bank-quant-rs',
    title: 'Quantitative Aptitude for Competitive Exams (Revised 2025)',
    author: 'Dr. R.S. Aggarwal (S. Chand)',
    image: 'https://m.media-amazon.com/images/I/81WnvzEVwGL._SL1500_.jpg',
    price: '₹580',
    originalPrice: '₹725',
    rating: 4.7,
    buyLink: 'https://www.amazon.in/dp/B0D6VFV3ZP?tag=shark0e6-21',
    // ⚠️ OLD ASIN 9352535324 → NEW ASIN B0D6VFV3ZP (Revised 2025)
    categoryTags: ['banking', 'ibps', 'sbi', 'po', 'clerk', 'jobs'],
    description: 'The foundation manual for commercial math, data interpretation, equations, fractions, and percentage charts.',
    discountBadge: '20% OFF'
  },
  {
    id: 'rrb-speedy-science',
    title: 'Speedy Railway General Science (Hindi/English)',
    author: 'Speedy Publications',
    image: 'https://m.media-amazon.com/images/I/71klqqkT9PL._SL1500_.jpg',
    price: '₹180',
    originalPrice: '₹250',
    rating: 4.6,
    buyLink: 'https://amzn.to/4eddTah?tag=shark0e6-21',
    // ✅ No change — ASIN valid
    categoryTags: ['railway', 'rrb', 'jobs', 'science', 'group-d'],
    description: 'Extremely popular quick-revision guide compiling 20+ years of previous science question banks for rapid recall.',
    discountBadge: '28% OFF'
  },
  {
    id: 'Macbook-neo-13',
    title: 'Apple 2026 MacBook Neo 13',
    author: 'HP',
    image: 'https://m.media-amazon.com/images/I/718yG0g8f0L._SL1500_.jpg',
    price: '₹6500',
    originalPrice: '₹65000',
    rating: 4.7,
    buyLink: 'https://m.media-amazon.com/images/I/61dLund7bhL._SL1500_.jpg',
    // ✅ No change — ASIN valid
    categoryTags: ['laptop', 'computer', 'tech', 'student'],
    description: 'Perfect budget laptop for online classes, mock tests, and PDF reading with long battery life.',
    discountBadge: '7% OFF'
  },
  {
    id: 'epson-printer-l3250',
    title: 'Epson EcoTank L3250 A4 Wi-Fi All-in-One Ink Tank Printer',
    author: 'Epson',
    image: 'https://m.media-amazon.com/images/I/51syeAn7ElL._SL1500_.jpg',
    price: '₹15,498',
    originalPrice: '₹18,299',
    rating: 4.4,
    buyLink: 'https://amzn.to/43a2MZB',
    // ✅ No change — ASIN valid
    categoryTags: ['printer', 'tech', 'student', 'admit', 'result'],
    description: 'Cost-effective printer for printing syllabus, previous year papers, and application forms at home.',
    discountBadge: '14% OFF'
  },
  {
    id: 'study-table-wood',
    title: 'Callas Engineered Wooden Study Table with Hutch & Bottom Storage',
    author: 'Callas',
    image: 'https://m.media-amazon.com/images/I/91tIHnj7XgL._SL1500_.jpg',
    price: '₹4,449',
    originalPrice: '₹6,999',
    rating: 3.8,
    buyLink: 'https://amzn.to/4uDAR07',
    // ✅ No change — ASIN valid
    categoryTags: ['furniture', 'study-table', 'desk', 'student'],
    description: 'Ergonomic wooden study table for long hours of preparation with ample legroom and storage shelf.',
    discountBadge: '36% OFF'
  },
  {
    id: 'boat-headphones',
    title: 'Boat New Launch Rockerz 650 Pro, Touch/Swipe Controls, Dolby Audio, 80Hrs Battery',
    author: 'boAt',
    image: 'https://m.media-amazon.com/images/I/51xxA+6E+xL._SL1500_.jpg',
    price: '₹2,728',
    originalPrice: '8,999',
    rating: 4.1,
    buyLink: 'https://amzn.to/4wYBXVR',
    // ✅ No change — ASIN confirmed live
    categoryTags: ['headphones', 'tech', 'student', 'audio'],
    description: 'Immersive audio for focused online video lectures without background disturbance.',
    discountBadge: '62% OFF'
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
