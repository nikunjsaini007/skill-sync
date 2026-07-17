import { 
  LayoutDashboard, 
  Search, 
  Users, 
  MessageSquare, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  ShieldAlert,
  Flame,
  Star
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, currentUser, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "discover", label: "Discover", icon: Search },
    { id: "connections", label: "Connections", icon: Users, badgeKey: "connectionsCount" },
    { id: "messages", label: "Messages", icon: MessageSquare, badgeKey: "messagesCount" },
    { id: "ai", label: "AI Syncy", icon: Sparkles, highlight: true },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside id="app-sidebar" className="w-64 card-shell flex flex-col justify-between p-4 shrink-0 h-screen sticky top-0 hidden md:flex backdrop-blur-md z-30 rounded-r-[1.6rem]">
      
      {/* Branding & Premium badge */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 px-2 py-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-[0_10px_25px_rgba(88,101,242,0.25)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-display tracking-tight text-white leading-none">
              SkillSync
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">LEARN WITH FRIENDS</span>
          </div>
        </div>

        {/* Current user micro card */}
        <div className="p-3 rounded-[1rem] bg-brand-card/70 border border-brand-border/50 flex items-center gap-3 soft-3d">
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-brand-primary/30">
            <img src={currentUser.avatar} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</h4>
              {currentUser.isPremium && (
                <span className="shrink-0 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[8px] px-1 rounded font-bold uppercase tracking-wider">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 truncate">{currentUser.college}</p>
          </div>
        </div>

        {/* Menu List */}
        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group soft-3d ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 text-white border-l-2 border-brand-accent font-bold"
                      : "bg-brand-primary/10 text-brand-primary-hover border-l-2 border-brand-primary font-bold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-brand-card/30"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive 
                    ? item.highlight ? "text-brand-accent" : "text-brand-primary-hover"
                    : "text-slate-400 group-hover:text-slate-300"
                }`} />
                <span className="flex-1 text-left">{item.label}</span>
                
                {item.highlight && (
                  <span className="shrink-0 animate-pulse bg-brand-accent/25 text-brand-accent text-[9px] px-1.5 py-0.5 rounded font-bold font-mono">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="space-y-4">
        {/* Premium Upgrade call to action if free */}
        {!currentUser.isPremium && (
          <div className="p-3.5 rounded-[1.1rem] bg-gradient-to-br from-brand-card to-brand-bg border border-brand-primary/30 relative overflow-hidden soft-3d ambient-sheen">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary/5 rounded-full filter blur-md" />
            <h5 className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Try Premium
            </h5>
            <p className="text-[9px] text-slate-500 mt-1 mb-2.5">Get more matches and faster AI plans.</p>
            <button
              onClick={() => setActiveTab("settings")}
              className="w-full py-1.5 rounded-lg text-[10px] font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>

    </aside>
  );
}
