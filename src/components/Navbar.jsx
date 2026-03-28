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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-premium py-2" : "bg-white/40 backdrop-blur-md border-b border-white/20 py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>

          <span className="text-3xl font-black tracking-tighter text-slate-900">
            Re<span className="text-gradient">bound</span>
          </span>
        </Link>

        {/* Desktop Search (Centered - Premium Glass) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-12">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search textbooks..."
              suppressHydrationWarning
              className="w-full h-12 pl-12 pr-6 rounded-full text-sm font-bold transition-all outline-none border border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-100 focus:ring-8 focus:ring-indigo-500/5 text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/chat" className="relative p-2.5 rounded-2xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all group">
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
              </Link>

              <Link href="/profile" className="flex items-center gap-3 pl-2 border-l border-slate-100 group">
                <div className="w-11 h-11 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white rounded-[1.1rem] flex items-center justify-center font-black text-indigo-600 text-sm">
                    {user.avatar || user.name.charAt(0)}
                  </div>
                </div>
              </Link>

              <Button
                onClick={() => router.push("/sell")}
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/10 hover:scale-105 transition-all"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Sell Now
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/auth")}
                className="h-12 px-6 rounded-2xl font-black text-slate-600 hover:text-indigo-600"
              >
                Log In
              </Button>
              <Button
                onClick={() => router.push("/auth")}
                className="h-12 px-8 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl shadow-slate-200 transition-all hover:scale-105"
              >
                Join Now
              </Button>
            </div>
          )}
        </div>

        {/* Mobile items */}
        <div className="md:hidden flex items-center gap-5">
          {user && (
            <Link href="/chat" className="relative p-1">
              <MessageCircle className="w-7 h-7 text-slate-900" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-[calc(100%+10px)] left-4 right-4 glass-premium rounded-[2.5rem] p-8 space-y-6 shadow-2xl z-[100]"
          >
            <div className="space-y-4">
              <Link href="/" className="block text-2xl font-black text-slate-900 tracking-tight" onClick={() => setMobileMenuOpen(false)}>
                Marketplace
              </Link>
              <Link href="/chat" className="block text-xl font-bold text-slate-500" onClick={() => setMobileMenuOpen(false)}>
                Messages
              </Link>
              <Link href="/profile" className="block text-xl font-bold text-slate-500" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>
            </div>

            {!user ? (
              <Button onClick={() => { router.push("/auth"); setMobileMenuOpen(false); }} className="w-full h-16 rounded-[1.5rem] bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-100">
                Get Started
              </Button>
            ) : (
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <Button onClick={() => { router.push("/sell"); setMobileMenuOpen(false); }} className="w-full h-16 rounded-[1.5rem] bg-indigo-600 text-white font-black text-lg">
                  List a Book
                </Button>
                <Button onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full h-14 rounded-[1.25rem] text-red-500 border-red-50 font-bold">
                  Sign Out
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
