import { motion } from "motion/react";
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  Flame,
  Award,
  BookOpen
} from "lucide-react";
import { UserProfile, Connection } from "../types";
import { MOCK_USERS, calculateMatchScore } from "../data";

interface DashboardViewProps {
  currentUser: UserProfile;
  connections: Connection[];
  onNavigateTab: (tab: string) => void;
  onConnectPeer: (peerId: string) => void;
}

export default function DashboardView({ currentUser, connections, onNavigateTab, onConnectPeer }: DashboardViewProps) {

  const matches = MOCK_USERS.map(peer => {
    const matchAnalysis = calculateMatchScore(currentUser, peer);
    return {
      peer,
      score: matchAnalysis.score,
      explanation: matchAnalysis.explanation
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 3); // Get top 3 matches

  
  const activeConnections = connections.filter(c => c.status === "accepted").length;
  const pendingRequests = connections.filter(c => c.status === "pending" && c.receiverId === currentUser.id).length;

  return (
    <div id="dashboard-view" className="space-y-8 p-6 max-w-6xl mx-auto font-sans">
      
     
      <div className="hero-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-[1.8rem] p-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your next useful swap is waiting. Keep your learning moving.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 px-3.5 py-1.5 text-xs font-semibold text-brand-primary-hover">
            <Flame className="h-4 w-4 animate-pulse fill-orange-400 text-orange-400" /> 5-Day Streak
          </div>
          <span className="rounded-2xl border border-brand-border/40 bg-brand-sec-bg px-3 py-1.5 text-xs font-mono text-slate-500">
            UTC: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

  
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
       
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matches Found</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">12</div>
            <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4 new recommendations
            </p>
          </div>
        </div>

      
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Swaps</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{activeConnections}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              In-session exchange tracks
            </p>
          </div>
        </div>

    
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{pendingRequests}</div>
            <p className="text-[10px] text-amber-400 mt-1 font-semibold">
              Needs your confirmation
            </p>
          </div>
        </div>

        
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trust Rating</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">5.0 ★</div>
            <p className="text-[10px] text-slate-500 mt-1">
              Top educator status active
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
       
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-primary" /> Intelligently Suggested Matches
            </h3>
            <button 
              onClick={() => onNavigateTab("discover")} 
              className="text-xs font-semibold text-brand-primary-hover hover:text-white transition-colors flex items-center gap-1 group"
            >
              Discover all peers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-4">
            {matches.map(({ peer, score, explanation }) => {
            
              const isConnected = connections.some(c => 
                (c.senderId === currentUser.id && c.receiverId === peer.id) ||
                (c.senderId === peer.id && c.receiverId === currentUser.id)
              );

              return (
                <motion.div 
                  key={peer.id} 
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-[1.4rem] border border-brand-border/50 bg-gradient-to-br from-brand-card/75 via-brand-card/60 to-brand-sec-bg/70 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.2)] md:flex-row md:items-center soft-3d"
                >
                 
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full filter blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

                 
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-primary/30 shrink-0">
                      <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-200 leading-none">{peer.name}</h4>
                        <span className="text-[10px] text-slate-500 truncate">{peer.college}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 italic">"{peer.headline}"</p>
                      
                     
                      <div className="flex items-center gap-3 text-[10px] mt-1.5 flex-wrap">
                        <span className="text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                          Teaches: {peer.skillsOffered.slice(0, 2).join(", ")}
                        </span>
                        <span className="text-purple-400 font-semibold bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                          Wants: {peer.skillsWanted.slice(0, 2).join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                 
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t border-brand-border/40 md:border-0 pt-3 md:pt-0 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-brand-primary-hover flex items-center gap-1 justify-end leading-none">
                        {score}% <span className="text-[10px] text-slate-500 font-sans">Match</span>
                      </div>
                      <p className="text-[9px] text-slate-500 max-w-[150px] line-clamp-1 mt-1 hidden md:block">
                        {explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => !isConnected && onConnectPeer(peer.id)}
                      disabled={isConnected}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isConnected
                          ? "bg-brand-sec-bg text-slate-500 border border-brand-border/50 cursor-not-allowed"
                          : "bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md shadow-brand-primary/10 transform active:scale-95"
                      }`}
                    >
                      {isConnected ? "Pending Setup" : "Connect Peer"}
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-secondary" /> Swap Goals & Actions
          </h3>

          <div className="space-y-6 rounded-[1.4rem] border border-brand-border/50 bg-gradient-to-br from-brand-card/70 via-brand-card/60 to-brand-sec-bg/70 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.2)] soft-3d">
            
           
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Swap Track</h4>
              <div className="p-3.5 rounded-[1rem] bg-brand-bg/50 border border-brand-border flex items-center justify-between glow-chip">
                <div>
                  <div className="text-xs font-bold text-slate-200">TypeScript Roadmap</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Assigned by Syncy AI</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-brand-accent">65% Done</div>
                </div>
              </div>
            </div>

          
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Session Swaps</h4>
              
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-brand-bg/40 border border-brand-border/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-300">UX Design Guidelines Swap</h5>
                    <p className="text-[10px] text-slate-500">With Meera Nair • Tomorrow, 4:00 PM</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand-bg/40 border border-brand-border/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-300">Python Loops & Scrapers</h5>
                    <p className="text-[10px] text-slate-500">With Rohan Verma • Jul 18, 11:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

       
            <div className="p-4 rounded-[1rem] bg-gradient-to-tr from-brand-primary/10 to-brand-accent/10 border border-brand-primary/30 relative overflow-hidden group soft-3d ambient-sheen">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-accent" /> Need Swap Icebreakers?
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 mb-3">Ask Syncy AI to draft perfect conversation starters based on your matches' profiles.</p>
              <button
                onClick={() => onNavigateTab("ai")}
                className="text-[11px] font-bold text-brand-primary-hover hover:text-white transition-colors flex items-center gap-1 group-hover:underline"
              >
                Chat with Syncy <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
