"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Flame } from "lucide-react";

export default function BundleCard({ bundle, index = 0 }) {
  const savingsPercent = Math.round((bundle.savings / bundle.totalMrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.97 }}
      className="flex-shrink-0 w-[300px]"
    >
      <Link href={`/bundle/${bundle.id}`} className="block">
        <div className="bg-white rounded-[20px] overflow-hidden card-premium border border-indigo-100/50">
          {/* Stacked images preview */}
          <div className="relative h-36 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
            {/* Best Value badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-300/40">
                <Package className="w-3 h-3" />
                Best Value 📦
              </span>
            </div>

            {/* Demand badge */}
            {bundle.demand === "high" && (
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md">
                  🔥 Hot
                </span>
              </div>
            )}

            {/* Stacked book images */}
            <div className="flex items-end justify-center h-full relative">
              {bundle.books.slice(0, 3).map((book, i) => (
                <div
                  key={i}
                  className="w-16 h-24 rounded-lg overflow-hidden shadow-lg border-2 border-white"
                  style={{
                    transform: `translateX(${(i - 1) * -12}px) rotate(${(i - 1) * 5}deg)`,
                    zIndex: 3 - i,
                  }}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {bundle.books.length > 3 && (
                <div
                  className="w-16 h-24 rounded-lg bg-indigo-100 border-2 border-white shadow-lg flex items-center justify-center"
                  style={{ transform: "translateX(-36px) rotate(10deg)", zIndex: 0 }}
                >
                  <span className="text-xs font-bold text-indigo-600">
                    +{bundle.books.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {bundle.title}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              {bundle.books.length} books included
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-gradient">₹{bundle.totalPrice}</span>
                  <span className="text-xs text-gray-300 line-through font-medium">₹{bundle.totalMrp}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Save ₹{bundle.savings}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
