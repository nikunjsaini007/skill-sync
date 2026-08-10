import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { 
  Zap, 
  Sparkles, 
  CheckCircle, 
  MessageSquare, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  Award,
  BookOpen,
  Plus,
  Check,
  X,
  UserCheck
} from "lucide-react";
import { UserProfile, Connection } from "@/lib/types";
import { calculateMatchScore } from "@/lib/utils";

interface DashboardViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  connections: Connection[];
  onNavigateTab: (tab: string) => void;
  onConnectPeer: (peerId: string) => void;
}

interface SwapAction {
  id: string;
  text: string;
  done: boolean;
}

interface AiMatch {
  score: number;
  explanation: string;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function DashboardView({ currentUser, users, connections, onNavigateTab, onConnectPeer }: DashboardViewProps) {

  const [aiMatches, setAiMatches] = useState<Record<string, AiMatch>>({});
  const [syncyLoading, setSyncyLoading] = useState(false);

  useEffect(() => {
    if (!users.length) return;
    let cancelled = false;
    setSyncyLoading(true);
    (async () => {
      try {
        const res = await fetch("/api/ai/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: {
              name: currentUser.name,
              skillsOffered: currentUser.skillsOffered,
              skillsWanted: currentUser.skillsWanted,
              experience: currentUser.experience,
              learningGoals: currentUser.learningGoals
            },
            peers: users.slice(0, 15).map(peer => ({
              id: peer.id,
              name: peer.name,
              headline: peer.headline,
              skillsOffered: peer.skillsOffered,
              skillsWanted: peer.skillsWanted,
              experience: peer.experience,
              learningGoals: peer.learningGoals
            }))
          })
        });
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.matches)) {
          const map: Record<string, AiMatch> = {};
          data.matches.forEach((m: any) => {
            if (m && m.id) {
              map[m.id] = {
                score: Math.min(98, Math.max(30, Math.round(Number(m.score) || 0))),
                explanation: String(m.reason || "")
              };
            }
          });
          if (Object.keys(map).length > 0) setAiMatches(map);
        }
      } catch (e) {
        console.error("Syncy match suggestions failed:", e);
      } finally {
        if (!cancelled) setSyncyLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser, users]);

  const matches = useMemo(() =>
    users
      .map(peer => {
        const local = calculateMatchScore(currentUser, peer);
        const ai = aiMatches[peer.id];
        return {
          peer,
          score: ai ? ai.score : local.score,
          explanation: ai ? ai.explanation : local.explanation
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3),
    [users, aiMatches, currentUser]
  );

  const activeConnections = connections.filter(c => c.status === "accepted").length;
  const pendingRequests = connections.filter(c => c.status === "pending" && c.receiverId === currentUser.id).length;

  const acceptedPeers = useMemo(() =>
    connections
      .filter(c => c.status === "accepted")
      .map(c => users.find(u => u.id === (c.senderId === currentUser.id ? c.receiverId : c.senderId)))
      .filter((peer): peer is UserProfile => Boolean(peer)),
    [connections, users, currentUser.id]
  );

  const matchesCount = useCountUp(users.length);
  const swapsCount = useCountUp(activeConnections);
  const pendingCount = useCountUp(pendingRequests);
  const ratingCount = useCountUp(currentUser.rating || 5);

  const TRACK_KEY = `skillsync-swaptrack-${currentUser.id}`;

  function loadTrack(): { title: string; actions: SwapAction[] } {
    try {
      const raw = localStorage.getItem(TRACK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.title === "string") {
          return {
            title: parsed.title,
            actions: Array.isArray(parsed.actions) ? parsed.actions : []
          };
        }
      }
    } catch {}
    const goal = currentUser.learningGoals?.trim() || "";
    return {
      title: goal.length > 60 ? `${goal.slice(0, 60)}…` : goal || `Master ${currentUser.skillsWanted?.[0] || "a new skill"}`,
      actions: (currentUser.skillsWanted || []).slice(0, 3).map((skill, i) => ({
        id: `seed-${i}`,
        text: `Learn ${skill}`,
        done: false
      }))
    };
  }

  const [track, setTrack] = useState<{ title: string; actions: SwapAction[] }>(loadTrack);
  const [newAction, setNewAction] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(TRACK_KEY, JSON.stringify(track));
    } catch {}
  }, [track, TRACK_KEY]);

  const toggleAction = (id: string) =>
    setTrack(prev => ({
      ...prev,
      actions: prev.actions.map(a => (a.id === id ? { ...a, done: !a.done } : a))
    }));

  const addAction = () => {
    const text = newAction.trim();
    if (!text) return;
    setTrack(prev => ({
      ...prev,
      actions: [...prev.actions, { id: `a-${Date.now()}`, text, done: false }]
    }));
    setNewAction("");
  };

  const removeAction = (id: string) =>
    setTrack(prev => ({ ...prev, actions: prev.actions.filter(a => a.id !== id) }));

  const completedActions = track.actions.filter(a => a.done).length;
  const progressPct = track.actions.length ? Math.round((completedActions / track.actions.length) * 100) : 0;

  return (
    <div id="dashboard-view" className="space-y-8 p-6 max-w-6xl mx-auto font-sans">
      
     
      <div className="hero-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-[1.8rem] p-6 soft-3d">
        <div>
          <h1 className="text-3xl font-bold font-display text-white bg-gradient-to-r from-white via-sky-100 to-brand-primary-hover bg-clip-text text-transparent">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Your next useful swap is waiting. Keep your learning moving.
          </p>
        </div>
        <div className="flex items-center gap-3">
         
          <span className="rounded-2xl border border-brand-border/40 bg-brand-sec-bg px-3 py-1.5 text-xs font-mono text-slate-500">
            UTC: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

  
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
       
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between soft-3d group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matches Found</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{Math.round(matchesCount)}</div>
            <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4 new recommendations
            </p>
          </div>
        </div>

      
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between soft-3d group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Swaps</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{Math.round(swapsCount)}</div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              In-session exchange tracks
            </p>
          </div>
        </div>

    
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between soft-3d group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{Math.round(pendingCount)}</div>
            <p className="text-[10px] text-amber-400 mt-1 font-semibold">
              Needs your confirmation
            </p>
          </div>
        </div>

        
        <div className="p-5 rounded-2xl bg-brand-card/45 border border-brand-border/50 flex flex-col justify-between soft-3d group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Trust Rating</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-display text-white">{ratingCount.toFixed(1)} ★</div>
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
              {Object.keys(aiMatches).length > 0 && (
                <span className="text-[9px] font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/30 px-1.5 py-0.5 rounded">
                  Syncy AI
                </span>
              )}
              {syncyLoading && (
                <span className="text-[9px] font-mono text-slate-500 animate-pulse">analyzing…</span>
              )}
            </h3>
            <button 
              onClick={() => onNavigateTab("discover")} 
              className="text-xs font-semibold text-brand-primary-hover hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
            >
              Discover all peers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {matches.length === 0 ? (
            <div className="p-6 rounded-[1.4rem] border border-brand-border/50 bg-brand-card/40 text-center soft-3d">
              <p className="text-sm text-slate-400">No peers onboarded yet. Invite a friend to start swapping skills!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map(({ peer, score, explanation }) => {
            
                const existingConn = connections.find(c => 
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
                          <span className="text-blue-400 font-semibold bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
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

                      {existingConn ? (
                        <button
                          disabled
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-not-allowed ${
                            existingConn.status === "accepted"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-brand-sec-bg text-slate-500 border border-brand-border/50"
                          }`}
                        >
                          {existingConn.status === "accepted" ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Synced
                            </>
                          ) : (
                            "Pending Setup"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => onConnectPeer(peer.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md shadow-brand-primary/10 transform active:scale-95 cursor-pointer"
                        >
                          Connect Peer
                        </button>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      
        <div className="space-y-6">
          <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-secondary" /> Swap Goals & Actions
          </h3>

          <div className="space-y-6 rounded-[1.4rem] border border-brand-border/50 bg-gradient-to-br from-brand-card/70 via-brand-card/60 to-brand-sec-bg/70 p-6 shadow-[0_16px_40px_rgba(2,6,23,0.2)] soft-3d">
            
           
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Swap Track</h4>
              <div className="p-3.5 rounded-[1rem] bg-brand-bg/50 border border-brand-border glow-chip">
                <div className="flex items-center justify-between gap-3">
                  <input
                    value={track.title}
                    onChange={e => setTrack(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Name your swap track..."
                    aria-label="Swap track name"
                    className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none w-full min-w-0 placeholder:text-slate-600"
                  />
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-brand-accent">{progressPct}% Done</div>
                  </div>
                </div>
                <div className="mt-2.5 h-1.5 rounded-full bg-brand-border/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent relative overflow-hidden transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer-line_2.2s_ease-in-out_infinite]" />
                  </div>
                </div>

                {track.actions.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {track.actions.map(action => (
                      <div key={action.id} className="group/action flex items-center gap-2">
                        <button
                          onClick={() => toggleAction(action.id)}
                          aria-label={action.done ? "Mark as not done" : "Mark as done"}
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                            action.done
                              ? "bg-brand-primary border-brand-primary"
                              : "border-brand-border hover:border-brand-primary/50"
                          }`}
                        >
                          {action.done && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`text-[11px] flex-1 min-w-0 ${action.done ? "text-slate-600 line-through" : "text-slate-300"}`}>
                          {action.text}
                        </span>
                        <button
                          onClick={() => removeAction(action.id)}
                          aria-label="Remove action"
                          className="text-slate-600 hover:text-rose-400 opacity-0 group-hover/action:opacity-100 transition-opacity shrink-0 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={newAction}
                    onChange={e => setNewAction(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") addAction();
                    }}
                    placeholder="Add a swap goal or action..."
                    aria-label="Add a swap goal or action"
                    className="flex-1 bg-brand-bg/60 border border-brand-border/60 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-primary/50 min-w-0"
                  />
                  <button
                    onClick={addAction}
                    disabled={!newAction.trim()}
                    aria-label="Add action"
                    className="w-7 h-7 rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/30 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Session Swaps</h4>
              
              <div className="space-y-2.5">
                {acceptedPeers.length > 0 ? (
                  acceptedPeers.slice(0, 3).map(peer => (
                    <div key={peer.id} className="p-3 rounded-xl bg-brand-bg/40 border border-brand-border/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0 overflow-hidden">
                        <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-300 truncate">Skill Swap with {peer.name}</h5>
                        <p className="text-[10px] text-slate-500 truncate">
                          {peer.skillsOffered[0] || "Skills"} ⇄ {peer.skillsWanted[0] || "Learning"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-brand-bg/40 border border-brand-border/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-300">No active swaps yet</h5>
                      <p className="text-[10px] text-slate-500">Connect with a peer to start your first exchange.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

       
            <div className="p-4 rounded-[1rem] bg-gradient-to-tr from-brand-primary/10 to-brand-accent/10 border border-brand-primary/30 relative overflow-hidden group soft-3d ambient-sheen">
              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-accent" /> Need Swap Icebreakers?
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 mb-3">Ask Syncy AI to draft perfect conversation starters based on your matches' profiles.</p>
              <button
                onClick={() => onNavigateTab("ai")}
                className="text-[11px] font-bold text-brand-primary-hover hover:text-white transition-colors flex items-center gap-1 group-hover:underline cursor-pointer"
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
