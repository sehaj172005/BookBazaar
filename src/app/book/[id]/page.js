"use client";

import Image from "next/image";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Star, MessageCircle, Eye, MapPin, TrendingUp, Loader2, 
  Trash2, ShieldCheck, Share2, Info, ChevronRight, Book,
  Sparkles, Clock, CheckCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getBook, deleteBook, getImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import SellerBadge from "@/components/SellerBadge";
import ConnectModal from "@/components/ConnectModal";

export default function BookDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConnect, setShowConnect] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await getBook(id);
      setBook(res.data);
    } catch (err) {
      toast.error("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await deleteBook(book._id);
      toast.success("Listing removed");
      router.replace("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">Link copied!</p>
            <p className="text-xs text-gray-400 font-medium">Share it with a classmate 📤</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const isOwner = user && book && user._id === book.seller?._id;

  if (loading || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-400 mt-4 font-medium">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfe] pb-32 md:pb-12">
      {/* Mobile Header (Sticky) */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="flex items-center gap-1">
          <button onClick={handleShare} className="p-2">
            {copied ? <CheckCheck className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-8 md:pt-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Content */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-8">
             
             {/* Title & Author on Desktop */}
             <div className="hidden md:block">
               <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-2">
                 {book.title}
               </h1>
               <p className="text-xl text-gray-400 font-medium tracking-tight">by {book.author || "Unknown Author"}</p>
             </div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="relative w-full h-[350px] md:h-[500px] bg-slate-50 md:rounded-[40px] overflow-hidden shadow-inner border border-gray-100 flex items-center justify-center p-8"
             >
                <Image 
                  src={getImageUrl(book.images?.[0])}
                  alt={book.title || "Book Cover"} 
                  fill
                  className="object-contain scale-90"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  priority
                />
                {book.isSold && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center">
                     <span className="bg-white text-gray-900 px-8 py-3 rounded-full font-black text-xl shadow-2xl tracking-widest uppercase">SOLD</span>
                  </div>
                )}
                <div className="md:hidden absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                   <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                     <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                     <span className="text-[10px] font-black uppercase text-indigo-900 tracking-tight">high demand</span>
                   </div>
                </div>
             </motion.div>

             {/* Book Description Area */}
             <div className="px-5 md:px-0 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {[
                     { label: "Condition", val: book.condition, icon: Sparkles, color: "text-amber-500 bg-amber-50" },
                     { label: "Category", val: book.category, icon: Book, color: "text-indigo-500 bg-indigo-50" },
                     { label: "Views", val: book.views || 0, icon: Eye, color: "text-emerald-500 bg-emerald-50" },
                     { label: "Listed", val: "2 days ago", icon: Clock, color: "text-blue-500 bg-blue-50" },
                   ].map((item) => (
                     <div key={item.label} className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm transition-transform hover:scale-105">
                        <item.icon className={`w-5 h-5 mb-2 ${item.color.split(' ')[0]}`} />
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-0.5">{item.label}</p>
                        <p className="text-sm font-black text-gray-900 truncate">{item.val}</p>
                     </div>
                   ))}
                </div>

                <div className="space-y-4 bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                     <Info className="w-5 h-5 text-indigo-600" />
                     Product Description
                   </h3>
                   <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                     {book.description || "No description provided for this book. Please contact the seller for more details."}
                   </p>
                </div>
             </div>
          </div>

          {/* Right Column: Sticky Action Card */}
          <div className="w-full md:w-[380px] lg:w-[420px] px-5 md:px-0">
             <div className="md:sticky md:top-28 space-y-6">
                
                {/* Price Card */}
                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                   <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Asking Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black text-indigo-600 tracking-tighter">₹{book.price}</span>
                          {book.mrp && (
                            <span className="text-lg text-gray-300 line-through font-bold">₹{book.mrp}</span>
                          )}
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                         <div className="relative">
                            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-900 -mt-0.5">TOP</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      {!isOwner && (
                        <Button 
                          onClick={() => setShowConnect(true)}
                          className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-indigo-200 transition-all hover:translate-y-[-2px]"
                        >
                          <MessageCircle className="w-6 h-6 mr-3" />
                          Chat with Seller
                        </Button>
                      )}
                      
                      {isOwner && (
                         <Button 
                           variant="outline"
                           onClick={handleDelete}
                           disabled={deleting}
                           className="w-full h-16 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl text-lg font-black"
                         >
                           {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5 mr-3" />}
                           Take Down Listing
                         </Button>
                      )}

                       <div className="flex gap-2">
                          <Button
                            onClick={handleShare}
                            variant="outline"
                            className={`w-full h-16 rounded-2xl font-black transition-colors ${
                              copied
                                ? "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-50"
                                : "border-gray-100 text-gray-600 hover:border-indigo-100"
                            }`}
                          >
                            {copied ? (
                              <><CheckCheck className="w-5 h-5 mr-2" /> Copied!</>
                            ) : (
                              <><Share2 className="w-5 h-5 mr-2" /> Share Link</>
                            )}
                          </Button>
                       </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="text-[11px] font-bold text-gray-500 leading-tight">
                        Payments are handled offline directly between students. Be safe and meet in campus zones.
                      </p>
                   </div>
                </div>

                {/* Seller Card */}
                <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-lg shadow-indigo-100">
                         <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center text-xl font-black text-indigo-600 uppercase">
                            {book.seller?.avatar || book.seller?.name?.charAt(0)}
                         </div>
                      </div>
                      <div className="flex-1">
                         <h4 className="text-lg font-black text-gray-900 tracking-tight">{book.seller?.name}</h4>
                         <div className="flex items-center gap-1.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-gray-700">{book.seller?.rating || "0.0"}</span>
                            <span className="text-gray-300 mx-0.5">•</span>
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{book.seller?.badge || "Verified Seller"}</span>
                         </div>
                      </div>
                      <button onClick={() => router.push(`/profile/${book.seller?._id}`)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group hover:bg-indigo-50 transition-colors">
                         <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2">
                       <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Completed Deals</p>
                          <p className="text-sm font-black text-indigo-900">{book.seller?.completedDeals || 0}</p>
                       </div>
                       <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                          <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Books Listed</p>
                          <p className="text-sm font-black text-indigo-900">{book.seller?.booksListed || 0}</p>
                       </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <ConnectModal book={book} isOpen={showConnect} onClose={() => setShowConnect(false)} />

      {/* Mobile Sticky CTA */}
      {!isOwner && !book.isSold && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between gap-4">
           <div className="flex-1">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
             <p className="text-xl font-black text-indigo-600">₹{book.price}</p>
           </div>
           <Button 
             onClick={() => setShowConnect(true)}
             className="flex-[2] h-14 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100"
           >
             Chat with Seller
           </Button>
        </div>
      )}
    </div>
  );
}
