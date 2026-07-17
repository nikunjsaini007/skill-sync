import { useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, Check, Zap, Sparkles, Star, UserCheck } from "lucide-react";
import { UserProfile, Connection } from "../types";
import { MOCK_USERS, calculateMatchScore } from "../data";

interface DiscoverViewProps {
  currentUser: UserProfile;
  connections: Connection[];
  onConnectPeer: (peerId: string) => void;
  onViewPeerProfile: (peer: UserProfile) => void;
}

export default function DiscoverView({ currentUser, connections, onConnectPeer, onViewPeerProfile }: DiscoverViewProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique colleges from mock data
  const colleges = Array.from(new Set(MOCK_USERS.map(u => u.college)));

  // Extract some common skills for the filter dropdown
  const skillsToFilter = [
    "Python", "React", "TypeScript", "Node.js", "Figma", 
    "UI/UX Design", "Machine Learning", "Video Editing", "Flutter", "SEO Optimization"
  ];

  // Process matching scores and filters on the mock list
  const filteredUsers = MOCK_USERS.map(peer => {
    const { score, explanation } = calculateMatchScore(currentUser, peer);
    return {
      peer,
      score,
      explanation
    };
  })
  .filter(({ peer }) => {
    // Search query matches name, headline, bio, or skills
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      peer.name.toLowerCase().includes(query) ||
      peer.headline.toLowerCase().includes(query) ||
      peer.bio.toLowerCase().includes(query) ||
      peer.skillsOffered.some(s => s.toLowerCase().includes(query)) ||
      peer.skillsWanted.some(s => s.toLowerCase().includes(query));

    // College filter
    const matchesCollege = !selectedCollege || peer.college === selectedCollege;

    // Skill filter (matches either offered or wanted skills)
    const matchesSkill = !selectedSkill || 
      peer.skillsOffered.some(s => s.toLowerCase() === selectedSkill.toLowerCase()) ||
      peer.skillsWanted.some(s => s.toLowerCase() === selectedSkill.toLowerCase());

    // Experience filter
    const matchesExperience = !selectedExperience || peer.experience === selectedExperience;

    return matchesSearch && matchesCollege && matchesSkill && matchesExperience;
  })
  // Sort by compatibility score descending by default
  .sort((a, b) => b.score - a.score);

  return (
    <div id="discover-view" className="space-y-6 p-6 max-w-6xl mx-auto font-sans">
      
      {/* Search Header and filters toggle */}
      <div className="hero-panel flex flex-col gap-4 rounded-[1.6rem] p-5 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-96 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="search-peers"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, skill or college..."
            className="w-full pl-10 pr-4 py-2.5 bg-brand-sec-bg/50 border border-brand-border/80 focus:border-brand-primary focus:outline-none rounded-xl text-xs placeholder:text-slate-600 text-slate-200 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              showFilters || selectedCollege || selectedSkill || selectedExperience
                ? "bg-brand-primary/15 text-brand-primary-hover border-brand-primary/40"
                : "bg-brand-sec-bg border-brand-border/80 text-slate-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters 
            {(selectedCollege || selectedSkill || selectedExperience) && (
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-4 rounded-[1.4rem] border border-brand-border/50 bg-brand-card/55 p-5 shadow-inner shadow-brand-primary/5 sm:grid-cols-3 soft-3d">
          {/* College Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="filter-college" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">College</label>
            <select
              id="filter-college"
              value={selectedCollege}
              onChange={e => setSelectedCollege(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none rounded-lg text-xs text-slate-300"
            >
              <option value="">All Institutions</option>
              {colleges.map((col, i) => (
                <option key={i} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {/* Skill Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="filter-skill" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skill Track</label>
            <select
              id="filter-skill"
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none rounded-lg text-xs text-slate-300"
            >
              <option value="">All Skills</option>
              {skillsToFilter.map((sk, i) => (
                <option key={i} value={sk}>{sk}</option>
              ))}
            </select>
          </div>

          {/* Experience level Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="filter-experience" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</label>
            <select
              id="filter-experience"
              value={selectedExperience}
              onChange={e => setSelectedExperience(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-border focus:border-brand-primary focus:outline-none rounded-lg text-xs text-slate-300"
            >
              <option value="">All Experience levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>
      )}

      {/* Peer Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(({ peer, score, explanation }) => {
            // Find existing connection if any
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
                className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[1.4rem] border border-brand-border/60 bg-gradient-to-br from-brand-card/75 via-brand-card/60 to-brand-sec-bg/70 p-5 shadow-[0_18px_45px_rgba(2,6,23,0.2)] soft-3d"
              >
                {/* Score badge absolute */}
                <div className="absolute top-4 right-4 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary-hover px-2.5 py-1 rounded-xl text-xs font-bold font-mono">
                  {score}% Match
                </div>

                {/* Profile Top info */}
                <div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onViewPeerProfile(peer)}
                      className="w-12 h-12 rounded-full overflow-hidden border border-brand-border hover:border-brand-primary/50 transition-colors cursor-pointer shrink-0"
                    >
                      <img src={peer.avatar} alt={peer.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                    <div className="min-w-0 pr-16">
                      <button 
                        onClick={() => onViewPeerProfile(peer)}
                        className="font-bold text-slate-200 hover:text-brand-primary-hover transition-colors leading-none truncate block cursor-pointer"
                      >
                        {peer.name}
                      </button>
                      <span className="text-[9px] text-slate-500 font-medium truncate block mt-1">{peer.college}</span>
                    </div>
                  </div>

                  {/* Rating / headline */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span className="font-bold text-slate-300">{peer.rating}</span>
                    <span className="text-slate-600">({peer.reviewsCount} reviews)</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed font-sans">
                    {peer.bio}
                  </p>
                </div>

                {/* Swap tracks list details */}
                <div className="space-y-3.5 border-t border-brand-border/40 pt-4 mt-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 block">Offers</span>
                    <div className="flex flex-wrap gap-1">
                      {peer.skillsOffered.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/5 text-emerald-300 border border-emerald-500/10">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-purple-400 block">Wants</span>
                    <div className="flex flex-wrap gap-1">
                      {peer.skillsWanted.slice(0, 3).map((sk, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-purple-500/5 text-purple-300 border border-purple-500/10">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer interactive button action */}
                <div className="mt-5 pt-3 border-t border-brand-border/30 flex items-center justify-between">
                  <button
                    onClick={() => onViewPeerProfile(peer)}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>

                  {existingConn ? (
                    <button
                      disabled
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-not-allowed ${
                        existingConn.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-brand-sec-bg text-slate-500 border border-brand-border/60"
                      }`}
                    >
                      {existingConn.status === "accepted" ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" /> Synced
                        </>
                      ) : (
                        "Pending Approval"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onConnectPeer(peer.id)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all transform active:scale-95 glow-chip"
                    >
                      Connect Sync
                    </button>
                  )}
                </div>

              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">No Match Combinations Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Try widening your filters or broadening your search queries to see other students.</p>
          </div>
        )}
      </div>

    </div>
  );
}
