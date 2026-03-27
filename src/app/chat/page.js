"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, Loader2, MessageSquare, Lock, CheckCircle2, SmilePlus,
  Search, BookOpen, Info, Clock, Check, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getChats, getMessages, sendMessage, completeRequest, getImageUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const SOCKET_URL = process.env.NODE_ENV === "production"
  ? undefined // In production, connect to current origin
  : (process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
const socket = io(SOCKET_URL, { withCredentials: true });

function ChatContent() {
  const { user, loading: authLoading } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
      return;
    }
    if (user) fetchChats();
  }, [user, authLoading]);

  useEffect(() => {
    const requestId = searchParams?.get("requestId");
    if (requestId && chats.length > 0) {
      const chat = chats.find((c) => c._id === requestId);
      if (chat) setActiveChat(chat);
    }
  }, [chats, searchParams]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
      
      socket.emit("join_chat", activeChat._id);
      
      const handleReceive = (data) => {
        if (data.request === activeChat._id) {
          setMessagesList((prev) => {
            if (prev.find(m => m._id === data._id)) return prev;
            // Also remove temp messages if they match the content exactly, 
            // though fetching again handles most syncing.
            return [...prev, data];
          });
        }
      };

      socket.on("receive_message", handleReceive);

      return () => {
        socket.off("receive_message", handleReceive);
      };
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await getChats();
      setChats(res.data);
    } catch (err) {
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (requestId, isPolling = false) => {
    try {
      if (!isPolling) setMsgLoading(true);
      const res = await getMessages(requestId);
      setMessagesList(res.data);
    } catch (err) {
      if (!isPolling) toast.error("Failed to load messages");
    } finally {
      if (!isPolling) setMsgLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;
    const text = newMessage.trim();
    setNewMessage("");

    try {
      const tempMsg = {
        _id: `temp-${Date.now()}`,
        message: text,
        sender: { _id: user._id, name: user.name },
        createdAt: new Date().toISOString(),
      };
      setMessagesList((prev) => [...prev, tempMsg]);

      await sendMessage(activeChat._id, text);
      fetchMessages(activeChat._id, true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send");
      setMessagesList((prev) => prev.filter((m) => !m._id.toString().startsWith("temp-")));
    }
  };

  const handleMarkSold = async () => {
    try {
      setCompleting(true);
      await completeRequest(activeChat._id);
      toast.success("Deal marked as complete! 🎉");
      fetchChats();
      fetchMessages(activeChat._id, true);
      setActiveChat((prev) => ({ ...prev, isCompleted: true, status: "accepted" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark as sold");
    } finally {
      setCompleting(false);
    }
  };

  const isBuyer = activeChat?.buyer?._id === user?._id;
  const isSeller = activeChat?.seller?._id === user?._id;
  const isAccepted = activeChat?.status === "accepted";
  const isCompleted = activeChat?.isCompleted;
  const inputLocked = isBuyer && !isAccepted && activeChat?.hasInitialMessage && !activeChat?.sellerReplied;

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-400 mt-4 font-medium">Setting up your dashboard...</p>
      </div>
    );
  }

  const filteredChats = (Array.isArray(chats) ? chats : []).filter(c => {
    const other = c.buyer?._id === user?._id ? c.seller : c.buyer;
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.book?.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      
      {/* Sidebar / Chat List */}
      <aside className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-100 flex flex-col h-full z-30 transition-all ${activeChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-6">Messages</h1>
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search chats..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-12 pl-12 pr-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
             />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-20 space-y-2">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const other = chat.buyer?._id === user?._id ? chat.seller : chat.buyer;
              const isActive = activeChat?._id === chat._id;
              return (
                <button
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all text-left ${
                    isActive ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "hover:bg-gray-50 bg-white border border-transparent"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase flex-shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                    {other?.avatar || other?.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-black truncate tracking-tight ${isActive ? "text-white" : "text-gray-900"}`}>{other?.name}</p>
                      {chat.lastMessageAt && (
                        <span className={`text-[10px] font-bold ${isActive ? "text-white/60" : "text-gray-400"}`}>
                           {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate font-medium ${isActive ? "text-white/80" : "text-gray-500"}`}>
                      {chat.lastMessage || "Tap to start chatting"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isActive ? "bg-white/10 text-white" : "bg-gray-100 text-indigo-600"}`}>
                          {chat.book?.title}
                       </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-20 px-8">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare className="w-8 h-8 text-gray-200" />
               </div>
               <p className="text-sm font-bold text-gray-400">No active conversations found</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Thread */}
      <main className={`flex-1 flex flex-col h-full bg-white md:bg-transparent transition-all ${!activeChat ? "hidden md:flex" : "flex"}`}>
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div 
              key={activeChat._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col h-full md:p-6 lg:p-10"
            >
              <div className="flex-1 flex flex-col bg-white md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
                 
                 {/* Thread Header */}
                 <header className="px-6 h-24 border-b border-gray-100 flex items-center justify-between shrink-0 glass-saas z-20">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2"><ArrowLeft /></button>
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100 uppercase">
                          {activeChat.buyer?._id === user?._id ? activeChat.seller?.name?.charAt(0) : activeChat.buyer?.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-base font-black text-gray-900 tracking-tight leading-tight">
                             {activeChat.buyer?._id === user?._id ? activeChat.seller?.name : activeChat.buyer?.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Online Now</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-3">
                       {isSeller && isAccepted && !isCompleted && (
                         <Button 
                           onClick={handleMarkSold} 
                           disabled={completing}
                           className="hidden lg:flex h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold px-6 shadow-lg shadow-emerald-100"
                         >
                            {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Mark as Sold
                         </Button>
                       )}
                       <Button 
                         variant="outline"
                         onClick={() => router.push(`/book/${activeChat.book?._id}`)}
                         className="h-11 px-5 rounded-xl border border-gray-100 text-gray-700 font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm"
                       >
                         <BookOpen size={16} className="text-indigo-600" />
                         <span className="hidden sm:inline">View Listing</span>
                       </Button>
                    </div>
                 </header>

                 {/* Book Context Card */}
                 <div className="p-4 bg-indigo-50/50 border-b border-indigo-100/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
                       <Image 
                         src={getImageUrl(activeChat.book?.images?.[0])} 
                         alt={activeChat.book?.title || "Book"}
                         fill
                         className="object-cover"
                         sizes="40px"
                         unoptimized
                       />
                    </div>
                    <div className="flex-1">
                       <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Discussion About</p>
                       <p className="text-sm font-bold text-gray-900 truncate">{activeChat.book?.title} — ₹{activeChat.book?.price}</p>
                    </div>
                 </div>

                 {/* Message Area */}
                 <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-dot-pattern">
                    {messagesList.map((msg, i) => {
                      const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[80%] md:max-w-[70%] space-y-1.5`}>
                             <div className={`px-5 py-4 rounded-3xl shadow-sm ${isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-gray-900 border border-gray-100 rounded-bl-none"}`}>
                                <p className="text-sm md:text-base font-medium leading-relaxed">{msg.message}</p>
                             </div>
                             <div className={`flex items-center gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
                                <Clock className="w-3 h-3 text-gray-300" />
                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
                                   {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {isMe && <CheckCheck className="w-3 h-3 text-indigo-400" />}
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                 </div>

                 {/* Input Bar */}
                 <footer className="p-6 md:p-8 bg-white/70 backdrop-blur-md border-t border-gray-100">
                    <div className="flex items-center gap-4">
                       {inputLocked ? (
                         <div className="flex-1 h-16 flex items-center gap-3 px-6 bg-amber-50 rounded-3xl border border-amber-100">
                            <Lock className="w-5 h-5 text-amber-500" />
                            <p className="text-sm font-black text-amber-700 tracking-tight">Waiting for seller response before you can send more messages...</p>
                         </div>
                       ) : isCompleted ? (
                         <div className="flex-1 h-16 flex items-center justify-center gap-3 px-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <p className="text-sm font-black text-emerald-700 tracking-tight">This deal has been completed successfully!</p>
                         </div>
                       ) : (
                         <>
                           <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"><SmilePlus /></button>
                           <div className="flex-1 relative">
                             <input 
                               type="text" 
                               placeholder="Type your message..."
                               className="w-full h-16 pl-6 pr-6 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none shadow-inner"
                               value={newMessage}
                               onChange={(e) => setNewMessage(e.target.value)}
                               onKeyDown={(e) => e.key === "Enter" && handleSend()}
                             />
                           </div>
                           <motion.button 
                             whileTap={{ scale: 0.95 }}
                             onClick={handleSend}
                             disabled={!newMessage.trim()}
                             className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 disabled:opacity-30 disabled:shadow-none transition-all"
                           >
                             <Send size={24} />
                           </motion.button>
                         </>
                       )}
                    </div>
                 </footer>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <div className="relative animate-float">
                   <div className="w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 absolute inset-0" />
                   <MessageSquare className="w-24 h-24 text-indigo-100 relative z-10 mx-auto" strokeWidth={1} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Your inbox is waiting.</h2>
                <p className="text-gray-400 max-w-sm font-medium">Select a conversation from the left to start negotiation or conclude a deal.</p>
                <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-5 py-2 rounded-full text-xs">
                   <Info size={14} />
                   <span>Always meet in person for cash transactions</span>
                </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-400 mt-4 font-medium">Loading your conversations...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
