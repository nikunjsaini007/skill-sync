import { useState } from "react";
import { Settings, Shield, Bell, Key, RefreshCw, Star, Sparkles, Check, Trash2, Sliders } from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  currentUser: UserProfile;
  onUpdatePlan: (isPremium: boolean) => void;
  onResetData: () => void;
  onLogout: () => void;
}

export default function SettingsView({ currentUser, onUpdatePlan, onResetData, onLogout }: SettingsViewProps) {
  const [successMsg, setSuccessMsg] = useState("");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [themeMode, setThemeMode] = useState("dark"); 

  const handleTogglePremium = () => {
    setSuccessMsg("");
    const targetState = !currentUser.isPremium;
    onUpdatePlan(targetState);
    if (targetState) {
      setSuccessMsg("Success! Lifetime Premium Membership activated. Enjoy infinite matches and priority Syncy AI!");
    } else {
      setSuccessMsg("Plan updated. Downgraded to Standard Free tier.");
    }
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleWipeData = () => {
    if (window.confirm("Are you sure you want to reset all co-learning database states to defaults? This will wipe your simulated chats and onboarding profile.")) {
      onResetData();
    }
  };

  return (
    <div id="settings-view" className="space-y-6 p-6 max-w-3xl mx-auto font-sans pb-16">
      
    
      <div className="hero-panel rounded-[1.4rem] p-6">
        <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-primary" /> Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Control your preferences and keep the workspace simple.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

    
      <div className="p-6 rounded-[1.2rem] bg-gradient-to-tr from-brand-card to-brand-sec-bg border border-brand-border/80 relative overflow-hidden soft-3d">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full filter blur-xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h3 className="text-lg font-bold font-display text-white">Premium Pass</h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Unlock more matches and get faster AI help for your learning path.
            </p>
            <div className="pt-2 text-xs text-slate-300">
              Current Plan:{" "}
              <span className={`font-bold ${currentUser.isPremium ? "text-yellow-400" : "text-slate-500"}`}>
                {currentUser.isPremium ? "PREMIUM PLAN" : "FREE PLAN"}
              </span>
            </div>
          </div>

          <button
            onClick={handleTogglePremium}
            className={`px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md transform active:scale-95 shrink-0 ${
              currentUser.isPremium
                ? "bg-brand-bg text-red-400 border border-red-500/25 hover:bg-red-500/5"
                : "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:opacity-90 text-slate-950 font-extrabold shadow-yellow-500/20"
            }`}
          >
            {currentUser.isPremium ? "Downgrade Plan" : "Activate Premium For Free"}
          </button>
        </div>
      </div>

     
      <div className="grid sm:grid-cols-2 gap-6">
        
        {/* Workspace controls */}
        <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 space-y-4 soft-3d">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-4 h-4" /> Workspace Preferences
          </h4>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400">Interface Theme</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setThemeMode("dark")}
                className={`py-2 rounded-lg text-xs font-bold transition-colors border ${
                  themeMode === "dark"
                    ? "bg-brand-primary/10 border-brand-primary text-brand-primary-hover"
                    : "bg-brand-bg border-brand-border text-slate-500"
                }`}
              >
                Dark Cosmic (Classic)
              </button>
              <button
                onClick={() => alert("SkillSync's premium Dark Cosmic theme matches our startup founders visual brand. Light mode is currently disabled.")}
                className="py-2 rounded-lg text-xs font-medium bg-brand-bg/50 border border-brand-border/30 text-slate-700 cursor-not-allowed"
              >
                Light Minimal (PRO)
              </button>
            </div>
          </div>

        
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-300">Public Indexing</div>
                <p className="text-[10px] text-slate-500">Allow other colleges to discover my swaps</p>
              </div>
              <input
                type="checkbox"
                checked={privacyMode}
                onChange={e => setPrivacyMode(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary accent-brand-primary focus:ring-brand-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-300">Email Sync Alerts</div>
                <p className="text-[10px] text-slate-500">Get emails for incoming connection approvals</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-brand-border text-brand-primary accent-brand-primary focus:ring-brand-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

       
        <div className="p-5 rounded-[1.1rem] bg-brand-card/45 border border-brand-border/50 space-y-4 flex flex-col justify-between soft-3d">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-red-400" /> Database Administration
            </h4>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              You are running inside a sandboxed client-side node. You can wipe all local storage databases (including matches, messaging chats, ratings, and profile onboarding details) to start fresh.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-brand-border/30">
            <button
              onClick={handleWipeData}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe Local Storage Data
            </button>

            <button
              onClick={onLogout}
              className="w-full py-2.5 rounded-xl text-xs font-semibold hover:bg-brand-bg text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Log Out of Session
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
