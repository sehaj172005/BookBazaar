"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      // toast is handled in context usually, or we can add it here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-hero-gradient px-6 py-20 overflow-hidden">
      {/* Mesh Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/50 rounded-full blur-[120px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-[100px] -ml-20 -mb-20" />
      
      <div className="w-full max-w-xl relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
        
        {/* Left Side: Brand Story (Visible on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col justify-center text-gray-900">
           <div className="w-14 h-14 rounded-2xl bg-white backdrop-blur-xl border border-gray-100 flex items-center justify-center mb-10 shadow-xl">
              <Sparkles className="w-8 h-8 text-indigo-600" />
           </div>
           <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-6">
             Your Campus, <br />
             <span className="text-indigo-600">Marketplace.</span>
           </h1>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                    <ShieldCheck size={20} className="text-indigo-600" />
                 </div>
                 <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Verified Students Only</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                    <Zap size={20} className="text-amber-500" />
                 </div>
                 <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Instant Negotiating</p>
              </div>
           </div>
        </div>

        {/* Right Side: Auth Card */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100"
        >
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">
              {isLogin ? "Welcome Back" : "Crete Account"}
            </h2>
            <p className="text-gray-400 mt-1.5 font-medium">
              {isLogin ? "Sign in to manage your listings" : "Start your selling journey today"}
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-1.5 flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                isLogin ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                !isLogin ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"
              }`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="reg-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sehajdeep Singh"
                      className="w-full h-15 pl-12 pr-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">University Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="student@university.edu"
                  className="w-full h-15 pl-12 pr-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-15 pl-12 pr-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-bold shadow-inner"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-lg font-black shadow-2xl shadow-indigo-100 mt-4 transition-all hover:translate-y-[-2px] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <>
                  {isLogin ? "Sign In to Bazaar" : "Start your Journey"}
                  <ArrowRight className="w-5 h-5 ml-3" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 text-center">
             <p className="text-xs font-bold text-gray-300">
               By continuing, you agree to our <span className="text-indigo-400">Terms</span> and <span className="text-indigo-400">Community Policy</span>.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
