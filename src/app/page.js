import BookCard from "@/components/BookCard";
import HeroSearch from "@/components/home/HeroSearch";
import CategoryTabs from "@/components/home/CategoryTabs";
import {
  Sparkles, ArrowRight, PlusCircle, Check, MessageCircle, MapPin, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server-side data fetching
async function fetchBooksData(searchParams) {
  const { category } = searchParams;
  // Use the production PORT assigned by Render, defaulting to 5000 for local dev
  const port = process.env.PORT || 5000;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://127.0.0.1:${process.env.PORT || 5000}`;
  let url = `${baseUrl}/api/books`;

  console.log(`🔍 [SSR] Fetching books from internal URL: ${url}`);

  const query = new URLSearchParams();
  if (category && category !== "all") {
    if (category === "Bundles") {
      query.append("isBundle", "true");
    } else {
      query.append("category", category);
    }
  }

  try {
    const res = await fetch(`${url}?${query.toString()}`, {
      next: { revalidate: 0 } // no-cache for dev demo
    });

    if (!res.ok) {
      console.error(`❌ [SSR] Fetch Failed: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    console.log(`✅ [SSR] Successfully fetched ${data.length} books!`);
    return data;
  } catch (error) {
    console.error("❌ [SSR] Fetch Error:", error.message);
    return []; // Return empty array so the page doesn't crash
  }
}

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const books = await fetchBooksData(params);
  const activeCategory = params.category || "all";

  return (
    <div className="min-h-screen pb-20 md:pb-12 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pb-24 md:pb-40 px-6 md:px-12 bg-mesh overflow-hidden border-b border-indigo-50/50">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[130px]" />

        <div className="max-w-7xl mx-auto relative z-10 pt-12 md:pt-20">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase mb-10 shadow-sm mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Premium 2nd Hand Marketplace</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
              Buy & Sell <br />
              <span className="text-gradient">2nd Hand Books.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
              Join the student revolution. Trade textbooks, notes, and study gear with verified peers securely and instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
              <Link href="#explore">
                <Button
                  suppressHydrationWarning
                  className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <span>Browse Library</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button
                  suppressHydrationWarning
                  variant="outline"
                  className="h-16 px-10 border-indigo-100 bg-white/50 backdrop-blur-md text-slate-900 hover:bg-white rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <PlusCircle className="w-5 h-5 text-indigo-600" />
                  <span>Start Selling</span>
                </Button>
              </Link>
            </div>

            {/* Premium Unified Search (Client Component) */}
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main id="explore" className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20">

        {/* Categories Bar (Premium Pill Version) */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] tracking-[0.2em] uppercase mb-3">
                <div className="w-8 h-px bg-indigo-600" />
                <span>Verified Listings</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                Fresh for your <span className="text-gradient">Shelf.</span>
              </h2>
            </div>

            {/* Category Tabs (Client Component) */}
            <CategoryTabs activeCategory={activeCategory} />
          </div>

          {/* Optimized Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {books.length > 0 ? (
              books.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center card-premium bg-slate-50/50 border-dashed border-2">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <BookOpen className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Nothing here yet</h3>
                <p className="text-slate-400 max-w-sm mx-auto font-medium">Be the first to list a book in this category and start earning.</p>
                <Link href="/sell">
                  <Button className="mt-10 bg-indigo-600 text-white rounded-2xl px-12 h-14 font-black">
                    Post an Ad
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic CTA Banner */}
        <section className="mb-24 px-2">
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.15)]">
            {/* Glow decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-transform group-hover:scale-110 duration-1000" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-4xl md:text-6xl font-black text-white leading-[0.95] mb-8 tracking-tighter">
                  Earn cash from <br />
                  <span className="text-indigo-400">old books.</span>
                </h3>
                <p className="text-slate-400 text-lg md:text-xl mb-12 font-medium max-w-md">
                  Join 5,000+ students already making money and helping peers. List your first book today.
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link href="/sell">
                    <button
                      suppressHydrationWarning
                      className="h-16 flex items-center justify-center px-10 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                    >
                      Post Listing
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </Link>
                  <Link href="/profile">
                    <button
                      suppressHydrationWarning
                      className="h-16 flex items-center justify-center px-10 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
                    >
                      Manage Ads
                    </button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 w-full h-full bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 flex flex-col justify-center gap-6 shadow-2xl">
                    {[
                      { label: "List for free", icon: Check },
                      { label: "Connect with buyers", icon: MessageCircle },
                      { label: "Meet in person", icon: MapPin },
                      { label: "Instant Cash", icon: Sparkles },
                    ].map((item, id) => {
                      const Icon = item.icon;
                      return (
                        <div key={id} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                            <Icon size={20} />
                          </div>
                          <span className="font-black text-white/80 text-sm tracking-wide uppercase">{item.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
