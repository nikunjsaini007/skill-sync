import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, CheckCheck, Smile, HelpCircle, Sparkles, Brain, Code, Zap, Phone, Video, Image as ImageIcon, Plus, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { UserProfile, Connection, Message } from "@/lib/types";
import { useCalls } from "@/features/calls";

interface MessagesViewProps {
  currentUser: UserProfile;
  connections: Connection[];
  messages: Message[];
  users: UserProfile[];
  activeChatPeerId: string | null;
  setActiveChatPeerId: (id: string | null) => void;
  onSendMessage: (receiverId: string, text: string, imageUrls?: string[]) => void;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE_MB = 8;
// Firestore caps a message document at ~1MB, so keep each compressed image
// well under that budget (base64 inflates the raw bytes by ~33%).
const MAX_DATA_URL_LENGTH = 160_000;

export default function MessagesView({
  currentUser,
  connections,
  messages,
  users,
  activeChatPeerId,
  setActiveChatPeerId,
  onSendMessage
}: MessagesViewProps) {

  const [selectedImages, setSelectedImages] = useState<{ file: File; preview: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [pickerMessage, setPickerMessage] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{
    urls: string[];
    index: number;
    senderName: string;
    senderAvatar: string;
    caption: string;
    createdAt: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { activeCall, startCall } = useCalls();
  const selectedImagesRef = useRef(selectedImages);
  selectedImagesRef.current = selectedImages;

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);

  useEffect(() => {
    if (!pickerMessage) return;
    const timer = setTimeout(() => setPickerMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [pickerMessage]);

  useEffect(() => {
    if (!viewer) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(null);
      if (e.key === "ArrowLeft") setViewer(v => v && v.urls.length > 1 ? { ...v, index: (v.index - 1 + v.urls.length) % v.urls.length } : v);
      if (e.key === "ArrowRight") setViewer(v => v && v.urls.length > 1 ? { ...v, index: (v.index + 1) % v.urls.length } : v);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [viewer]);

  const openImageViewer = (
    urls: string[],
    index: number,
    senderName: string,
    senderAvatar: string,
    caption: string,
    createdAt: string
  ) => {
    setViewer({ urls, index, senderName, senderAvatar, caption, createdAt });
  };

  const stepViewer = (dir: 1 | -1) => {
    setViewer(v => (v && v.urls.length > 1
      ? { ...v, index: (v.index + dir + v.urls.length) % v.urls.length }
      : v));
  };


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

  const compressImage = async (file: File): Promise<string> => {
    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not decode the selected image."));
      img.src = rawDataUrl;
    });

    let width = image.naturalWidth || image.width;
    let height = image.naturalHeight || image.height;
    const scale = Math.min(1, 900 / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));
    let quality = 0.72;

    for (let attempt = 0; attempt < 8; attempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Image compression is not supported in this browser.");
      ctx.drawImage(image, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= MAX_DATA_URL_LENGTH) return dataUrl;
      if (attempt % 2 === 0) {
        quality = Math.max(0.35, quality - 0.12);
      } else {
        width = Math.max(64, Math.round(width * 0.8));
        height = Math.max(64, Math.round(height * 0.8));
      }
    }
    throw new Error("This image is too large to share. Please choose a smaller one.");
  };



  const handleSend = async () => {
    const textToSend = inputText.trim();
    if ((!textToSend && selectedImages.length === 0) || !activeChatPeerId || isSending) return;

    setIsSending(true);
    try {
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(selectedImages.map(img => compressImage(img.file)));
      }
      onSendMessage(activeChatPeerId, textToSend, imageUrls);
      setInputText("");
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
      setSelectedImages([]);
    } catch (error) {
      setPickerMessage(error instanceof Error ? error.message : "Image upload failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > MAX_IMAGES) {
      setPickerMessage(`You can attach up to ${MAX_IMAGES} images.`);
    }

    const next: { file: File; preview: string }[] = [];
    for (const file of files) {
      if (selectedImages.length + next.length >= MAX_IMAGES) break;
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setPickerMessage(`${file.name} is larger than ${MAX_IMAGE_SIZE_MB}MB and was skipped.`);
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }

    if (next.length > 0) {
      setPickerMessage(null);
      setSelectedImages(prev => [...prev, ...next]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const target = selectedImages[index];
    if (target) URL.revokeObjectURL(target.preview);
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };


  const presetIcebreakers = activePeer ? [
    `"Hey ${activePeer.name}, saw you're offering ${activePeer.skillsOffered[0] || "skills"}. I'd love to learn that in exchange for ${currentUser.skillsOffered[0] || "my skills"}!"`,
    `"Hi! I'm building an MVP and noticed your expertise in ${activePeer.skillsOffered[0]}. Let's sync up for a session?"`,
  ] : [];

  return (
    <>
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
                        {partner.lastMsg.senderId === currentUser.id ? "You: " : ""}
                        {partner.lastMsg.text ||
                          (partner.lastMsg.imageUrls && partner.lastMsg.imageUrls.length > 0
                            ? partner.lastMsg.imageUrls.length === 1
                              ? "Shared a photo"
                              : `Shared ${partner.lastMsg.imageUrls.length} photos`
                            : "")}
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
                const msgImages = msg.imageUrls ?? [];
                const singleImage = msgImages.length === 1;
                const msgSender = isMine ? currentUser : activePeer;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1.5 shadow-md ${isMine
                      ? "bg-gradient-to-tr from-blue-700 to-sky-800 text-white rounded-tr-none"
                      : "bg-brand-card border border-brand-border text-slate-200 rounded-tl-none"
                      }`}>
                      {msgImages.length > 0 && (
                        <div className={singleImage ? "grid grid-cols-1 gap-1.5" : "grid grid-cols-2 gap-1.5"}>
                          {msgImages.map((url, i) => (
                            <button
                              key={i}
                              onClick={() => openImageViewer(
                                msgImages,
                                i,
                                msgSender?.name || "Swapper Peer",
                                msgSender?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
                                msg.text,
                                msg.createdAt
                              )}
                              title="View image"
                              className={singleImage
                                ? "block w-full max-h-72 overflow-hidden rounded-xl border border-white/10 bg-black/20 group cursor-pointer"
                                : "block w-36 h-36 overflow-hidden rounded-lg border border-white/10 bg-black/20 group cursor-pointer"}
                            >
                              <img src={url} alt={`Shared image ${i + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce delay-200" />
                    <span className="text-[10px] text-slate-500 font-medium ml-1">{activePeer.name} is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {selectedImages.length > 0 && (
              <div className="px-4 pb-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-brand-border/60 bg-gradient-to-br from-brand-card/90 via-brand-card/70 to-brand-sec-bg/90 p-3 shadow-[0_16px_40px_rgba(2,6,23,0.3)] soft-3d"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-primary" />
                      Add to your swap
                    </span>
                    <span className="text-[9px] font-mono text-brand-primary-hover">{selectedImages.length}/{MAX_IMAGES}</span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {selectedImages.map((img, index) => (
                      <div key={index} className="relative group shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-xl border border-brand-border/60 shadow-lg">
                          <img src={img.preview} alt={`Selected image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white keep-light-text flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {selectedImages.length < MAX_IMAGES && (
                      <label
                        htmlFor="image-upload"
                        className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl border-2 border-dashed border-brand-primary/40 hover:border-brand-primary hover:bg-brand-primary/5 flex flex-col items-center justify-center gap-1 cursor-pointer text-brand-primary-hover transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[8px] font-semibold">Add Photo</span>
                      </label>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
            <div className="p-4 border-t border-brand-border/40 bg-brand-sec-bg/25">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
              {pickerMessage && (
                <div className="mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-[10px] text-red-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3 h-3 shrink-0" />
                  <span>{pickerMessage}</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-brand-bg rounded-xl border border-brand-border/80 px-3.5 py-1 focus-within:border-brand-primary transition-colors">
                <button className="text-slate-500 hover:text-slate-300 transition-colors shrink-0">
                  <Smile className="w-4.5 h-4.5" />
                </button>

                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-slate-500 hover:text-brand-primary-hover transition-colors shrink-0"
                  title={`Attach up to ${MAX_IMAGES} photos`}
                >
                  <ImageIcon className="w-4.5 h-4.5" />
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
                  disabled={(!inputText.trim() && selectedImages.length === 0) || isSending}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shrink-0 cursor-pointer"
                >
                  {isSending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
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

      <AnimatePresence>
        {viewer && (
          <motion.div
            key="image-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8"
            onClick={() => setViewer(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 14 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg md:max-w-xl bg-brand-bg border border-brand-border/60 rounded-2xl overflow-hidden shadow-2xl soft-3d"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-3 border-b border-brand-border/40 bg-brand-card/60">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-border shrink-0">
                  <img src={viewer.senderAvatar} alt={viewer.senderName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-200 truncate">{viewer.senderName}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(viewer.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <button
                  onClick={() => setViewer(null)}
                  aria-label="Close image"
                  className="w-8 h-8 rounded-full hover:bg-brand-bg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative bg-black/40">
                <motion.img
                  key={viewer.index}
                  src={viewer.urls[viewer.index]}
                  alt={`Shared image ${viewer.index + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full max-h-[62vh] object-contain"
                />

                {viewer.urls.length > 1 && (
                  <>
                    <button
                      onClick={e => { e.stopPropagation(); stepViewer(-1); }}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); stepViewer(1); }}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur flex items-center justify-center text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-[10px] font-mono text-white">
                      {viewer.index + 1}/{viewer.urls.length}
                    </div>
                  </>
                )}
              </div>

              {viewer.caption && (
                <div className="p-3.5 border-t border-brand-border/40 bg-brand-card/40">
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    <span className="font-bold">{viewer.senderName}</span> {viewer.caption}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
