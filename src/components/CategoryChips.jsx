"use client";

import { motion } from "framer-motion";

export default function CategoryChips({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <motion.button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            whileTap={{ scale: 0.92 }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "bg-white text-gray-600 border border-gray-150 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </motion.button>
        );
      })}
    </div>
  );
}
