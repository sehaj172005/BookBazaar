"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  icon: Icon = BookOpen,
  title = "Nothing here yet",
  message = "Start by posting a book!",
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center"
    >
      <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center mb-6 shadow-sm border border-indigo-100/20">
        <Icon className="w-10 h-10 text-indigo-500" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-400 max-w-[280px] font-medium leading-relaxed">{message}</p>
      {actionLabel && (
        <Button
          onClick={onAction}
          className="mt-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 font-bold shadow-xl shadow-indigo-100 transition-all hover:translate-y-[-2px]"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
