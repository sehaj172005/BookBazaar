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
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link href={`/book/${book._id}`} className="block h-full">
        <div className="card-saas h-full flex flex-col overflow-hidden bg-white">
          
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            <Image
              src={imgError ? "/placeholder-book.png" : getImageUrl(book.images?.[0])}
              alt={book.title || "Book Cover"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onError={() => setImgError(true)}
              unoptimized
            />
            
            {/* Badges Overlay */}
            <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
               <div className="flex flex-col gap-2">
                  {book.isSold ? (
                    <span className="bg-gray-900/90 backdrop-blur-md text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">Sold</span>
                  ) : (
                    <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm border border-indigo-50">
                       {book.category || "Book"}
                    </span>
                  )}
               </div>
               
               {discount > 0 && !book.isSold && (
                 <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-xl shadow-xl shadow-indigo-100 italic">
                    -{discount}%
                 </span>
               )}
            </div>

            {/* Bottom Info Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
               <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-indigo-600 shadow-xl">
                  <ArrowRight size={18} />
               </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2">
               <span className={`w-2 h-2 rounded-full ${book.condition === "Like New" ? "bg-emerald-500" : "bg-amber-400"}`} />
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Condition: {book.condition}</span>
            </div>
            
            <h3 className="text-sm md:text-base font-black text-gray-900 leading-tight mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {book.title}
            </h3>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mb-4">By {book.author || "Global Author"}</p>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
               <div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-indigo-600 tracking-tighter">₹{book.price}</span>
                    {book.mrp && <span className="text-xs text-gray-300 line-through font-bold">₹{book.mrp}</span>}
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-[9px] font-black text-gray-400">
                     <Eye size={10} /> {book.views || 0} views
                  </div>
                  {book.seller?.verified && <SellerBadge seller={book.seller} size="icon" />}
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
