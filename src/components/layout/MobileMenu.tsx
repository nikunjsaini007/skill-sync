import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-brand-bg/95 flex flex-col p-6 space-y-6 md:hidden">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-white font-display">Menu</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-center space-y-4 cursor-pointer">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`py-3 text-lg font-bold text-left border-b border-brand-border/40 ${activeTab === item.id ? "text-brand-primary" : "text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="py-3 text-red-400 font-bold text-center border border-red-500/25 rounded-xl bg-red-500/5"
      >
        Log Out Session
      </button>
    </div>
  );
}
