"use client";

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder, readOnly }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || "Search books like Class 12 Physics"}
        readOnly={readOnly}
        suppressHydrationWarning
        className={`w-full h-12 pl-12 pr-4 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200 ${readOnly ? "cursor-pointer" : ""}`}
      />
    </div>
  );
}
