// Mock data for BookBazaar — Phase 3: Intelligence + Trust + Location

// ========== BOOKS ==========

export const books = [
  {
    id: "1",
    title: "HC Verma - Concepts of Physics Vol. 1",
    author: "H.C. Verma",
    price: 280,
    mrp: 550,
    image: "https://picsum.photos/seed/physics1/400/500",
    condition: "Like New",
    demand: "high",
    category: "JEE",
    classLevel: "Class 11-12",
    description:
      "Comprehensive physics textbook for competitive exam preparation. Excellent condition with no markings or highlighting. All pages intact with original binding.",
    seller: { name: "Arjun Sharma", rating: 4.8, avatar: "AS", booksListed: 12, verified: true, badge: "Top Seller", completedDeals: 28, responseTime: "~15 min" },
    views: 142, requests: 8, searchCount: 320, conditionVerified: true, conditionVerifiedBy: 3,
    location: "IIT Delhi, Hauz Khas", distance: 1.2,
    priceHistory: [320, 300, 290, 280], avgMarketPrice: 310,
  },
  {
    id: "2",
    title: "RD Sharma Mathematics Class 12",
    author: "R.D. Sharma",
    price: 320,
    mrp: 699,
    image: "https://picsum.photos/seed/maths12/400/500",
    condition: "Good",
    demand: "high",
    category: "Class 11-12",
    classLevel: "Class 12",
    description:
      "Widely referenced math textbook for CBSE Class 12. Some light pencil markings that can be erased. Spine is in perfect condition.",
    seller: { name: "Priya Patel", rating: 4.5, avatar: "PP", booksListed: 8, verified: true, badge: "Verified", completedDeals: 12, responseTime: "~30 min" },
    views: 98, requests: 5, searchCount: 250, conditionVerified: true, conditionVerifiedBy: 2,
    location: "DTU, Rohini", distance: 3.5,
    priceHistory: [380, 350, 330, 320], avgMarketPrice: 340,
  },
  {
    id: "3",
    title: "NCERT Biology Class 11",
    author: "NCERT",
    price: 120,
    mrp: 250,
    image: "https://picsum.photos/seed/bio11/400/500",
    condition: "Good",
    demand: "medium",
    category: "NEET",
    classLevel: "Class 11",
    description:
      "Standard NCERT Biology textbook for Class 11. Clean pages with a few bookmarks. Ideal for board exam and NEET preparation.",
    seller: { name: "Ravi Kumar", rating: 4.2, avatar: "RK", booksListed: 5, verified: false, badge: null, completedDeals: 4, responseTime: "~1 hr" },
    views: 54, requests: 3, searchCount: 180, conditionVerified: false, conditionVerifiedBy: 0,
    location: "AIIMS, Ansari Nagar", distance: 2.8,
    priceHistory: [150, 140, 130, 120], avgMarketPrice: 135,
  },
  {
    id: "4",
    title: "Organic Chemistry by Morrison & Boyd",
    author: "Morrison & Boyd",
    price: 450,
    mrp: 899,
    image: "https://picsum.photos/seed/ochem/400/500",
    condition: "Like New",
    demand: "high",
    category: "JEE",
    classLevel: "Class 11-12",
    description:
      "The gold standard for organic chemistry. Purchased just 3 months ago, barely used. No markings, no dog-eared pages. Hardcover edition.",
    seller: { name: "Sneha Gupta", rating: 4.9, avatar: "SG", booksListed: 15, verified: true, badge: "Top Seller", completedDeals: 35, responseTime: "~10 min" },
    views: 186, requests: 12, searchCount: 290, conditionVerified: true, conditionVerifiedBy: 5,
    location: "NSIT, Dwarka", distance: 0.8,
    priceHistory: [500, 480, 460, 450], avgMarketPrice: 470,
  },
  {
    id: "5",
    title: "English Grammar & Composition",
    author: "Wren & Martin",
    price: 150,
    mrp: 350,
    image: "https://picsum.photos/seed/english/400/500",
    condition: "Poor",
    demand: "low",
    category: "School",
    classLevel: "Class 9-10",
    description:
      "Classic English grammar reference. Cover has some wear but all pages are intact. Helpful for building strong grammar fundamentals.",
    seller: { name: "Amit Singh", rating: 3.8, avatar: "AS", booksListed: 3, verified: false, badge: null, completedDeals: 2, responseTime: "~2 hr" },
    views: 18, requests: 1, searchCount: 60, conditionVerified: false, conditionVerifiedBy: 0,
    location: "Rajouri Garden", distance: 5.2,
    priceHistory: [180, 170, 160, 150], avgMarketPrice: 160,
  },
  {
    id: "6",
    title: "Data Structures using C++",
    author: "D.S. Malik",
    price: 380,
    mrp: 750,
    image: "https://picsum.photos/seed/dsa/400/500",
    condition: "Good",
    demand: "medium",
    category: "College",
    classLevel: "B.Tech",
    description:
      "Comprehensive guide to data structures with C++ implementations. Slight highlighting in first two chapters, otherwise clean.",
    seller: { name: "Kavitha R.", rating: 4.6, avatar: "KR", booksListed: 9, verified: true, badge: "Verified", completedDeals: 14, responseTime: "~20 min" },
    views: 67, requests: 4, searchCount: 130, conditionVerified: true, conditionVerifiedBy: 2,
    location: "IIT Delhi, Hauz Khas", distance: 1.5,
    priceHistory: [420, 400, 390, 380], avgMarketPrice: 400,
  },
  {
    id: "7",
    title: "Cengage Physics for JEE Advanced",
    author: "B.M. Sharma",
    price: 520,
    mrp: 999,
    image: "https://picsum.photos/seed/cengage/400/500",
    condition: "Like New",
    demand: "high",
    category: "JEE",
    classLevel: "Class 11-12",
    description:
      "Complete set for JEE Advanced physics preparation. Includes practice problems book. No markings, pristine condition.",
    seller: { name: "Vikram Reddy", rating: 4.7, avatar: "VR", booksListed: 20, verified: true, badge: "Top Seller", completedDeals: 42, responseTime: "~5 min" },
    views: 210, requests: 15, searchCount: 410, conditionVerified: true, conditionVerifiedBy: 7,
    location: "NIT Delhi, Narela", distance: 2.0,
    priceHistory: [580, 560, 540, 520], avgMarketPrice: 550,
  },
  {
    id: "8",
    title: "NCERT Exemplar Chemistry Class 12",
    author: "NCERT",
    price: 90,
    mrp: 180,
    image: "https://picsum.photos/seed/chemex/400/500",
    condition: "Good",
    demand: "medium",
    category: "NEET",
    classLevel: "Class 12",
    description:
      "Exemplar problems for CBSE Chemistry Class 12. Great for additional practice. A few pages have pencil notes in margins.",
    seller: { name: "Neha Verma", rating: 4.4, avatar: "NV", booksListed: 6, verified: true, badge: "Verified", completedDeals: 8, responseTime: "~25 min" },
    views: 45, requests: 2, searchCount: 95, conditionVerified: false, conditionVerifiedBy: 0,
    location: "Jamia Millia, Okhla", distance: 4.1,
    priceHistory: [110, 100, 95, 90], avgMarketPrice: 100,
  },
];

// ========== CATEGORIES ==========

export const categories = [
  { id: "all", label: "All" },
  { id: "school", label: "School" },
  { id: "class-11-12", label: "Class 11-12" },
  { id: "jee", label: "JEE" },
  { id: "neet", label: "NEET" },
  { id: "college", label: "College" },
];

// ========== SEARCH DATA ==========

export const popularSearches = [
  "HC Verma Physics",
  "RD Sharma Class 12",
  "NCERT Biology",
  "JEE Mains books",
  "NEET preparation",
  "Class 12 PCM set",
  "Organic Chemistry",
  "Cengage Physics",
];

export const searchSuggestions = [
  { type: "book", text: "HC Verma - Concepts of Physics", category: "JEE" },
  { type: "book", text: "RD Sharma Mathematics Class 12", category: "Class 11-12" },
  { type: "book", text: "NCERT Biology Class 11", category: "NEET" },
  { type: "book", text: "Organic Chemistry by Morrison & Boyd", category: "JEE" },
  { type: "book", text: "Cengage Physics for JEE Advanced", category: "JEE" },
  { type: "book", text: "Data Structures using C++", category: "College" },
  { type: "category", text: "JEE", category: "JEE" },
  { type: "category", text: "NEET", category: "NEET" },
  { type: "category", text: "Class 11-12", category: "Class 11-12" },
  { type: "category", text: "College", category: "College" },
  { type: "popular", text: "Class 12 PCM Bundle", category: "JEE" },
  { type: "popular", text: "NEET Biology Combo", category: "NEET" },
];

export const alsoLookingFor = [
  { text: "JEE Advanced PYQs", count: 45 },
  { text: "NEET Biology MCQs", count: 38 },
  { text: "Class 12 Physics Notes", count: 32 },
  { text: "RD Sharma Solutions", count: 28 },
  { text: "Organic Chemistry Notes", count: 25 },
];

// ========== CHAT DATA ==========

export const messages = [
  { id: 1, text: "Hi! Is the HC Verma book still available?", sender: "buyer", time: "10:30 AM" },
  { id: 2, text: "Yes, it's available! Are you interested?", sender: "seller", time: "10:32 AM" },
  { id: 3, text: "Can you share some pictures of the book condition?", sender: "buyer", time: "10:33 AM" },
  { id: 4, text: "Sure! The book is in great condition. Barely used. I'll send photos.", sender: "seller", time: "10:35 AM" },
  { id: 5, text: "Looks good! Can you do ₹250?", sender: "buyer", time: "10:40 AM" },
  { id: 6, text: "I can do ₹270. Final price.", sender: "seller", time: "10:42 AM" },
  { id: 7, text: "Deal! Where can we meet for the exchange?", sender: "buyer", time: "10:43 AM" },
];

export const chatList = [
  { id: 1, name: "Arjun Sharma", avatar: "AS", lastMessage: "Deal! Where can we meet?", time: "10:43 AM", unread: 1, bookTitle: "HC Verma Physics" },
  { id: 2, name: "Priya Patel", avatar: "PP", lastMessage: "Is the book still available?", time: "Yesterday", unread: 0, bookTitle: "RD Sharma Maths" },
  { id: 3, name: "Vikram Reddy", avatar: "VR", lastMessage: "Can you do ₹480?", time: "2 days ago", unread: 2, bookTitle: "Cengage Physics" },
];

// ========== USER DATA ==========

export const user = {
  name: "Sehajdeep Singh",
  email: "sehajdeep@university.edu",
  avatar: "SS",
  rating: 4.7,
  booksListed: 5,
  booksSold: 3,
  joinedDate: "Jan 2025",
};

export const userBooks = [
  { id: "101", title: "Engineering Mathematics", price: 350, condition: "Good", status: "Active", views: 24 },
  { id: "102", title: "Digital Electronics", price: 200, condition: "Like New", status: "Active", views: 18 },
  { id: "103", title: "Computer Networks", price: 280, condition: "Good", status: "Sold", views: 45 },
];

export const requestsSent = [
  { id: 1, bookTitle: "HC Verma Physics Vol. 1", seller: "Arjun Sharma", status: "Pending", price: 280 },
  { id: 2, bookTitle: "Cengage Physics", seller: "Vikram Reddy", status: "Accepted", price: 520 },
];

export const requestsReceived = [
  { id: 1, bookTitle: "Engineering Mathematics", buyer: "Rahul Mehta", status: "Pending", price: 350 },
  { id: 2, bookTitle: "Digital Electronics", buyer: "Anita Joshi", status: "Pending", price: 200 },
];

// ========== BUNDLES ==========

export const bundles = [
  {
    id: "b1",
    title: "JEE Complete PCM Set",
    description: "Physics, Chemistry & Mathematics — everything you need for JEE preparation in one bundle.",
    category: "JEE",
    demand: "high",
    condition: "Like New",
    seller: { name: "Vikram Reddy", rating: 4.7, avatar: "VR", booksListed: 20, verified: true, badge: "Top Seller", completedDeals: 42, responseTime: "~5 min" },
    books: [
      { title: "HC Verma Physics Vol. 1", subject: "Physics", image: "https://picsum.photos/seed/physics1/400/500", mrp: 550 },
      { title: "Organic Chemistry Morrison & Boyd", subject: "Chemistry", image: "https://picsum.photos/seed/ochem/400/500", mrp: 899 },
      { title: "RD Sharma Mathematics", subject: "Mathematics", image: "https://picsum.photos/seed/maths12/400/500", mrp: 699 },
      { title: "Cengage Physics JEE Advanced", subject: "Physics", image: "https://picsum.photos/seed/cengage/400/500", mrp: 999 },
    ],
    totalMrp: 3147, totalPrice: 1450, savings: 1697,
    views: 245, requests: 18,
    location: "NIT Delhi, Narela", distance: 2.0,
  },
  {
    id: "b2",
    title: "NEET Bio + Chem Combo",
    description: "Top NEET preparation books for Biology and Chemistry — clean condition, great value.",
    category: "NEET",
    demand: "high",
    condition: "Good",
    seller: { name: "Neha Verma", rating: 4.4, avatar: "NV", booksListed: 6, verified: true, badge: "Verified", completedDeals: 8, responseTime: "~25 min" },
    books: [
      { title: "NCERT Biology Class 11", subject: "Biology", image: "https://picsum.photos/seed/bio11/400/500", mrp: 250 },
      { title: "NCERT Exemplar Chemistry 12", subject: "Chemistry", image: "https://picsum.photos/seed/chemex/400/500", mrp: 180 },
      { title: "Trueman's Biology Vol. 1", subject: "Biology", image: "https://picsum.photos/seed/truebio/400/500", mrp: 650 },
    ],
    totalMrp: 1080, totalPrice: 520, savings: 560,
    views: 156, requests: 11,
    location: "AIIMS, Ansari Nagar", distance: 2.8,
  },
  {
    id: "b3",
    title: "Class 12 CBSE Full Set",
    description: "Complete CBSE Class 12 science stream books — Physics, Chemistry, Maths, English.",
    category: "Class 11-12",
    demand: "medium",
    condition: "Good",
    seller: { name: "Priya Patel", rating: 4.5, avatar: "PP", booksListed: 8, verified: true, badge: "Verified", completedDeals: 12, responseTime: "~30 min" },
    books: [
      { title: "NCERT Physics Part 1 & 2", subject: "Physics", image: "https://picsum.photos/seed/ncertphy/400/500", mrp: 380 },
      { title: "NCERT Chemistry Part 1 & 2", subject: "Chemistry", image: "https://picsum.photos/seed/ncertchem/400/500", mrp: 360 },
      { title: "RD Sharma Maths Class 12", subject: "Mathematics", image: "https://picsum.photos/seed/maths12/400/500", mrp: 699 },
    ],
    totalMrp: 1439, totalPrice: 650, savings: 789,
    views: 87, requests: 6,
    location: "DTU, Rohini", distance: 3.5,
  },
  {
    id: "b4",
    title: "B.Tech CS Starter Pack",
    description: "Essential computer science books for first-year engineering students.",
    category: "College",
    demand: "medium",
    condition: "Like New",
    seller: { name: "Kavitha R.", rating: 4.6, avatar: "KR", booksListed: 9, verified: true, badge: "Verified", completedDeals: 14, responseTime: "~20 min" },
    books: [
      { title: "Data Structures using C++", subject: "CS", image: "https://picsum.photos/seed/dsa/400/500", mrp: 750 },
      { title: "Discrete Mathematics", subject: "Maths", image: "https://picsum.photos/seed/discrete/400/500", mrp: 550 },
    ],
    totalMrp: 1300, totalPrice: 580, savings: 720,
    views: 63, requests: 4,
    location: "IIT Delhi, Hauz Khas", distance: 1.5,
  },
];

// ========== HELPERS ==========

export function getBookById(id) {
  return books.find((book) => book.id === id) || null;
}

export function getBundleById(id) {
  return bundles.find((bundle) => bundle.id === id) || null;
}

export function getBooksByCategory(category) {
  if (category === "all") return books;
  return books.filter(
    (book) => book.category.toLowerCase() === category.toLowerCase()
  );
}

export function getBundlesByCategory(category) {
  if (category === "all") return bundles;
  return bundles.filter(
    (bundle) => bundle.category.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase() ||
      bundle.category.toLowerCase() === category.toLowerCase()
  );
}

export function searchBooks(query) {
  const q = query.toLowerCase();
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q)
  );
}

export function searchBundles(query) {
  const q = query.toLowerCase();
  return bundles.filter(
    (bundle) =>
      bundle.title.toLowerCase().includes(q) ||
      bundle.category.toLowerCase().includes(q) ||
      bundle.books.some((b) => b.title.toLowerCase().includes(q))
  );
}

export function getTrendingBooks() {
  return books.filter((book) => book.demand === "high");
}

export function getNearbyBooks(maxDistance = 3) {
  return books.filter((book) => book.distance <= maxDistance).sort((a, b) => a.distance - b.distance);
}

export function getSuggestions(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return searchSuggestions.filter((s) => s.text.toLowerCase().includes(q)).slice(0, 6);
}

export function getDemandLabel(book) {
  const score = (book.views || 0) * 0.3 + (book.requests || 0) * 5 + (book.searchCount || 0) * 0.1;
  if (score > 80) return { level: "high", label: "🔥 High Demand", color: "text-orange-600" };
  if (score > 30) return { level: "medium", label: "📈 Rising", color: "text-amber-600" };
  return { level: "low", label: "⚠️ Low", color: "text-gray-500" };
}

export function getSellingInsights(condition, mrp) {
  const condFactor = condition === "like-new" ? 0.6 : condition === "good" ? 0.45 : 0.3;
  const suggestedPrice = Math.round(mrp * condFactor);
  const fastPrice = Math.round(suggestedPrice * 0.85);
  const daysToSell = condition === "like-new" ? "2-3" : condition === "good" ? "4-5" : "7-10";
  return {
    suggestedPrice,
    fastPrice,
    daysToSell,
    priceRange: { min: Math.round(suggestedPrice * 0.8), max: Math.round(suggestedPrice * 1.2) },
  };
}
