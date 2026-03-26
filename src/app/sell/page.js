"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Camera, Trash2, ArrowRight, ArrowLeft, Sparkles, 
  MapPin, IndianRupee, BookOpen, Layers, CheckCircle2, Loader2,
  Info, ChevronRight, Book, GraduationCap, X, Wand2, TrendingUp,
  ShieldCheck, AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createBook, getAIPriceSuggestion, detectAICondition } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const categories = [
  { id: "JEE", label: "JEE Mains/Adv", icon: Book },
  { id: "NEET", label: "NEET UG", icon: Sparkles },
  { id: "CBSE Boards", label: "CBSE Boards", icon: GraduationCap },
  { id: "University", label: "University/College", icon: BookOpen },
  { id: "Others", label: "Others", icon: Layers },
];

const conditions = [
  { id: "Like New", label: "Like New", desc: "Hardly used, no marks" },
  { id: "Good", label: "Good", desc: "Minor wear, some highlights" },
  { id: "Poor", label: "Poor", desc: "Visible wear, heavily used" },
];

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [isBundle, setIsBundle] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // AI state
  const [aiPrice, setAiPrice] = useState(null);      // price suggestion result
  const [aiLoadingPrice, setAiLoadingPrice] = useState(false);
  const [aiCondition, setAiCondition] = useState(null); // condition detection result
  const [aiLoadingCondition, setAiLoadingCondition] = useState(false);

  // Form states
  const [images, setImages] = useState([]); // [{file, preview}]
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    mrp: "",
    condition: "Good",
    category: "JEE",
    description: "",
    location: "Campus Common Area",
  });

  const [bundleForm, setBundleForm] = useState({
    title: "",
    books: [""],
    price: "",
    mrp: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to sell books");
      router.push("/auth");
    }
  }, [user, authLoading]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("Max 5 images allowed");
      return;
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);

    // Trigger AI condition detection after upload
    if (!isBundle && form.title) {
      const allImages = [...images, ...newImages];
      triggerConditionDetection(allImages);
    }
  };

  const triggerConditionDetection = async (imgs) => {
    if (aiLoadingCondition || !imgs?.length) return;
    setAiLoadingCondition(true);
    try {
      const base64Image = await fileToBase64(imgs[0].file);
      const res = await detectAICondition({
        title: form.title || "Book",
        userCondition: form.condition,
        description: form.description,
        image: base64Image,
      });
      setAiCondition(res.data);
    } catch (err) {
      console.error("[AI Condition Error]", err);
      // silent fail — don't block the user
    } finally {
      setAiLoadingCondition(false);
    }
  };

  const triggerPriceSuggestion = async () => {
    if (!form.title || !form.mrp) {
      toast.error("Fill in title and MRP first to get AI price suggestion");
      return;
    }
    setAiLoadingPrice(true);
    setAiPrice(null);
    try {
      let base64Image = null;
      if (images.length > 0) {
        base64Image = await fileToBase64(images[0].file);
      }

      const res = await getAIPriceSuggestion({
        title: form.title,
        mrp: parseFloat(form.mrp),
        condition: form.condition,
        category: form.category,
        demandScore: 60,
        image: base64Image,
      });
      setAiPrice(res.data);
    } catch (err) {
      console.error("[AI Price Error]", err);
      toast.error("AI suggestion unavailable right now");
    } finally {
      setAiLoadingPrice(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      if (isBundle) {
        formData.append("title", bundleForm.title);
        formData.append("price", bundleForm.price);
        formData.append("mrp", bundleForm.mrp);
        formData.append("category", "Bundles");
        formData.append("condition", "Good");
        formData.append("isBundle", "true");
        formData.append("bundleBooks", JSON.stringify(bundleForm.books));
      } else {
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));
        formData.append("isBundle", "false");
      }

      images.forEach(img => formData.append("images", img.file));

      await createBook(formData);
      toast.success("Hooray! Book listed successfully 🎉");
      router.push("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Listing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#fdfdff] pb-24">
      
      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-3">Post a Listing</h1>
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Reach thousands of students instantly</p>
            </div>
            
            {/* Stepper (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
               {[1, 2, 3].map((s) => (
                 <div key={s} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-110" : "bg-gray-100 text-gray-400"}`}>
                       {s}
                    </div>
                    {s < 3 && <div className={`w-12 h-1 bg-gray-100 rounded-full ${step > s ? "bg-indigo-600" : ""}`} />}
                 </div>
               ))}
            </div>
         </div>
      </div>

      <main className="max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Type Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => { setIsBundle(false); setStep(2); }}
                    className="p-8 rounded-[40px] bg-white border-2 border-transparent hover:border-indigo-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-left group transition-all active:scale-95"
                  >
                     <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                        <BookOpen size={32} strokeWidth={2.5} />
                     </div>
                     <h3 className="text-2xl font-black text-gray-900 mb-2">Single Book</h3>
                     <p className="text-gray-400 font-medium">List a single textbook, novel, or reference guide.</p>
                     <ChevronRight className="mt-8 text-indigo-600 animate-float" />
                  </button>

                  <button 
                    onClick={() => { setIsBundle(true); setStep(2); }}
                    className="p-8 rounded-[40px] bg-white border-2 border-transparent hover:border-indigo-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-left group transition-all active:scale-95"
                  >
                     <div className="w-16 h-16 rounded-3xl bg-amber-50 flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                        <Layers size={32} strokeWidth={2.5} />
                     </div>
                     <h3 className="text-2xl font-black text-gray-900 mb-2">Book Bundle</h3>
                     <p className="text-gray-400 font-medium">Sell a complete semester set or collection together.</p>
                     <ChevronRight className="mt-8 text-amber-600 animate-float" />
                  </button>
               </div>
            </motion.div>
          )}

          {/* STEP 2: Main Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
               {/* Image Upload Area */}
               <section>
                  <label className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 px-1 mb-4 block">Product Images (Max 5)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                     {images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-3xl overflow-hidden relative group border border-gray-100 shadow-sm">
                           <img src={img.preview} className="w-full h-full object-cover" />
                           <button 
                             onClick={() => removeImage(i)}
                             className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <X size={14} />
                           </button>
                        </div>
                     ))}
                     {images.length < 5 && (
                       <label className="aspect-square rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-indigo-50 transition-all text-indigo-400 group">
                          <Plus className="w-8 h-8 group-hover:scale-125 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                       </label>
                     )}
                  </div>
               </section>

               <div className="card-saas p-8 md:p-12 space-y-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Title of {isBundle ? "Bundle" : "Book"}</label>
                        <input 
                          value={isBundle ? bundleForm.title : form.title}
                          onChange={(e) => {
                             if (isBundle) setBundleForm({...bundleForm, title: e.target.value});
                             else setForm({...form, title: e.target.value});
                          }}
                          className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-sm font-bold shadow-inner"
                          placeholder={isBundle ? "e.g. 1st Year CSE Full Set" : "e.g. Introduction to Algorithms"}
                        />
                     </div>
                     {!isBundle && (
                       <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Author / Publication</label>
                        <input 
                          value={form.author}
                          onChange={(e) => setForm({...form, author: e.target.value})}
                          className="w-full h-14 px-6 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-sm font-bold shadow-inner"
                          placeholder="e.g. Cormen, Leiserson"
                        />
                       </div>
                     )}
                  </div>

                  {/* Pricing Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Your Selling Price</label>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input 
                             type="number"
                             value={isBundle ? bundleForm.price : form.price}
                             onChange={(e) => {
                               if (isBundle) setBundleForm({...bundleForm, price: e.target.value});
                               else setForm({...form, price: e.target.value});
                             }}
                             className="w-full h-14 pl-12 pr-6 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-sm font-black"
                             placeholder="500"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-black text-gray-700 ml-1">Original MRP</label>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input 
                             type="number"
                             value={isBundle ? bundleForm.mrp : form.mrp}
                             onChange={(e) => {
                               if (isBundle) setBundleForm({...bundleForm, mrp: e.target.value});
                               else setForm({...form, mrp: e.target.value});
                             }}
                             className="w-full h-14 pl-12 pr-6 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-sm font-black text-gray-400"
                             placeholder="1200"
                           />
                        </div>
                     </div>
                  </div>
                   {/* ── AI PRICE SUGGESTION ── */}
                   {!isBundle && (
                     <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <label className="text-sm font-black text-gray-700 ml-1">AI Price Suggestion</label>
                         <button
                           onClick={triggerPriceSuggestion}
                           disabled={aiLoadingPrice}
                           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition-colors disabled:opacity-60"
                         >
                           {aiLoadingPrice ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                           {aiLoadingPrice ? "Thinking..." : "Suggest Price"}
                         </button>
                       </div>

                       <AnimatePresence>
                         {aiPrice && (
                           <motion.div
                             initial={{ opacity: 0, y: -8 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -8 }}
                             className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-5"
                           >
                             <div className="flex items-center gap-2 mb-3">
                               <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                                 <Sparkles className="w-3.5 h-3.5 text-white" />
                               </div>
                               <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">AI Suggested</span>
                             </div>
                             <div className="grid grid-cols-3 gap-3 mb-4">
                               <div className="text-center">
                                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Min</p>
                                 <p className="text-lg font-black text-gray-700">₹{aiPrice.minPrice}</p>
                               </div>
                               <div className="text-center bg-indigo-600 rounded-2xl py-2">
                                 <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Best Price</p>
                                 <p className="text-lg font-black text-white">₹{aiPrice.bestPrice}</p>
                               </div>
                               <div className="text-center">
                                 <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Max</p>
                                 <p className="text-lg font-black text-gray-700">₹{aiPrice.maxPrice}</p>
                               </div>
                             </div>
                             <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">{aiPrice.reason}</p>
                             <button
                               onClick={() => setForm({ ...form, price: String(aiPrice.bestPrice) })}
                               className="w-full py-3 rounded-2xl bg-indigo-600 text-white text-xs font-black hover:bg-indigo-700 transition-colors"
                             >
                               Use Best Price (₹{aiPrice.bestPrice})
                             </button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   )}
                  {/* Category Chips */}
                  {!isBundle && (
                    <div>
                       <label className="text-sm font-black text-gray-700 ml-1 mb-3 block">Category</label>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {categories.map((cat) => {
                             const Icon = cat.icon;
                             const isSel = form.category === cat.id;
                             return (
                               <button 
                                 key={cat.id}
                                 onClick={() => setForm({...form, category: cat.id})}
                                 className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] font-black transition-all ${isSel ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                               >
                                  <Icon size={14} className="shrink-0" /> 
                                  <span className="truncate">{cat.label}</span>
                               </button>
                             );
                          })}
                       </div>
                    </div>
                  )}

                  {/* Condition selection */}
                   {!isBundle && (
                     <div>
                        <label className="text-sm font-black text-gray-700 ml-1 mb-3 block">Condition</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           {conditions.map((c) => (
                             <button 
                               key={c.id}
                               onClick={() => setForm({...form, condition: c.id})}
                               className={`p-4 rounded-2xl border-2 text-left transition-all ${form.condition === c.id ? "border-indigo-600 bg-indigo-50/30" : "border-gray-50 hover:border-indigo-100"}`}
                             >
                                <p className="text-xs font-black text-indigo-900 mb-1">{c.label}</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-tight">{c.desc}</p>
                              </button>
                            ))}
                         </div>

                         {/* ── AI CONDITION RESULT ── */}
                         <AnimatePresence>
                           {(aiLoadingCondition || aiCondition) && (
                             <motion.div
                               initial={{ opacity: 0, y: -6 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0 }}
                               className={`mt-4 p-5 rounded-[32px] border-2 flex items-start gap-4 transition-colors ${
                                 aiCondition && form.condition.toLowerCase() !== aiCondition.condition.replace(/_/g, " ").toLowerCase()
                                   ? "bg-amber-50/50 border-amber-100"
                                   : "bg-indigo-50/30 border-indigo-100/50"
                               }`}
                             >
                               {aiLoadingCondition ? (
                                 <div className="flex items-center gap-3 w-full">
                                   <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                                   <p className="text-sm font-bold text-indigo-400">AI scanning book condition...</p>
                                 </div>
                               ) : (
                                 <>
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                     form.condition.toLowerCase() !== aiCondition.condition.replace(/_/g, " ").toLowerCase()
                                       ? "bg-amber-100 text-amber-600"
                                       : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                   }`}>
                                     <ShieldCheck size={24} />
                                   </div>
                                   <div className="flex-1">
                                     <div className="flex items-center justify-between gap-2 mb-2">
                                       <div className="flex items-center gap-2">
                                         <span className="text-sm font-black text-gray-900 capitalize">AI Detected: {aiCondition.condition.replace(/_/g, " ")}</span>
                                         <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-black uppercase text-white tracking-widest leading-none">AI Verified</span>
                                       </div>
                                       {form.condition.toLowerCase() !== aiCondition.condition.replace(/_/g, " ").toLowerCase() && (
                                         <div className="flex items-center gap-1 text-amber-600">
                                            <AlertTriangle size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Condition Mismatch</span>
                                         </div>
                                       )}
                                     </div>
                                     
                                     {aiCondition.issues?.length > 0 && (
                                       <div className="flex flex-wrap gap-1.5 mb-3">
                                          {aiCondition.issues.map((issue, i) => (
                                            <span key={i} className="px-2.5 py-1 rounded-xl bg-white/60 border border-gray-100 text-[10px] font-bold text-gray-500">{issue}</span>
                                          ))}
                                       </div>
                                     )}

                                     {form.condition.toLowerCase() !== aiCondition.condition.replace(/_/g, " ").toLowerCase() && (
                                       <div className="p-3 bg-amber-100/50 rounded-2xl mb-4">
                                          <p className="text-xs font-bold text-amber-800 leading-tight">AI thinks this book is in {aiCondition.condition.replace(/_/g, " ")} condition. We recommend staying honest for better sales.</p>
                                       </div>
                                     )}

                                     <button
                                       onClick={() => {
                                          const mappedCondition = conditions.find(c => c.id.toLowerCase() === aiCondition.condition.replace(/_/g, " ").toLowerCase())?.id || "Good";
                                          setForm({ ...form, condition: mappedCondition });
                                       }}
                                       className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group"
                                     >
                                       Apply AI Suggestion <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                     </button>
                                   </div>
                                 </>
                               )}
                             </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                    )}
               </div>

               {/* Step 2 Actions */}
               <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1 h-16 rounded-[28px] border-gray-100 font-black text-gray-400">
                    <ArrowLeft className="w-5 h-5 mr-4" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-[2] h-16 bg-indigo-600 text-white rounded-[28px] font-black shadow-2xl shadow-indigo-200">
                    Next Section <ArrowRight className="w-5 h-5 ml-4" />
                  </Button>
               </div>
            </motion.div>
          )}

          {/* STEP 3: Preview & Submit */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
               <div className="card-saas p-10 text-center bg-mesh relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl" />
                  <div className="relative z-10">
                     <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                        <Sparkles size={40} className="text-white" />
                     </div>
                     <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Ready for Launch?</h2>
                     <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">Review your details carefully. Your book will be visible to thousands within campus.</p>
                     
                     {/* Preview Snippet */}
                     <div className="bg-white/80 border border-white rounded-3xl p-6 flex items-center gap-5 text-left mb-10 shadow-sm">
                        <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                           {images[0] && <img src={images[0].preview} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Final Preview</p>
                           <h4 className="text-lg font-black text-gray-900 truncate leading-tight mb-2">{isBundle ? bundleForm.title : form.title}</h4>
                           <div className="flex items-center gap-4">
                              <span className="text-base font-black text-gray-900">₹{isBundle ? bundleForm.price : form.price}</span>
                              <div className="px-3 py-1 bg-emerald-50 rounded-full text-[10px] font-black uppercase text-emerald-600">Active Listing</div>
                           </div>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <Button 
                          onClick={handleSubmit}
                          disabled={loading}
                          className="w-full h-18 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-200 transition-all hover:translate-y-[-4px]"
                        >
                           {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publish Listing Now 🚀"}
                        </Button>
                        <button onClick={() => setStep(2)} className="py-4 text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors">
                           Take me back, I missed something
                        </button>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-amber-500">
                     <Info size={24} />
                  </div>
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    By publishing, you agree to student community guidelines. Ensure the book condition matches your description.
                  </p>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
