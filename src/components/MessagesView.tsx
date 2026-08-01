import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { MessageSquare, Send, CheckCheck, Smile, HelpCircle, Sparkles, Brain, Code, Zap, Phone, Video } from "lucide-react";
import { UserProfile, Connection, Message } from "../types";
import { Image } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useCalls } from "../calls/CallContext";

interface MessagesViewProps {
  currentUser: UserProfile;
  connections: Connection[];
  messages: Message[];
  users: UserProfile[];
  activeChatPeerId: string | null;
  setActiveChatPeerId: (id: string | null) => void;
  onSendMessage: (receiverId: string, text: string) => void;
}

export default function MessagesView({
  currentUser,
  connections,
  messages,
  users,
  activeChatPeerId,
  setActiveChatPeerId,
  onSendMessage
}: MessagesViewProps) {

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { activeCall, startCall } = useCalls();


  const activeConns = connections.filter(
    c => c.status === "accepted" && (c.senderId === currentUser.id || c.receiverId === currentUser.id)
  );

  const getPeerProfile = (peerId: string): UserProfile => {
    return users.find(u => u.id === peerId) || {
      id: peerId,
      name: "Swapper Peer",
      email: "peer@skillsync.app",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      headline: "Skill Swapper",
      bio: "Excited to exchange knowledge and build real projects.",
      college: "External University",
      skillsOffered: [],
      skillsWanted: [],
      experience: "Intermediate",
      interests: "",
      learningGoals: "",
      isOnboarded: true,
      isPremium: false,
      rating: 5.0,
      reviewsCount: 0,
      achievements: []
    };
  };


  const chatPartners = activeConns.map(conn => {
    const peerId = conn.senderId === currentUser.id ? conn.receiverId : conn.senderId;
    const peer = getPeerProfile(peerId);


    const relevantMsgs = messages.filter(
      m => m.connectionId === conn.id
    );
    const lastMsg = relevantMsgs[relevantMsgs.length - 1];

    return {
      peer,
      lastMsg,
      connectionId: conn.id
    };
  });


  const activeConn = activeChatPeerId
    ? activeConns.find(
      c => (c.senderId === currentUser.id && c.receiverId === activeChatPeerId) ||
        (c.senderId === activeChatPeerId && c.receiverId === currentUser.id)
    )
    : null;


  const activeChatMessages = activeConn
    ? messages
      .filter(m => m.connectionId === activeConn.id)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
    : [];

  const activePeer = activeChatPeerId ? getPeerProfile(activeChatPeerId) : null;


  useEffect(() => {
    if (!activeChatPeerId) return;

    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [activeChatMessages.length, activeChatPeerId, isTyping]);

  const uploadImage = async (file: File) => {
    if (!storage) {
      throw new Error("Storage is not initialized");
    }

    const imageRef = ref(
      storage,
      `chat-images/${Date.now()}-${file.name}`
    );

    await uploadBytes(imageRef, file);

    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  };



  const handleSend = async () => {

    let imageUrl = "";

    if (selectedImage) {
      imageUrl = await uploadImage(selectedImage);
    } 
    if (!inputText.trim() || !activeChatPeerId) return;
    const textToSend = inputText.trim();
    onSendMessage(activeChatPeerId, textToSend);
    setInputText("");

  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };


  const presetIcebreakers = activePeer ? [
    `"Hey ${activePeer.name}, saw you're offering ${activePeer.skillsOffered[0] || "skills"}. I'd love to learn that in exchange for ${currentUser.skillsOffered[0] || "my skills"}!"`,
    `"Hi! I'm building an MVP and noticed your expertise in ${activePeer.skillsOffered[0]}. Let's sync up for a session?"`,
  ] : [];

  return (
    <div id="messages-view" className="flex h-[calc(100vh-64px)] md:h-screen font-sans border-l border-brand-border/20">


      <div className="w-80 border-r border-brand-border/40 bg-gradient-to-b from-brand-sec-bg/70 to-brand-bg/70 flex flex-col shrink-0 rounded-r-[1.4rem]">
        <div className="p-4 border-b border-brand-border/40">
          <h2 className="text-sm font-bold text-slate-200">Conversations</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Chat with your learning circle and fix your next swap</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          {chatPartners.length > 0 ? (
            chatPartners.map(partner => {
              const isActive = activeChatPeerId === partner.peer.id;
              return (
                <motion.button
                  key={partner.peer.id}
                  onClick={() => setActiveChatPeerId(partner.peer.id)}
                  whileHover={{ x: 2, scale: 1.01 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left soft-3d ${isActive
                    ? "bg-brand-primary/10 border border-brand-primary/20"
                    : "hover:bg-brand-card/30"
                    }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative border border-brand-border">
                    <img src={partner.peer.avatar} alt={partner.peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-brand-bg absolute bottom-0 right-0" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{partner.peer.name}</h4>
                      {partner.lastMsg && (
                        <span className="text-[8px] text-slate-500 font-mono">
                          {new Date(partner.lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{partner.peer.college}</p>
                    {partner.lastMsg ? (
                      <p className="text-[10px] text-slate-400 truncate mt-1">
                        {partner.lastMsg.senderId === currentUser.id ? "You: " : ""}{partner.lastMsg.text}
                      </p>
                    ) : (
                      <p className="text-[10px] text-brand-primary-hover font-medium truncate mt-1">
                        Start connection swap!
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-slate-600 px-4 space-y-1">
              <MessageSquare className="w-6 h-6 mx-auto text-slate-700 animate-pulse" />
              <p className="font-semibold">No Swappers Online</p>
              <p className="text-[10px]">Accept requests in Connections to begin chatting!</p>
            </div>
          )}
        </div>
      </div>


      <div className="flex-1 min-h-0 bg-brand-bg flex flex-col">
        {activePeer ? (
          <>

            <div className="flex items-center justify-between border-b border-brand-border/40 bg-gradient-to-r from-brand-sec-bg/40 to-brand-bg/40 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-border relative shrink-0">
                  <img src={activePeer.avatar} alt={activePeer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-brand-bg absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-200 leading-none truncate">{activePeer.name}</h3>
                  <span className="text-[10px] text-slate-500 mt-1 block truncate">Active Now • {activePeer.college}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 rounded-xl border border-brand-border/60 bg-brand-card/40 p-1">
                  <button
                    id="btn-voice-call"
                    onClick={() => startCall(activePeer.id, "voice")}
                    disabled={Boolean(activeCall)}
                    title={activeCall ? "You are already in a call" : `Start a voice call with ${activePeer.name}`}
                    aria-label={`Start a voice call with ${activePeer.name}`}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeCall ? "opacity-40 pointer-events-none" : "hover:bg-brand-primary/15 text-slate-400 hover:text-brand-primary-hover"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-video-call"
                    onClick={() => startCall(activePeer.id, "video")}
                    disabled={Boolean(activeCall)}
                    title={activeCall ? "You are already in a call" : `Start a video call with ${activePeer.name}`}
                    aria-label={`Start a video call with ${activePeer.name}`}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      activeCall ? "opacity-40 pointer-events-none" : "hover:bg-brand-primary/15 text-slate-400 hover:text-brand-primary-hover"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 hidden sm:block bg-brand-card/40 border border-brand-border px-3 py-1.5 rounded-xl">
                  Swap Track: <span className="text-brand-primary-hover font-semibold">{currentUser.skillsWanted[0]}</span> for <span className="text-brand-accent font-semibold">{activePeer.skillsWanted[0]}</span>
                </div>
              </div>
            </div>


            <div
              className="flex-1 overflow-y-auto p-5 space-y-4"
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >


              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl rounded-[1.2rem] border border-brand-border/80 bg-gradient-to-tr from-brand-card to-brand-sec-bg p-4 text-center shadow-[0_12px_35px_rgba(2,6,23,0.16)] space-y-3 soft-3d">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary-hover mx-auto">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Connection Swap Established</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Both swappers are mutually verified. Discuss scheduling, select learning milestones, or ask Syncy AI inside the chatbot to generate custom roadmaps!
                </p>


                <div className="space-y-1.5 text-left pt-2 border-t border-brand-border/40">
                  <span className="text-[9px] font-bold text-brand-accent uppercase tracking-wider block">Syncy Suggested Starters</span>
                  {presetIcebreakers.map((breaker, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(breaker.replace(/"/g, ""))}
                      className="w-full p-2 rounded bg-brand-bg/60 border border-brand-border/40 text-[10px] text-slate-400 hover:text-white text-left transition-colors truncate block hover:border-brand-primary/30"
                    >
                      {breaker}
                    </button>
                  ))}
                </div>
              </motion.div>


              {activeChatMessages.map(msg => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${isMine
                      ? "bg-brand-primary text-white rounded-tr-none"
                      : "bg-brand-card border border-brand-border text-slate-200 rounded-tl-none"
                      }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] opacity-60">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMine && <CheckCheck className="w-3 h-3 text-sky-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}


              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-brand-card border border-brand-border p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-200" />
                    <span className="text-[10px] text-slate-500 font-medium ml-1">{activePeer.name} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {selectedImage && (
              <div className="px-4 pb-2">
                <div className="relative inline-block">
                  <img
                    src={imagePreview!}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl border border-brand-border"
                  />

                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            <div className="p-4 border-t border-brand-border/40 bg-brand-sec-bg/25">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2 bg-brand-bg rounded-xl border border-brand-border/80 px-3.5 py-1 focus-within:border-brand-primary transition-colors">
                <button className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                  <Smile className="w-4.5 h-4.5" />
                </button>

                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-slate-500 hover:text-slate-300 transition-colors shrink-0"
                >
                  <Image className="w-4.5 h-4.5" />
                </label>

                <input
                  id="message-input-text"
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`Send sync message to ${activePeer.name}...`}
                  className="w-full py-3 bg-transparent text-slate-200 text-xs focus:outline-none placeholder:text-slate-600"
                />

                <button
                  id="btn-send-message"
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center text-slate-500 shadow-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-300">Open Chat Space</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Select an active conversation swapper on the left list to begin co-learning scheduling!</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
