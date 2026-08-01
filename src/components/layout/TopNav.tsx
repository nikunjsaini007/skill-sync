import { Bell, Menu, Sparkles } from "lucide-react";
import type { Notification, UserProfile } from "@/lib/types";

interface TopNavProps {
  currentUser: UserProfile;
  unreadNotifications: number;
  showNotificationsMenu: boolean;
  onToggleNotifications: () => void;
  notifications: Notification[];
  onClearNotifications: () => void;
  onOpenProfile: () => void;
  onMobileMenuToggle: () => void;
}

export default function TopNav({
  currentUser,
  unreadNotifications,
  showNotificationsMenu,
  onToggleNotifications,
  notifications,
  onClearNotifications,
  onOpenProfile,
  onMobileMenuToggle,
}: TopNavProps) {
  return (
    <header id="top-nav" className="h-16 border-b border-brand-border/40 px-6 flex items-center justify-between bg-brand-sec-bg/15 shrink-0 relative z-40">

      <button
        onClick={onMobileMenuToggle}
        className="md:hidden text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden sm:flex items-center gap-3 justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 shadow-[0_0_25px_rgba(16,185,129,0.15)] backdrop-blur-md">

        <div className="relative flex h-3 w-3 items-center justify-center">

          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

          <span className="absolute h-4 w-4 rounded-full bg-emerald-400/30 blur-sm animate-pulse" />

          <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
        </div>

        <span className="text-xs font-semibold tracking-wide text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]">
          Syncy Intelligence Online
        </span>

      </div>

      <div className="md:hidden flex items-center space-x-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-base font-bold text-white font-display">SkillSync</span>
      </div>

      <div className="flex items-center space-x-4">

        <div className="relative">
          <button
            id="btn-bell"
            onClick={onToggleNotifications}
            className={`w-9 h-9 rounded-xl border border-brand-border/60 flex items-center justify-center hover:bg-brand-card/50 transition-all ${unreadNotifications > 0 ? "text-brand-primary" : "text-slate-400 hover:text-slate-200 cursor-pointer"
              }`}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-brand-bg cursor-pointer">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotificationsMenu && (
            <div id="notifications-menu" className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-brand-card border border-brand-border shadow-2xl p-4 space-y-3 animate-fadeIn cursor-pointer">
              <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
                <h4 className="text-xs font-bold text-slate-200">Sync Notifications</h4>
                <button
                  onClick={onClearNotifications}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map(not => (
                    <div key={not.id} className="p-2.5 rounded-xl bg-brand-bg/50 border border-brand-border/40 text-[11px] leading-relaxed">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{not.title}</span>
                        <span className="text-[8px] text-slate-500 font-mono">
                          {new Date(not.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{not.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-600 text-center py-6">No notifications active.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-brand-primary/30 cursor-pointer"
        >
          <img src={currentUser.avatar} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
}
