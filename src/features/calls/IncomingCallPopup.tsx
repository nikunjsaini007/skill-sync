import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Phone, Video, PhoneOff, X } from "lucide-react";
import type { IncomingCall } from "./CallContext";
import type { UserProfile } from "../../lib/types";
import { startRingtone } from "./ringtone";

const RING_TIMEOUT_MS = 30_000;

interface IncomingCallPopupProps {
  call: IncomingCall;
  peer: UserProfile;
  onAccept: () => void;
  onDecline: () => void;
  onTimeout: () => void;
}

export default function IncomingCallPopup({
  call,
  peer,
  onAccept,
  onDecline,
  onTimeout,
}: IncomingCallPopupProps) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(RING_TIMEOUT_MS / 1000));
  const endedRef = useRef(false);

  useEffect(() => {
    const stop = startRingtone();
    return () => stop();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          window.clearInterval(interval);
          if (!endedRef.current) {
            endedRef.current = true;
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [onTimeout]);

  const handleAccept = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    onAccept();
  };

  const handleDecline = () => {
    if (endedRef.current) return;
    endedRef.current = true;
    onDecline();
  };

  const progress = Math.max(0, Math.min(100, (secondsLeft / (RING_TIMEOUT_MS / 1000)) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/80 p-4 backdrop-blur-md">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,101,242,0.12),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative w-full max-w-sm rounded-[2rem] border border-brand-border/70 bg-gradient-to-br from-brand-card via-brand-card/95 to-brand-sec-bg/90 p-8 text-center shadow-[0_30px_90px_rgba(2,6,23,0.55)] backdrop-blur-xl soft-3d"
      >
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-[2rem] bg-brand-border/40">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative mx-auto mb-5 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-brand-primary/40" />
          <span className="absolute -inset-3 rounded-full bg-brand-primary/10 blur-xl" />
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/25">
            <img
              src={peer.avatar}
              alt={peer.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold font-display text-white">{peer.name}</h3>
        <p className="mt-1 text-xs text-slate-400">{peer.college || "Skill Swapper"}</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-bg/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-primary-hover">
          {call.type === "video" ? (
            <Video className="h-3.5 w-3.5" />
          ) : (
            <Phone className="h-3.5 w-3.5" />
          )}
          Incoming {call.type === "video" ? "Video" : "Voice"} Call
        </div>

        <p className="mt-3 font-mono text-[10px] text-slate-500">
          {secondsLeft > 0 ? `Ringing for ${secondsLeft}s...` : "No longer ringing"}
        </p>

        <div className="mt-7 flex items-center justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDecline}
            className="flex h-14 w-14 flex-col items-center justify-center gap-1 text-white"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/90 shadow-lg shadow-red-500/30 transition-colors hover:bg-red-500">
              <PhoneOff className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-semibold text-red-400">Decline</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAccept}
            className="flex h-14 w-14 flex-col items-center justify-center gap-1 text-white"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/90 shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-500">
              {call.type === "video" ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
            </span>
            <span className="text-[9px] font-semibold text-emerald-400">Accept</span>
          </motion.button>
        </div>

        <button
          onClick={handleDecline}
          aria-label="Dismiss incoming call"
          className="absolute right-3 top-3 rounded-full border border-brand-border/50 bg-brand-bg/60 p-1.5 text-slate-500 transition-colors hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
}
