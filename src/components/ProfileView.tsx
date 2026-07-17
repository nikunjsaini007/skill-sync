import { UserProfile, Review } from "../types";
import { Star, Award, MapPin, GraduationCap, Mail, Shield, Check, Flame } from "lucide-react";
import { MOCK_REVIEWS } from "../data";

interface ProfileViewProps {
  currentUser: UserProfile;
  peerProfile: UserProfile | null; // If null, displays current user's profile
  onBackToDiscover?: () => void;
  onConnectPeer?: (peerId: string) => void;
  connections?: any[];
}

export default function ProfileView({
  currentUser,
  peerProfile,
  onBackToDiscover,
  onConnectPeer,
  connections = []
}: ProfileViewProps) {
  
  // Decide who is being shown
  const activeUser = peerProfile || currentUser;
  const isOwnProfile = activeUser.id === currentUser.id;

  // Retrieve reviews or empty array
  const reviews: Review[] = MOCK_REVIEWS[activeUser.id] || [];

  // Check connection state
  const existingConn = connections.find(c => 
    (c.senderId === currentUser.id && c.receiverId === activeUser.id) ||
    (c.senderId === activeUser.id && c.receiverId === currentUser.id)
  );

  return (
    <div id="profile-view" className="space-y-6 p-6 max-w-4xl mx-auto font-sans pb-16">
      
      {/* Back CTA if looking at peer */}
      {!isOwnProfile && onBackToDiscover && (
        <button
          onClick={onBackToDiscover}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          &larr; Back to Discover Directory
        </button>
      )}

      {/* Header Profile Cover Banner Card */}
      <div className="relative bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-accent/20 rounded-2xl border border-brand-border/60 h-40 overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-4 right-4 flex gap-2">
          {activeUser.isPremium && (
            <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-400" /> Premium Swapper
            </span>
          )}
        </div>
      </div>

      {/* Profile avatar overlay details */}
      <div className="relative px-6 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-brand-border/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-bg relative shrink-0 shadow-xl bg-brand-sec-bg">
            <img src={activeUser.avatar} alt={activeUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold font-display text-white">{activeUser.name}</h2>
              {isOwnProfile && (
                <span className="bg-brand-primary/10 text-brand-primary-hover border border-brand-primary/20 text-[9px] px-2 py-0.5 rounded-full font-bold">
                  My Space
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium italic">"{activeUser.headline}"</p>
          </div>
        </div>

        {/* Call to Connect button if looking at peer */}
        {!isOwnProfile && onConnectPeer && (
          <div className="shrink-0">
            {existingConn ? (
              <button
                disabled
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed ${
                  existingConn.status === "accepted"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow"
                    : "bg-brand-sec-bg text-slate-500 border border-brand-border/60"
                }`}
              >
                {existingConn.status === "accepted" ? (
                  <>
                    <Check className="w-4 h-4" /> Swappers Connected
                  </>
                ) : (
                  "Pending Connection Approval"
                )}
              </button>
            ) : (
              <button
                onClick={() => onConnectPeer(activeUser.id)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all transform active:scale-95 shadow-lg shadow-brand-primary/20"
              >
                Send Connect Swap Request
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid: Left Column Details, Right Column Reviews */}
      <div className="grid md:grid-cols-3 gap-6 pt-2">
        
        {/* Left Column (Takes 2 spans) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Bio Description */}
          <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 space-y-3 soft-3d">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">About</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{activeUser.bio}</p>

            <div className="grid grid-cols-2 gap-4 pt-3 text-xs border-t border-brand-border/30">
              <div className="flex items-center gap-2 text-slate-400">
                <GraduationCap className="w-4 h-4 text-brand-primary" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold leading-none">College</div>
                  <div className="font-semibold text-slate-300 mt-1">{activeUser.college}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-secondary" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold leading-none">Location</div>
                  <div className="font-semibold text-slate-300 mt-1">{activeUser.location || "San Francisco, CA"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Matrices Matrix */}
          <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 grid grid-cols-1 sm:grid-cols-2 gap-5 soft-3d">
            {/* Offering box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Can Teach</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeUser.skillsOffered.map((sk, idx) => (
                  <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/5 text-emerald-300 border border-emerald-500/10">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Seeking box */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400">Wants to Learn</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeUser.skillsWanted.map((sk, idx) => (
                  <span key={idx} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-500/5 text-purple-300 border border-purple-500/10">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements / Credentials Badges */}
          <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 space-y-3 soft-3d">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Badges</h3>
            <div className="flex flex-wrap gap-3">
              {activeUser.achievements.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-bg border border-brand-border text-xs text-slate-300 font-medium">
                  <Award className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Reviews & Rating stats (Takes 1 span) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Feedback</h3>

          <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 space-y-4 soft-3d">
            
            {/* Stars rating panel */}
            <div className="text-center space-y-1.5 pb-4 border-b border-brand-border/40">
              <div className="text-3xl font-extrabold font-display text-white">{activeUser.rating} ★</div>
              <div className="flex gap-0.5 justify-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4.5 h-4.5 ${i < Math.floor(activeUser.rating) ? "fill-yellow-400" : ""}`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Based on {activeUser.reviewsCount} verified swaps</p>
            </div>

            {/* Reviews Feed list */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {reviews.length > 0 ? (
                reviews.map(rev => (
                  <div key={rev.id} className="space-y-2 border-b border-brand-border/30 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                        <img src={rev.fromUserAvatar} alt={rev.fromUserName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-[11px] font-bold text-slate-300 truncate leading-none">{rev.fromUserName}</h5>
                        <div className="flex text-yellow-400 scale-75 origin-left mt-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400" : ""}`} />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      "{rev.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-[10px] text-slate-600">
                  No verified swap reviews yet.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
