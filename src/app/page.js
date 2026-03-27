"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Book, GraduationCap, LayoutGrid, Sparkles, TrendingUp,
  MapPin, Clock, ArrowRight, Filter, BookOpen, Layers, PlusCircle, Check, MessageCircle
} from "lucide-react";
import BookCard from "@/components/BookCard";
import { getBooks } from "@/lib/api";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";

const heroCategories = [
  { id: "all", label: "All Items", icon: LayoutGrid },
  { id: "JEE", label: "JEE", icon: Book },
  { id: "NEET", label: "NEET", icon: Sparkles },
  { id: "CBSE Boards", label: "CBSE Boards", icon: GraduationCap },
  { id: "Bundles", label: "Bundles", icon: Layers },
];

export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [activeCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      let params = {};
      if (activeCategory !== "all") {
        if (activeCategory === "Bundles") {
          params.isBundle = true;
        } else {
          params.category = activeCategory;
        }
      }
      const res = await getBooks(params);
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-12 overflow-x-hidden font-sans">
      {/* Hero Section */}
      <section className="relative pb-24 md:pb-40 px-6 md:px-12 bg-mesh overflow-hidden border-b border-indigo-50/50">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[130px] animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10 pt-12 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/20 text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase mb-10 shadow-sm mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Premium Campus Marketplace</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
              Buy & Sell <br />
              <span className="text-gradient">Books Smarter.</span>
            </h1>

            <p className="max-w-2xl text-lg md:text-xl text-slate-500 font-medium mb-12 leading-relaxed">
              Join the student revolution. Trade textbooks, notes, and study gear with verified peers on your campus securely and instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-16">
              <Button
                onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}
                className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-lg shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <span>Browse Library</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => router.push('/sell')}
                variant="outline"
                className="h-16 px-10 border-indigo-100 bg-white/50 backdrop-blur-md text-slate-900 hover:bg-white rounded-3xl font-black text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                <span>Start Selling</span>
              </Button>
            </div>

            {/* Premium Unified Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl glass-premium rounded-[2.5rem] p-2 md:p-3 flex flex-col md:flex-row items-center gap-3"
            >
              <div className="flex-1 w-full relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/search?q=${searchQuery}`)}
                  placeholder="Search textbooks, authors, or ISBN..."
                  className="w-full h-16 pl-16 pr-6 bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-lg font-bold outline-none"
                />
              </div>
              <Button
                onClick={() => router.push(`/search?q=${searchQuery}`)}
                className="w-full md:w-auto h-16 px-12 bg-slate-900 hover:bg-black text-white rounded-3xl font-black text-lg shadow-xl shadow-slate-200"
              >
                Search
              </Button>
            </motion.div>
          </motion.div>
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

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6 lg:mx-0 lg:px-0">
              {heroCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    suppressHydrationWarning
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isActive
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105"
                        : "bg-white border border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600"
                      }`}
                  >
                    <Icon size={14} />
                    {cat.label}
                  </button>
                );
              })}
              <Button variant="outline" className="h-12 w-12 rounded-full border-slate-100 text-slate-400 shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Optimized Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <div key={`skel-${i}`} className="aspect-[3/4.5] rounded-[2.5rem] skeleton-shimmer bg-slate-50" />
                ))
              ) : books.length > 0 ? (
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
                  <Button onClick={() => router.push('/sell')} className="mt-10 bg-indigo-600 text-white rounded-2xl px-12 h-14 font-black">
                    Post an Ad
                  </Button>
                </div>
              )}
            </AnimatePresence>
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
                  <button 
                    suppressHydrationWarning
                    onClick={() => router.push('/sell')} 
                    className="h-16 flex items-center justify-center px-10 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5"
                  >
                    Post Listing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    suppressHydrationWarning
                    onClick={() => router.push('/profile')} 
                    className="h-16 flex items-center justify-center px-10 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95"
                  >
                    Manage Ads
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative z-10 w-full h-full bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 flex flex-col justify-center gap-6 shadow-2xl">
                    {[
                      { label: "List for free", icon: Check },
                      { label: "Connect with buyers", icon: MessageCircle },
                      { label: "Meet on campus", icon: MapPin },
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
