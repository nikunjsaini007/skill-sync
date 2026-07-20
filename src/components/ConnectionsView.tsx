import { motion } from "motion/react";
import { Check, X, Users, MessageSquare, Trash2, ArrowRight } from "lucide-react";
import { UserProfile, Connection } from "../types";

interface ConnectionsViewProps {
  currentUser: UserProfile;
  connections: Connection[];
  users: UserProfile[];
  onAcceptConnection: (connId: string) => void;
  onRejectConnection: (connId: string) => void;
  onRemoveConnection: (connId: string) => void;
  onOpenChat: (peerId: string) => void;
  onViewProfile: (peer: UserProfile) => void;
}

export default function ConnectionsView({
  currentUser,
  connections,
  users,
  onAcceptConnection,
  onRejectConnection,
  onRemoveConnection,
  onOpenChat,
  onViewProfile
}: ConnectionsViewProps) {
  
  const pendingIncoming = connections.filter(
    c => c.status === "pending" && c.receiverId === currentUser.id
  );


  const pendingOutgoing = connections.filter(
    c => c.status === "pending" && c.senderId === currentUser.id
  );

  
  const activeConnections = connections.filter(
    c => c.status === "accepted" && (c.senderId === currentUser.id || c.receiverId === currentUser.id)
  );

 
  const getPeerProfile = (peerId: string): UserProfile => {
    return users.find(u => u.id === peerId) || {
      id: peerId,
      name: "Anonymous User",
      email: "anon@skillsync.app",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      headline: "Skill Swapper",
      bio: "Excited to exchange knowledge and build real projects together.",
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

  return (
    <div id="connections-view" className="space-y-8 p-6 max-w-6xl mx-auto font-sans">
      
     
      <div className="hero-panel rounded-[1.6rem] p-6">
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-primary" /> My Exchange Network
        </h1>
        <p className="text-xs text-slate-400 mt-1">Keep your learning circle simple and useful.</p>
      </div>

     
      <div className="grid lg:grid-cols-3 gap-8">
        
       
        <div className="space-y-6 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Swap Requests Pending</h3>
          
        
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-brand-primary-hover">Incoming Approvals ({pendingIncoming.length})</h4>
            
            {pendingIncoming.length > 0 ? (
              pendingIncoming.map(conn => {
                const peer = getPeerProfile(conn.senderId);
                return (
                  <div key={conn.id} className="space-y-3 rounded-[1.2rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/70 via-brand-card/60 to-brand-sec-bg/70 p-4 shadow-[0_12px_35px_rgba(2,6,23,0.12)] soft-3d">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onViewProfile(peer)}
                        className="w-10 h-10 rounded-full overflow-hidden shrink-0 cursor-pointer border border-brand-border"
                      >
                        <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                      <div className="min-w-0">
                        <button 
                          onClick={() => onViewProfile(peer)}
                          className="text-xs font-bold text-slate-200 hover:text-brand-primary-hover truncate block cursor-pointer"
                        >
                          {peer.name}
                        </button>
                        <p className="text-[10px] text-slate-500 truncate">{peer.college}</p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 bg-brand-bg/50 px-2.5 py-1.5 rounded border border-brand-border/40">
                      <span className="text-emerald-400 font-semibold">Teaches:</span> {peer.skillsOffered.slice(0, 2).join(", ")}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onAcceptConnection(conn.id)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center gap-1 shadow"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => onRejectConnection(conn.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-bg hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-brand-border flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-xl bg-brand-card/20 border border-brand-border/40 text-center text-xs text-slate-600">
                No incoming connection requests.
              </div>
            )}
          </div>

         
          <div className="space-y-4 pt-4 border-t border-brand-border/30">
            <h4 className="text-xs font-semibold text-slate-500">Sent Requests Awaiting Response ({pendingOutgoing.length})</h4>
            
            {pendingOutgoing.length > 0 ? (
              pendingOutgoing.map(conn => {
                const peer = getPeerProfile(conn.receiverId);
                return (
                  <div key={conn.id} className="p-3.5 rounded-xl bg-brand-card/25 border border-brand-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 text-xs">
                        <h5 className="font-bold text-slate-300 truncate">{peer.name}</h5>
                        <p className="text-[10px] text-slate-500 truncate">{peer.college}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500 bg-brand-bg px-2 py-0.5 rounded border border-brand-border/40">
                      Pending
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-3 rounded-xl bg-brand-card/10 border border-brand-border/20 text-center text-[10px] text-slate-600">
                No outgoing requests.
              </div>
            )}
          </div>

        </div>

    
        <div className="space-y-6 lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Swappers & Sessions</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {activeConnections.length > 0 ? (
              activeConnections.map(conn => {
                const peerId = conn.senderId === currentUser.id ? conn.receiverId : conn.senderId;
                const peer = getPeerProfile(peerId);

                return (
                  <motion.div 
                    key={conn.id} 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group flex h-48 flex-col justify-between rounded-[1.3rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/75 via-brand-card/60 to-brand-sec-bg/70 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.2)] soft-3d"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onViewProfile(peer)}
                          className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-brand-border hover:border-brand-primary/40 transition-all cursor-pointer"
                        >
                          <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </button>
                        <div className="min-w-0">
                          <button 
                            onClick={() => onViewProfile(peer)}
                            className="text-xs font-bold text-slate-200 hover:text-brand-primary-hover truncate block cursor-pointer"
                          >
                            {peer.name}
                          </button>
                          <p className="text-[10px] text-slate-500 truncate">{peer.college}</p>
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] space-y-1 bg-brand-bg/40 p-2 rounded border border-brand-border/40">
                        <div>
                          <span className="text-emerald-400 font-semibold">Gives:</span> {peer.skillsOffered.slice(0, 2).join(", ")}
                        </div>
                        <div>
                          <span className="text-purple-400 font-semibold">Takes:</span> {peer.skillsWanted.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-border/40 pt-3 mt-4">
                      <button
                        onClick={() => onRemoveConnection(conn.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove Connection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenChat(peerId)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center gap-1.5 shadow"
                      >
                        Chat Space <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center space-y-3 bg-brand-card/25 border border-brand-border/50 rounded-2xl">
                <Users className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-xs font-semibold text-slate-400">No Active Connections Yet</h4>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Click "Discover" to search for peers, calculate compatibility, and send sync requests!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
