"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Send, MessageCircle, Package, Eye, Users, MapPin, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getBundleById } from "@/lib/data";
import { toast } from "sonner";
import SellerBadge from "@/components/SellerBadge";

export default function BundleDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const bundle = getBundleById(id);

  if (!bundle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <p className="text-gray-500">Bundle not found</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4 rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  const savingsPercent = Math.round((bundle.savings / bundle.totalMrp) * 100);

  const handleSendRequest = () => {
    toast.success("Bundle request sent!", {
      description: `Your request for "${bundle.title}" has been sent to ${bundle.seller.name}.`,
    });
  };

  return (
    <div className="pb-28">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-4 pt-[env(safe-area-inset-top,12px)]">
        <button onClick={() => router.back()} className="mt-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </motion.div>

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="relative w-full bg-gradient-to-br from-indigo-100 via-violet-50 to-indigo-50 pt-20 pb-8 px-5">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-300/40">
            <Package className="w-3.5 h-3.5" /> Best Value 📦
          </span>
          {bundle.demand === "high" && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white">🔥 High Demand</span>
          )}
          {bundle.seller?.badge && <SellerBadge seller={bundle.seller} size="default" />}
        </div>

        <div className="flex items-end justify-center py-4 relative">
          {bundle.books.slice(0, 4).map((book, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20, rotate: 0 }} animate={{ opacity: 1, y: 0, rotate: (i - 1.5) * 6 }} transition={{ duration: 0.5, delay: i * 0.1 }} className="w-20 h-28 rounded-xl overflow-hidden shadow-xl border-2 border-white" style={{ marginLeft: i > 0 ? "-16px" : 0, zIndex: 4 - i }}>
              <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="px-5 -mt-2 relative">
        <h1 className="text-xl font-bold text-gray-900 leading-tight mt-4">{bundle.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{bundle.books.length} books • {bundle.condition}</p>

        {/* 📊 Social Proof Bar */}
        <div className="mt-3 flex items-center gap-4 py-2.5 px-3.5 bg-orange-50/60 rounded-xl border border-orange-100/50">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700">{bundle.views} views</span>
          </div>
          <div className="w-px h-4 bg-orange-200" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-semibold text-orange-700">{bundle.requests} requests</span>
          </div>
          {bundle.demand === "high" && (
            <>
              <div className="w-px h-4 bg-orange-200" />
              <span className="text-[10px] font-bold text-orange-600 animate-pulse">Selling fast!</span>
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-4 border border-emerald-200/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gradient">₹{bundle.totalPrice}</span>
                <span className="text-base text-gray-400 line-through">₹{bundle.totalMrp}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Total for {bundle.books.length} books</p>
            </div>
            <div className="text-center bg-emerald-600 text-white px-4 py-2 rounded-xl">
              <p className="text-lg font-extrabold">Save ₹{bundle.savings}</p>
              <p className="text-[10px] font-medium opacity-80">{savingsPercent}% off</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">About this bundle</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{bundle.description}</p>
        </div>

        {/* Books Included */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Books Included ({bundle.books.length})</h3>
          <div className="space-y-2">
            {bundle.books.map((book, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="flex items-center gap-3 p-3 bg-white rounded-xl card-premium">
                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{book.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{book.subject}</p>
                </div>
                <span className="text-xs text-gray-300 line-through">₹{book.mrp}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🛡️ Enhanced Seller Card */}
        <div className="mt-5 bg-white rounded-2xl border border-gray-100 p-4 card-premium">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              {bundle.seller.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-semibold text-gray-900">{bundle.seller.name}</p>
                {bundle.seller.badge && <SellerBadge seller={bundle.seller} size="small" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-gray-700">{bundle.seller.rating}</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{bundle.seller.completedDeals} deals</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-[11px] text-gray-500">Responds {bundle.seller.responseTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-gray-400" />
              <span className="text-[11px] text-gray-500">{bundle.seller.booksListed} listed</span>
            </div>
          </div>
        </div>

        {/* 📍 Location */}
        {bundle.location && (
          <div className="mt-4 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Meetup Location</h3>
            </div>
            <p className="text-sm font-medium text-gray-900">{bundle.location}</p>
            <p className="text-xs text-gray-500 mt-0.5">{bundle.distance} km from you</p>
            <div className="mt-2 px-3 py-2 bg-white/80 rounded-lg border border-emerald-200/50">
              <p className="text-[11px] text-emerald-700 font-medium">
                💡 Suggested: Meet near campus gate or metro station for safe exchange
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-xl border-t border-gray-100 px-5 py-3 pb-[calc(env(safe-area-inset-bottom,8px)+12px)] z-40">
        <div className="flex gap-3">
          <Button onClick={handleSendRequest} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-200 btn-glow">
            <Send className="w-4 h-4 mr-2" />
            Send Request
          </Button>
          <Button variant="outline" className="h-12 px-5 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50" onClick={() => { toast.info("Opening chat..."); router.push("/chat"); }}>
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
