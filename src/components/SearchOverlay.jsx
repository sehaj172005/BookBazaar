"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp, BookOpen, Tag, ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { popularSearches, getSuggestions } from "@/lib/data";
import { aiSearch } from "@/lib/api";

export default function SearchOverlay({ isOpen, onClose, initialQuery = "" }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    "HC Verma Physics",
    "Class 12 books",
  ]);

  // AI states
  const [aiResult, setAiResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim()) {
      setSuggestions(getSuggestions(query));
      
      // Debounced AI Search
      const timeoutId = setTimeout(async () => {
        if (query.length > 2) {
          setIsAiLoading(true);
          try {
            const res = await aiSearch(query);
            setAiResult(res.data);
          } catch (err) {
            console.error("AI Search failed:", err);
          } finally {
            setIsAiLoading(false);
          }
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setAiResult(null);
    }
  }, [query]);

  const handleSearch = (searchText) => {
    const text = searchText || query;
    if (!text.trim()) return;

    // Add to recent
    setRecentSearches((prev) => {
      const updated = [text, ...prev.filter((s) => s !== text)].slice(0, 5);
      return updated;
    });

    onClose();
    router.push(`/search?q=${encodeURIComponent(text)}`);
  };

  const getIcon = (type) => {
    if (type === "book") return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
    if (type === "category") return <Tag className="w-3.5 h-3.5 text-violet-500" />;
    return <TrendingUp className="w-3.5 h-3.5 text-orange-500" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-white"
        >
          <div className="max-w-[430px] mx-auto min-h-screen">
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 pt-[env(safe-area-inset-top,12px)] pb-3 border-b border-gray-100">
              <div className="flex-1 flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 h-11">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  suppressHydrationWarning
                  placeholder="Search books, bundles, categories..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="p-0.5">
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                )}
              </div>
              <button onClick={onClose} className="text-sm font-medium text-indigo-600">
                Cancel
              </button>
            </div>

            <div className="px-4 pt-4 pb-20 overflow-y-auto" style={{ maxHeight: "calc(100vh - 60px)" }}>
              {/* AI "Did you mean" */}
              {aiResult?.correctedQuery && aiResult.correctedQuery.toLowerCase() !== query.toLowerCase() && (
                <div className="mb-4 px-2 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-3">
                  <Wand2 className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm text-gray-600">
                    Did you mean <button 
                      onClick={() => {
                        setQuery(aiResult.correctedQuery);
                        handleSearch(aiResult.correctedQuery);
                      }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      "{aiResult.correctedQuery}"
                    </button>?
                  </p>
                </div>
              )}

              {/* AI Smart Suggestions */}
              {aiResult?.suggestions?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      AI Suggested for you
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(s)}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-100 text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommended Categories */}
              {aiResult?.categories?.length > 0 && (
                <div className="mb-6">
                   <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1 truncate">
                    Related Categories
                  </h3>
                  <div className="flex gap-2">
                    {aiResult.categories.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(cat)}
                        className="px-4 py-2 rounded-xl bg-gray-50 border border-transparent hover:border-indigo-200 text-xs font-black text-gray-900 flex items-center gap-2"
                      >
                        <Tag className="w-3 h-3 text-indigo-500" />
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-0.5">
                    {suggestions.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleSearch(s.text)}
                        className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        {getIcon(s.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-medium truncate">{s.text}</p>
                          {s.category && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{s.type === "category" ? "Category" : `in ${s.category}`}</p>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                    Recent
                  </h3>
                  <div className="space-y-0.5">
                    {recentSearches.map((text, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearch(text)}
                        className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 flex-1">{text}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!query && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5 px-1">
                    Popular
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((text, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => handleSearch(text)}
                        className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-indigo-50 text-sm text-gray-700 hover:text-indigo-700 font-medium transition-all border border-gray-100 hover:border-indigo-200"
                      >
                        {text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
