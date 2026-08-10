import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import skillsyncLogo from "../../../assets/skillsyncLogo.png";

interface MobileMenuProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onClose: () => void;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "discover", label: "Discover" },
  { id: "connections", label: "Connections" },
  { id: "messages", label: "Messages" },
  { id: "ai", label: "Syncy AI" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export default function MobileMenu({ activeTab, onNavigate, onClose, onLogout }: MobileMenuProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-brand-bg/95 backdrop-blur-2xl flex flex-col p-6 space-y-8 md:hidden overflow-hidden"
      >
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <img
            src={skillsyncLogo}
            alt="SkillSync"
            className="h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors w-9 h-9 rounded-xl border border-brand-border/50 flex items-center justify-center hover:bg-brand-card/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 flex flex-col justify-center space-y-2.5">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.25 }}
                onClick={() => onNavigate(item.id)}
                className={`py-3 px-4 text-lg font-bold text-left rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? "text-white bg-gradient-to-r from-brand-primary/20 to-brand-accent/15 border-brand-primary/30 shadow-lg shadow-brand-primary/10"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-brand-card/40 hover:border-brand-border/40"
                }`}
              >
                <span className={isActive ? "text-brand-primary-hover" : ""}>{item.label}</span>
                {item.id === "ai" && (
                  <span className="ml-2 inline-flex items-center rounded-md bg-brand-accent/25 text-brand-accent text-[10px] px-1.5 py-0.5 font-bold font-mono align-middle">
                    AI
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.25 }}
          onClick={onLogout}
          className="py-3 text-red-400 font-bold text-center border border-red-500/25 rounded-2xl bg-red-500/5 hover:bg-red-500/15 transition-colors cursor-pointer"
        >
          Log Out Session
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
