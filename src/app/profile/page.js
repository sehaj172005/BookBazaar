"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, BookOpen, ShoppingBag, Settings, LogOut, ChevronRight, 
  Clock, CheckCircle2, AlertCircle, Loader2, XCircle, Eye, 
  MessageCircle, BarChart3, TrendingUp, Package, PlusCircle,
  X, MapPin, User, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getProfileMe, updateRequestStatus, completeRequest, getImageUrl, updateProfile } from "@/lib/api";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "books", label: "My Listings", icon: Package },
  { id: "sent", label: "Buying", icon: ShoppingBag },
  { id: "received", label: "Selling (Requests)", icon: BarChart3 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books");
  const { user, logout, refreshUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", location: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileMe();
      setProfileData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: user?.name || "",
      location: user?.location || "",
      bio: user?.bio || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      await updateProfile(editForm);
      await refreshUser();
      setShowEditModal(false);
      toast.success("Profile updated! ✨");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);
      toast.success(`Deal ${status} successfully`);
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await completeRequest(requestId);
      toast.success("Deal marked as complete! 🎉");
      fetchProfile();
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete deal");
    }
  };

  if (loading || authLoading || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-400 mt-4 font-medium">Syncing your dashboard...</p>
      </div>
    );
  }

  const { myBooks: listedBooks = [], requestsSent = [], requestsReceived = [] } = profileData;

  const stats = [
    { label: "Active Listings", value: listedBooks.filter(b => !b.isSold).length, icon: Package, color: "text-indigo-600 bg-indigo-50" },
    { label: "Completed Deals", value: user?.completedDeals || 0, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Views", value: listedBooks.reduce((acc, b) => acc + (b.views || 0), 0), icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
    { label: "Account Rating", value: user?.rating || "5.0", icon: Star, color: "text-amber-500 bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] pb-24 md:pb-12">
      
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
            <div className="flex items-center gap-6">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 to-indigo-700 p-1 shadow-2xl shadow-indigo-100 ring-4 ring-white">
                  <div className="w-full h-full rounded-[36px] bg-white flex items-center justify-center text-4xl md:text-5xl font-black text-indigo-600 uppercase">
                     {user.name.charAt(0)}
                  </div>
               </div>
               <div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">{user.name}</h1>
                  <p className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest">{user.badge || "Academic Maven"}</p>
                  <div className="flex items-center gap-2 mt-3">
                     <button onClick={openEditModal} className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-black shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
                        <Settings size={14} /> Edit Profile
                     </button>
                     <button onClick={() => { logout(); router.push("/"); }} className="px-4 py-2 rounded-xl bg-red-50 border border-red-100 text-xs font-black text-red-600 shadow-sm hover:bg-red-100 flex items-center gap-2">
                        <LogOut size={14} /> Sign Out
                     </button>
                  </div>
               </div>
            </div>

            {/* Seller Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full md:w-auto">
               {stats.map((stat) => (
                 <div key={stat.label} className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
                    <stat.icon className={`w-5 h-5 mb-4 ${stat.color.split(' ')[0]}`} />
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{stat.label}</p>
                       <p className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-6">
         {/* Premium Tab Bar */}
         <div className="flex items-center gap-8 border-b border-gray-100 mb-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 text-sm font-black tracking-tight transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="profileTab" 
                    className="absolute bottom-0 inset-x-0 h-1 bg-indigo-600 rounded-t-full" 
                  />
                )}
              </button>
            ))}
         </div>

         {/* Tab Content Area */}
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "books" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                  {listedBooks.length > 0 ? (
                    listedBooks.map((book) => (
                      <div 
                        key={book._id} 
                        onClick={() => router.push(`/book/${book._id}`)}
                        className="group card-saas cursor-pointer overflow-hidden pb-4"
                      >
                         <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative">
                            <Image 
                              src={getImageUrl(book.images?.[0])} 
                              alt={book.title || "Book"}
                              fill
                              className="object-cover transition-transform group-hover:scale-105" 
                              sizes="(max-width: 768px) 50vw, 25vw"
                              unoptimized
                            />
                            {book.isSold && (
                              <div className="absolute inset-x-0 bottom-0 py-1 bg-gray-900/80 backdrop-blur-sm text-center">
                                 <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">SOLD</span>
                              </div>
                            )}
                         </div>
                         <div className="p-4">
                            <h4 className="text-sm font-black text-gray-900 truncate tracking-tight">{book.title}</h4>
                            <div className="flex items-center justify-between mt-2">
                               <p className="text-base font-black text-indigo-600 tracking-tight">₹{book.price}</p>
                               <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                                  <Eye size={12} /> {book.views || 0}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                       <EmptyState 
                          title="No books listed" 
                          message="Turn your old books into extra cash." 
                          actionLabel="List First Book" 
                          onAction={() => router.push("/sell")}
                        />
                    </div>
                  )}
                  {/* Quick Add Button */}
                  <button 
                    onClick={() => router.push("/sell")}
                    className="aspect-[3/4] rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-indigo-100 hover:text-indigo-200 transition-all group"
                  >
                     <PlusCircle size={40} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                     <span className="text-xs font-black uppercase tracking-widest">Add Listing</span>
                  </button>
                </div>
              )}

              {activeTab === "sent" && (
                <div className="space-y-4">
                  {requestsSent.length > 0 ? (
                    requestsSent.map((req) => (
                      <div key={req._id} className="card-saas p-6 flex items-center justify-between gap-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                               <img src={getImageUrl(req.book?.images?.[0])} className="w-full h-full object-cover" onError={(e) => { e.target.src = "/placeholder-book.png"; }} />
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-1">{req.status}</p>
                               <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-tight mb-0.5">{req.book?.title}</h4>
                               <p className="text-sm text-gray-400 font-medium">To Seller: <span className="text-gray-900 font-bold">{req.seller?.name}</span></p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            {req.status === "accepted" && !req.isCompleted && (
                               <Button onClick={() => handleComplete(req._id)} className="h-12 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm">Mark Complete</Button>
                            )}
                            <Button onClick={() => router.push(`/chat?requestId=${req._id}`)} variant="outline" className="h-12 px-6 rounded-2xl font-bold border-gray-100 flex items-center gap-2 text-gray-700">
                               <MessageCircle size={18} /> Chat
                            </Button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No active purchases" message="Start browsing and connect with sellers to find deals." />
                  )}
                </div>
              )}

              {activeTab === "received" && (
                <div className="space-y-4">
                  {requestsReceived.length > 0 ? (
                    requestsReceived.map((req) => (
                      <div key={req._id} className="card-saas p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                         <div className="flex items-center gap-5">
                            <div className="w-16 h-20 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                               <img src={getImageUrl(req.book?.images?.[0])} className="w-full h-full object-cover" onError={(e) => { e.target.src = "/placeholder-book.png"; }} />
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-1">PROPOSAL RECEIVED</p>
                               <h4 className="text-lg font-black text-gray-900 tracking-tighter leading-tight mb-0.5">{req.book?.title}</h4>
                               <p className="text-sm text-gray-400 font-medium">From: <span className="text-indigo-600 font-bold">{req.buyer?.name}</span> • <span className="text-gray-900 font-black tracking-tight">₹{req.book?.price}</span></p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            {req.status === "pending" ? (
                              <>
                                <Button onClick={() => handleStatusUpdate(req._id, "accepted")} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm">Accept Deal</Button>
                                <Button onClick={() => handleStatusUpdate(req._id, "rejected")} variant="outline" className="h-12 px-8 rounded-2xl font-bold border-red-50 text-red-500">Decline</Button>
                              </>
                            ) : (
                              <div className="flex items-center gap-4">
                                 <span className="text-xs font-black uppercase text-gray-400 tracking-widest">{req.status}</span>
                                 <Button onClick={() => router.push(`/chat?requestId=${req._id}`)} className="h-12 bg-white border border-gray-100 rounded-2xl font-black text-xs text-indigo-600 shadow-sm">
                                    Open Negotiations
                                 </Button>
                              </div>
                            )}
                         </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState title="No active requests" message="Waiting for that magic notification!" />
                  )}
                </div>
              )}
            </motion.div>
         </AnimatePresence>
       </main>

      {/* ───── Edit Profile Modal ───── */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onKeyDown={(e) => e.key === "Escape" && setShowEditModal(false)}
            onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8 relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Edit Profile</h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">Update your public seller information</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Avatar preview */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-indigo-50 rounded-3xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xl font-black uppercase shadow-lg shadow-indigo-200">
                  {editForm.name?.charAt(0) || user?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{editForm.name || user?.name}</p>
                  <p className="text-xs text-gray-400 font-medium">Avatar auto-generated from initials</p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-bold text-gray-900 outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Location / College
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-bold text-gray-900 outline-none"
                    placeholder="e.g. IIT Delhi, Hauz Khas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-medium text-gray-900 outline-none resize-none"
                    placeholder="Tell buyers a bit about yourself..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-14 rounded-2xl border-gray-100 font-bold text-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
