"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, PlusCircle, MessageCircle, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const tabs = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "sell", label: "Sell", icon: PlusCircle, href: "/sell" },
  { id: "chat", label: "Chat", icon: MessageCircle, href: "/chat" },
  { id: "profile", label: "Profile", icon: UserIcon, href: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/sell")) return "sell";
    if (pathname.startsWith("/chat")) return "chat";
    if (pathname.startsWith("/profile")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab) => {
    if (tab.id !== "home" && !user) {
      toast.error("Please login to continue");
      router.push("/auth");
      return;
    }
    router.push(tab.href);
  };

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-[100] md:hidden px-4 pointer-events-none">
      <div className="max-w-[400px] mx-auto pointer-events-auto">

        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[32px] overflow-hidden">
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center py-2 px-4 relative flex-1"
              >
                <motion.div
                  className="flex flex-col items-center gap-0.5"
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className={`relative p-1 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-50" : ""}`}>
                    <Icon
                      size={20}
                      className={`transition-all duration-200 ${
                        isActive ? "text-indigo-600" : "text-gray-400"
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold transition-colors duration-200 ${
                      isActive ? "text-indigo-600" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                </motion.div>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    </nav>
  );
}
