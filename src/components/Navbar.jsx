"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, PlusCircle, MessageCircle, User as UserIcon, Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  // Hide global navbar on book detail page on mobile (as it has its own header)
  const isMobileBookDetail = pathname?.startsWith("/book/") && typeof window !== "undefined" && window.innerWidth < 768;
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isMobileBookDetail) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-2 shadow-sm" : "bg-white/80 backdrop-blur-md border-b border-gray-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tighter">B!</span>
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors text-gray-900`}>
            Book<span className="text-indigo-600">Bazaar</span>
          </span>
        </Link>

        {/* Desktop Search (Centered) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
             <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
             <input
               type="text"
               placeholder="Search by title, author, or ISBN..."
               className={`w-full h-11 pl-11 pr-4 rounded-2xl text-sm font-medium transition-all outline-none border focus:ring-4 bg-gray-50 border-gray-100 focus:bg-white focus:border-indigo-100 focus:ring-indigo-500/5 text-gray-900 placeholder:text-gray-400`}
             />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/chat" className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
                <div className="relative">
                  <MessageCircle className="w-5 h-5 group-hover:fill-indigo-50" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                </div>
                <span>Messages</span>
              </Link>
              <Link href="/profile">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200 ring-2 ring-white ring-offset-2 ring-offset-transparent">
                  {user.avatar || user.name.charAt(0)}
                </div>
              </Link>
              <Button
                onClick={() => router.push("/sell")}
                className="ml-2 h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 shadow-opacity-40 transition-all hover:translate-y-[-2px] active:translate-y-0"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Sell Now
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => router.push("/auth")}
              className={`h-11 px-6 rounded-2xl font-bold transition-all bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700`}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-4">
           {user && (
             <Link href="/chat" className="relative p-1">
                <MessageCircle className={`w-6 h-6 text-gray-800`} />
               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
             </Link>
           )}
           <button 
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             className={`p-1 text-gray-800`}
           >
             {mobileMenuOpen ? <X /> : <Menu />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-6 space-y-4 text-gray-900"
          >
            <Link href="/" className="block text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
              Browse Books
            </Link>
            {!user ? (
               <Button onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }} className="w-full h-12 rounded-2xl bg-indigo-600 text-white font-bold mt-4">
                 Get Started
               </Button>
            ) : (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
                <Link href="/profile" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                     {user.name.charAt(0)}
                   </div>
                   <span className="font-bold">My Dashboard</span>
                </Link>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full h-12 rounded-2xl text-red-500 border-red-50">
                   Logout
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
