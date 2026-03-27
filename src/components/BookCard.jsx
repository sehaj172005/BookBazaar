"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Eye, TrendingUp } from "lucide-react";
import SellerBadge from "@/components/SellerBadge";
import { getImageUrl } from "@/lib/api";

export default function BookCard({ book, index = 0 }) {
  const [imgError, setImgError] = useState(false);

  const discount = book.mrp && book.price
    ? Math.round(((book.mrp - book.price) / book.mrp) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={`/book/${book._id}`} className="block h-full">
        <div className="card-premium h-full flex flex-col overflow-hidden bg-white group-hover:bg-indigo-50/5 transition-colors">
          
          {/* Image Container */}
          <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-50 border-b border-slate-100">
            <Image
              src={imgError ? "/placeholder-book.png" : getImageUrl(book.images?.[0])}
              alt={book.title || "Book Cover"}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImgError(true)}
              unoptimized
            />
            
            {/* Badges Overlay */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-start pointer-events-none">
               <div className="flex flex-col gap-2">
                  {book.isSold ? (
                    <span className="bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Sold</span>
                  ) : (
                    <span className="bg-white/80 backdrop-blur-md text-indigo-600 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-white/40">
                       {book.category || "Book"}
                    </span>
                  )}
               </div>
               
               {discount > 0 && !book.isSold && (
                 <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-xl shadow-indigo-200">
                    -{discount}%
                 </span>
               )}
            </div>

            {/* Price Hover Preview */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
               <div className="glass-premium rounded-2xl p-3 flex items-center justify-between shadow-lg">
                  <span className="text-sm font-black text-slate-900">₹{book.price}</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                     <ArrowRight size={14} />
                  </div>
               </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
               <div className="flex items-center gap-1 text-slate-400">
                  <Eye size={12} />
                  <span className="text-[10px] font-bold">{book.views || 0}</span>
               </div>
               <div className="w-1 h-1 bg-slate-200 rounded-full" />
               <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                 book.condition === "Like New" 
                   ? "bg-emerald-50 text-emerald-600" 
                   : "bg-amber-50 text-amber-600"
               }`}>
                 {book.condition}
               </span>
            </div>
            
            <h3 className="text-base font-black text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors tracking-tight">
              {book.title}
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mb-6">By {book.author || "Global Author"}</p>

            <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
               <div className="flex items-baseline gap-2">
                 <span className="text-2xl font-black text-indigo-600 tracking-tighter">₹{book.price}</span>
                 {book.mrp && <span className="text-sm text-slate-300 line-through font-bold">₹{book.mrp}</span>}
               </div>
               
               {book.seller?.verified && (
                 <div className="transition-transform group-hover:scale-110">
                    <SellerBadge seller={book.seller} size="icon" />
                 </div>
               )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
