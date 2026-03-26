"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Book, GraduationCap, LayoutGrid, Sparkles, TrendingUp, 
  MapPin, Clock, ArrowRight, Filter, BookOpen, Layers, PlusCircle
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
    <div className="min-h-screen pb-20 md:pb-12 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pb-20 md:pb-32 px-4 md:px-8 bg-hero-gradient overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-indigo-200/50 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-[130px] animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-8 mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>THE #1 2ND HAND STUDENT MARKETPLACE</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-gray-900 leading-[1.1] mb-6 drop-shadow-sm">
              Buy & Sell Books Smarter 📚
            </h1>
            
            <p className="max-w-xl text-xl md:text-2xl text-gray-600 font-medium mb-10">
              Save Money. Clear Your Shelf. The #1 2nd hand student marketplace for trading textbooks and study materials securely.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
               <Button onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 transition-transform hover:-translate-y-1">
                 Browse Books
               </Button>
               <Button onClick={() => router.push('/sell')} variant="outline" className="h-14 px-8 border-gray-200 bg-white text-gray-800 hover:bg-gray-50 rounded-2xl font-black text-lg transition-transform hover:-translate-y-1">
                 Sell Your Books
               </Button>
            </div>

            {/* Desktop Hero Search */}
            <div className="hidden md:flex max-w-2xl gap-3 p-2 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-indigo-100/40">
               <div className="flex-1 relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search by title, author, or ISBN..."
                   className="w-full h-14 pl-14 pr-4 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-lg outline-none"
                 />
               </div>
               <Button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] font-black text-lg shadow-md shadow-indigo-500/20">
                 Explore
               </Button>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-12 bg-white rounded-3xl p-2 border border-gray-100 shadow-xl shadow-indigo-100/40 flex items-center gap-2">
               <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search books..."
                   className="w-full h-12 pl-11 pr-4 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-base font-bold outline-none"
                 />
               </div>
               <Button 
                 onClick={() => router.push(`/search?q=${searchQuery}`)}
                 className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center p-0"
               >
                 <ArrowRight size={20} strokeWidth={3} />
               </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main id="explore" className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-20">
        
        {/* Categories Bar */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Latest Listings
            </h2>
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory">
               {heroCategories.map((cat) => {
                 const Icon = cat.icon;
                 const isActive = activeCategory === cat.id;
                 return (
                   <button
                     key={cat.id}
                     onClick={() => setActiveCategory(cat.id)}
                     className={`snap-start shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all border ${
                       isActive 
                         ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                         : "bg-white border-gray-100 text-gray-600 hover:border-indigo-100 hover:bg-gray-50"
                     }`}
                   >
                     <Icon size={16} />
                     {cat.label}
                   </button>
                 );
               })}
               <Button variant="outline" className="h-11 rounded-2xl border-gray-100 text-gray-400">
                 <Filter className="w-4 h-4" />
               </Button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                /* Skeletons */
                [...Array(10)].map((_, i) => (
                  <div key={`skel-${i}`} className="aspect-[3/4] rounded-3xl skeleton-shimmer bg-gray-100" />
                ))
              ) : books.length > 0 ? (
                books.map((book, i) => (
                  <BookCard key={book._id} book={book} index={i} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
                   <p className="text-gray-400 max-w-xs mx-auto">Try changing your filters or searching for something else.</p>
                   <Button onClick={() => setActiveCategory("all")} className="mt-8 bg-indigo-600 text-white rounded-xl px-8">
                      Show all books
                   </Button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Feature Banner */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-[40px] p-8 md:p-16 relative overflow-hidden group shadow-2xl shadow-indigo-200">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-110 duration-1000" />
             <div className="relative z-10 max-w-2xl">
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                  Ready to declutter <br /> your shelf?
                </h3>
                <p className="text-indigo-200 text-lg mb-10 font-medium">
                  Thousands of students are looking for your reference books. List in under 60 seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={() => router.push('/sell')} className="h-16 flex items-center justify-center px-10 bg-white text-indigo-900 hover:bg-indigo-50 rounded-3xl font-black text-lg transition-transform hover:scale-105">
                     Start Selling
                     <ArrowRight className="w-5 h-5 ml-2" />
                   </button>
                   <button onClick={() => router.push('/profile')} className="h-16 flex items-center justify-center px-10 bg-indigo-800/50 text-white hover:bg-indigo-800 border border-indigo-700 rounded-3xl font-black text-lg transition-transform hover:scale-105">
                     Seller Dashboard
                   </button>
                </div>
             </div>
          </div>
        </section>
      </main>
      
    </div>
  );
}
