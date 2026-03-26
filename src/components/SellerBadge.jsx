"use client";

import { ShieldCheck, Award, Crown } from "lucide-react";

export default function SellerBadge({ seller, size = "default" }) {
  if (!seller) return null;

  const badgeConfig = {
    "Top Seller": {
      icon: <Crown className={size === "small" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
      bg: "bg-gradient-to-r from-amber-400 to-orange-500",
      text: "text-white",
      label: "Top Seller 🏆",
    },
    Verified: {
      icon: <ShieldCheck className={size === "small" ? "w-3 h-3" : "w-3.5 h-3.5"} />,
      bg: "bg-gradient-to-r from-emerald-500 to-teal-600",
      text: "text-white",
      label: "Verified ✅",
    },
  };

  const badge = seller.badge ? badgeConfig[seller.badge] : null;

  if (size === "icon" && seller.verified) {
    return (
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center" title="Verified Seller">
        <ShieldCheck className="w-2.5 h-2.5 text-white" />
      </div>
    );
  }

  if (!badge) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text} shadow-sm`}
    >
      {badge.icon}
      {size !== "small" && badge.label}
    </span>
  );
}
