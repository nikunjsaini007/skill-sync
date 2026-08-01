import { PhoneOff, PhoneMissed, PhoneCall } from "lucide-react";
import type { UserProfile } from "../../lib/types";
import { EVENT_LABELS } from "./constants";
import { fallbackUserProfile } from "./peer";
import type { CallEvent } from "./CallContext";

export function CallEventToast({ event, users }: { event: CallEvent; users: UserProfile[] }) {
  const label = EVENT_LABELS[event.status];
  if (!label) return null;
  const peer = users.find(user => user.id === event.peerId) ?? fallbackUserProfile(event.peerId);

  const Icon =
    event.status === "missed" || event.status === "declined" || event.status === "busy"
      ? PhoneMissed
      : event.status === "failed"
        ? PhoneOff
        : PhoneCall;

  return (
    <div className="fixed left-1/2 top-5 z-[120] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-border/60 bg-brand-card/95 px-4 py-3 shadow-[0_18px_45px_rgba(2,6,23,0.45)] backdrop-blur-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-bg/60 text-slate-300">
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xs">
          <p className="font-bold text-slate-100">{label}</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            {event.message
              ? event.message
              : `${event.type === "video" ? "Video call" : "Voice call"} with ${peer.name}`}
          </p>
        </div>
      </div>
    </div>
  );
}
