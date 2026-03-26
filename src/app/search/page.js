"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, X, Package, Users, Wand2, Sparkles } from "lucide-react";
import BookCard from "@/components/BookCard";
import BundleCard from "@/components/BundleCard";
import { searchBooks, searchBundles, alsoLookingFor as mockAlsoLookingFor } from "@/lib/data";
import { aiSearch } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [books, setBooks] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState({ correctedQuery: "", suggestions: [], categories: [] });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    condition: "all",
    demand: "all",
    maxPrice: 2000,
  });

  useEffect(() => {
    const performSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await aiSearch(query);
        const { books: allBooks, correctedQuery, suggestions, categories } = res.data;
        
        setAiData({ correctedQuery, suggestions, categories });
        
        // Split into books and bundles for UI
        setBooks(allBooks.filter(b => !b.isBundle));
        setBundles(allBooks.filter(b => b.isBundle));
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback to local search
        setBooks(searchBooks(query));
        setBundles(searchBundles(query));
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const filteredBooks = books.filter((book) => {
    if (filters.condition !== "all" && book.condition !== filters.condition) return false;
    if (filters.demand !== "all" && book.demand !== filters.demand) return false;
    if (book.price > filters.maxPrice) return false;
    return true;
  });

  const totalResults = filteredBooks.length + bundles.length;

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="px-4 pt-[env(safe-area-inset-top,12px)] pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 pt-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
            <ArrowLeft className="w-4.5 h-4.5 text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900 truncate">"{query}"</p>
            <p className="text-[11px] text-gray-400 font-medium">{totalResults} results found</p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              showFilters ? "bg-indigo-100 text-indigo-600" : "bg-gray-50 text-gray-600"
            }`}
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 border-b border-gray-50 bg-gray-50/50"
        >
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Condition</p>
            <div className="flex gap-1.5">
              {["all", "Like New", "Good", "Poor"].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, condition: c })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.condition === c
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {c === "all" ? "All" : c}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Demand</p>
            <div className="flex gap-1.5">
              {["all", "high", "medium", "low"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilters({ ...filters, demand: d })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filters.demand === d
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  {d === "all" ? "All" : d === "high" ? "🔥 High" : d === "medium" ? "📈 Medium" : "⚠️ Low"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Max Price: ₹{filters.maxPrice}</p>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
              className="w-full accent-indigo-600"
            />
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="px-5 pt-8 space-y-8">
           <div className="flex gap-4 overflow-hidden">
              <div className="w-64 h-40 bg-gray-100 animate-pulse rounded-3xl shrink-0" />
              <div className="w-64 h-40 bg-gray-100 animate-pulse rounded-3xl shrink-0" />
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(n => <div key={n} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-3xl" />)}
           </div>
        </div>
      )}

      {!loading && (
        <div className="px-5 pt-4">
          {/* AI "Did you mean" */}
          {aiData.correctedQuery && aiData.correctedQuery.toLowerCase() !== query.toLowerCase() && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                 <Wand2 size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500">Auto-correction</p>
                <p className="text-sm font-medium text-gray-900">
                  Showing results for <button onClick={() => router.push(`/search?q=${aiData.correctedQuery}`)} className="text-indigo-600 font-black hover:underline italic">"{aiData.correctedQuery}"</button>
                </p>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {aiData.suggestions.length > 0 && (
             <div className="mb-6 flex flex-wrap gap-2">
                {aiData.suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => router.push(`/search?q=${s}`)}
                    className="px-4 py-2 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-700 shadow-sm hover:border-indigo-100 hover:text-indigo-600 transition-all"
                  >
                    🔍 {s}
                  </button>
                ))}
             </div>
          )}
        {/* Bundles Section */}
        {bundles.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900">Bundles (Best Value 📦)</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {bundles.map((bundle, i) => (
                <BundleCard key={bundle._id} bundle={{ ...bundle, id: bundle._id }} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Top Matches */}
        {filteredBooks.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2.5">Top Matches</h2>
            <div className="grid grid-cols-2 gap-3.5">
              {filteredBooks.map((book, i) => (
                <BookCard key={book._id} book={book} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Also Looking For */}
        {(totalResults > 0 || aiData.suggestions.length > 0) && (
          <>
            <div className="section-divider my-5" />
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2.5">
                <Users className="w-4 h-4 text-violet-500" />
                <h2 className="text-sm font-bold text-gray-900">Buyers also looking for</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(aiData.suggestions.length > 0 ? aiData.suggestions : mockAlsoLookingFor.map(m => m.text)).map((text, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(text)}`)}
                    className="px-3 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-xs text-violet-700 font-medium transition-all border border-violet-100"
                  >
                    {text}
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {totalResults === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-4xl mb-3">😕</div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No exact match found</h3>
            <p className="text-sm text-gray-400 mb-5">Try different keywords or browse categories</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["JEE", "NEET", "Class 12", "Physics"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => router.push(`/search?q=${tag}`)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 text-sm text-indigo-600 font-medium border border-indigo-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )}
  </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
