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
    <div className="min-h-screen relative flex items-center justify-center bg-mesh px-6 py-20 overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px] animate-pulse" />
      
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Impactful Branding */}
        <motion.div 
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="hidden lg:flex flex-col justify-center text-gray-900 pr-12"
        >
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/20 text-indigo-600 text-xs font-black tracking-widest uppercase mb-12 shadow-sm w-fit">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sustainable Campus Trading</span>
           </div>
           
           <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-slate-900">
             Student<br />
             <span className="text-gradient">Marketplace.</span>
           </h1>
           
           <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed max-w-md">
             Join thousands of students buying and selling textbooks with verified peers securely.
           </p>

           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-[2rem] bg-white/40 border border-white/60 shadow-sm transition-transform hover:scale-105">
                 <ShieldCheck size={32} className="text-indigo-600 mb-4" />
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Zero Frauds</p>
                 <p className="text-xs font-medium text-slate-400 mt-1">University Verified</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/40 border border-white/60 shadow-sm transition-transform hover:scale-105">
                 <Zap size={32} className="text-amber-500 mb-4" />
                 <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Fast Deals</p>
                 <p className="text-xs font-medium text-slate-400 mt-1">Instant Chat</p>
              </div>
           </div>
        </motion.div>

        {/* Right Side: Glassmorphism Auth Card */}
        <div className="flex justify-center lg:justify-end">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="w-full max-w-md glass-premium rounded-[3rem] p-8 md:p-12 relative overflow-hidden"
          >
            {/* Glossy Overlay */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                {isLogin ? "Welcome Back" : "Join the Loop"}
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                {isLogin ? "Sign in to access your dashboard" : "Create your student account today"}
              </p>
            </div>

            <div className="bg-slate-900/5 backdrop-blur-md rounded-[20px] p-1.5 flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${
                  isLogin ? "bg-white text-indigo-600 shadow-xl shadow-indigo-500/10" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3.5 text-xs font-black uppercase tracking-widest rounded-[14px] transition-all duration-300 ${
                  !isLogin ? "bg-white text-indigo-600 shadow-xl shadow-indigo-500/10" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    key="reg-field"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Full Campus Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full h-16 pl-14 pr-6 bg-white/50 border border-white/80 rounded-2xl focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all text-sm font-bold shadow-inner outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">University Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@edu.in"
                    className="w-full h-16 pl-14 pr-6 bg-white/50 border border-white/80 rounded-2xl focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all text-sm font-bold shadow-inner outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Gateway</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-16 pl-14 pr-6 bg-white/50 border border-white/80 rounded-2xl focus:bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-100 transition-all text-sm font-bold shadow-inner outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-18 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-lg font-black shadow-xl shadow-indigo-200 mt-6 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign In to Bazaar" : "Start your Journey"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100/50 text-center">
               <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                 By continuing, you agree to our <br />
                 <span className="text-indigo-400 cursor-pointer hover:underline">Secure Trading Policies</span>
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
