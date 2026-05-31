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
  // ─── HIGH CONVERTING (BOOKS) ──────────────────────────────────────────────────
  {
    id: 'lucent-gk',
    title: 'Lucent General Knowledge (Latest Edition)',
    author: 'Dr. Binay Karna',
    image: 'https://m.media-amazon.com/images/I/710bKVqYhQL._SL1500_.jpg',
    price: '₹225',
    originalPrice: '₹305',
    rating: 4.8,
    buyLink: 'https://www.amazon.in/dp/9384761540?tag=shark0e6-21',
    categoryTags: ['gk', 'police', 'state', 'railway', 'ssc', 'jobs', 'result', 'admit'],
    description: 'The universal reference book containing structured notes for History, Geography, Polity, Science, and Miscellaneous GK facts.',
    discountBadge: '26% OFF'
  },
  {
    id: 'ssc-gs-kiran',
    title: 'Kiran SSC General Studies Chapterwise Solved Papers',
    author: 'Kiran Editorial Board',
    image: 'https://m.media-amazon.com/images/I/81bH9f7f9ML._SL1500_.jpg',
    price: '₹535',
    originalPrice: '₹695',
    rating: 4.6,
    buyLink: 'https://www.amazon.in/dp/9357156947?tag=shark0e6-21',
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts'],
    description: 'Comprehensive chapterwise solved papers from 1999 to present, covering History, Polity, Geography, Economics, and Science.',
    discountBadge: '23% OFF'
  },
  {
    id: 'ssc-english-neetu',
    title: 'English for General Competitions - Vol. 1',
    author: 'Neetu Singh (KD Publication)',
    image: 'https://m.media-amazon.com/images/I/71A9146gI2L._SL1500_.jpg',
    price: '₹340',
    originalPrice: '₹450',
    rating: 4.8,
    buyLink: 'https://www.amazon.in/dp/9391122176?tag=shark0e6-21',
    categoryTags: ['ssc', 'jobs', 'cgl', 'chsl', 'mts', 'banking'],
    description: 'The golden book for competitive grammar rules, idioms, vocabulary, and paragraph-comprehension practice sets.',
    discountBadge: '24% OFF'
  },
  {
    id: 'upsc-polity-laxmikanth',
    title: 'Indian Polity for Civil Services Examinations',
    author: 'M. Laxmikanth (McGraw Hill)',
    image: 'https://m.media-amazon.com/images/I/71aSFBpEqGL._SL1500_.jpg',
    price: '₹710',
    originalPrice: '₹895',
    rating: 4.9,
    buyLink: 'https://www.amazon.in/dp/935260363X?tag=shark0e6-21',
    categoryTags: ['civil-services', 'upsc', 'ias', 'psc', 'state'],
    description: 'The bible for Indian constitution, parliamentary structure, local government, and executive systems. Essential for IAS aspirants.',
    discountBadge: '21% OFF'
  },
  {
    id: 'bank-quant-rs',
    title: 'Quantitative Aptitude for Competitive Exams',
    author: 'Dr. R.S. Aggarwal (S. Chand)',
    image: 'https://m.media-amazon.com/images/I/71-0+4H-4IL._SL1500_.jpg',
    price: '₹580',
    originalPrice: '₹725',
    rating: 4.7,
    buyLink: 'https://www.amazon.in/dp/9352535324?tag=shark0e6-21',
    categoryTags: ['banking', 'ibps', 'sbi', 'po', 'clerk', 'jobs'],
    description: 'The foundation manual for commercial math, data interpretation, equations, fractions, and percentage charts.',
    discountBadge: '20% OFF'
  },
  {
    id: 'rrb-speedy-science',
    title: 'Speedy Railway General Science (Hindi/English)',
    author: 'Speedy Publications',
    image: 'https://m.media-amazon.com/images/I/71z7xS9+lZL._SL1500_.jpg',
    price: '₹180',
    originalPrice: '₹250',
    rating: 4.6,
    buyLink: 'https://www.amazon.in/dp/B09WJY4Q91?tag=shark0e6-21',
    categoryTags: ['railway', 'rrb', 'jobs', 'science', 'group-d'],
    description: 'Extremely popular quick-revision guide compiling 20+ years of previous science question banks for rapid recall.',
    discountBadge: '28% OFF'
  },

  // ─── HIGH PROFIT / GADGETS (HIGH COMMISSION) ──────────────────────────────────
  {
    id: 'hp-laptop-15s',
    title: 'HP 15s Core i3 12th Gen Laptop (8GB/512GB SSD)',
    author: 'HP',
    image: 'https://m.media-amazon.com/images/I/718yG0g8f0L._SL1500_.jpg',
    price: '₹37,990',
    originalPrice: '₹47,147',
    rating: 4.3,
    buyLink: 'https://www.amazon.in/dp/B0C4M9NN34?tag=shark0e6-21',
    categoryTags: ['laptop', 'computer', 'tech', 'student'],
    description: 'Perfect budget laptop for online classes, mock tests, and PDF reading with long battery life.',
    discountBadge: '19% OFF'
  },
  {
    id: 'epson-printer-l3250',
    title: 'Epson EcoTank L3250 A4 Wi-Fi All-in-One Ink Tank Printer',
    author: 'Epson',
    image: 'https://m.media-amazon.com/images/I/61b7fI0v3lL._SL1500_.jpg',
    price: '₹13,999',
    originalPrice: '₹18,299',
    rating: 4.4,
    buyLink: 'https://www.amazon.in/dp/B09G3CDB6P?tag=shark0e6-21',
    categoryTags: ['printer', 'tech', 'student', 'admit', 'result'],
    description: 'Cost-effective printer for printing syllabus, previous year papers, and application forms at home.',
    discountBadge: '23% OFF'
  },
  {
    id: 'study-table-wood',
    title: 'Wakefit Sage Study Table / Computer Desk',
    author: 'Wakefit',
    image: 'https://m.media-amazon.com/images/I/71d-a0oDntL._SL1500_.jpg',
    price: '₹3,499',
    originalPrice: '₹5,999',
    rating: 4.5,
    buyLink: 'https://www.amazon.in/dp/B0B68S3Z56?tag=shark0e6-21',
    categoryTags: ['furniture', 'study-table', 'desk', 'student'],
    description: 'Ergonomic wooden study table for long hours of preparation with ample legroom and storage shelf.',
    discountBadge: '41% OFF'
  },
  {
    id: 'boat-headphones',
    title: 'boAt Rockerz 450 Bluetooth On Ear Headphones',
    author: 'boAt',
    image: 'https://m.media-amazon.com/images/I/51xxA+6E+xL._SL1500_.jpg',
    price: '₹1,499',
    originalPrice: '₹3,990',
    rating: 4.1,
    buyLink: 'https://www.amazon.in/dp/B07PR1CL3S?tag=shark0e6-21',
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
