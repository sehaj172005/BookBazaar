"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, IndianRupee, MessageCircle, Loader2 } from "lucide-react";
import { sendRequest, sendMessage, getImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ConnectModal({ book, isOpen, onClose }) {
  const { user } = useAuth();
  const router = useRouter();
  const [offerPrice, setOfferPrice] = useState(book?.price || "");
  const [sending, setSending] = useState(false);

  const defaultMessage = `Hi! I'm interested in your book "${book?.title}". Would you consider selling it for ₹${offerPrice || book?.price}? Let me know. Thanks!`;
  const [message, setMessage] = useState(defaultMessage);

  // Sync message when price changes
  const handlePriceChange = (val) => {
    setOfferPrice(val);
    setMessage(
      `Hi! I'm interested in your book "${book?.title}". Would you consider selling it for ₹${val || book?.price}? Let me know. Thanks!`
    );
  };

  const handleConnect = async () => {
    if (!user) {
      toast.error("Please login first");
      router.push("/auth");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message");
      return;
    }

    try {
      setSending(true);

      // 1. Send the request
      let requestData;
      try {
        const res = await sendRequest(book._id);
        requestData = res.data;
      } catch (err) {
        // If duplicate request exists, the API returns the existing one
        const existing = err.response?.data?.request;
        if (existing) {
          requestData = existing;
        } else {
          throw err;
        }
      }

      // 2. Send initial message
      await sendMessage(requestData._id, message.trim());

      toast.success("Message sent to seller! 📬");
      onClose();
      router.push(`/chat?requestId=${requestData._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to connect with seller");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-[28px] z-50 pb-[env(safe-area-inset-bottom,20px)]"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-extrabold text-gray-900">Connect with Seller</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Book Info */}
            <div className="mx-5 flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-5">
              <div className="w-12 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <Image
                  src={getImageUrl(book?.images?.[0])}
                  alt={book?.title || "Book"}
                  fill
                  className="object-cover"
                  sizes="48px"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{book?.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{book?.seller?.name}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-extrabold text-indigo-600">₹{book?.price}</span>
                  {book?.mrp && (
                    <span className="text-xs text-gray-400 line-through">₹{book?.mrp}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-5 space-y-4">
              {/* Offer Price */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                  Your Offer Price (optional)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder={String(book?.price)}
                    className="w-full h-12 pl-9 pr-4 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Seller's asking price: ₹{book?.price}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none leading-relaxed"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  You can edit this message before sending.
                </p>
              </div>

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConnect}
                disabled={sending || !message.trim()}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-200/50 disabled:opacity-50 mb-2"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message &amp; Connect
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
