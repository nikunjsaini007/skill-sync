import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  SwitchCamera,
  Maximize,
  Minimize,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { CallStatus, CallType } from "../../lib/types";
import type { ActiveCall } from "./CallContext";
import type { UserProfile } from "../../lib/types";
import { useCall } from "./useCall";

interface CallScreenProps {
  call: ActiveCall;
  peer: UserProfile;
  currentUser: UserProfile;
  onTerminal: (status: CallStatus, message?: string) => void;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function statusLabel(
  status: CallStatus,
  type: CallType,
  connectionState: RTCPeerConnectionState | null,
  elapsedSeconds: number
): string {
  switch (status) {
    case "ringing":
      return "Ringing...";
    case "incoming":
      return "Incoming call...";
    case "connecting":
      return "Connecting...";
    case "connected":
      if (connectionState === "disconnected") return "Reconnecting...";
      return formatDuration(elapsedSeconds);
    case "ended":
      return "Call ended";
    case "declined":
      return "Call declined";
    case "missed":
      return "Missed call";
    case "cancelled":
      return "Call cancelled";
    case "busy":
      return "Line busy";
    case "failed":
      return "Call failed";
    default:
      return type === "video" ? "Video call" : "Voice call";
  }
}

export default function CallScreen({ call, peer, currentUser, onTerminal }: CallScreenProps) {
  const callState = useCall({
    callId: call.callId,
    currentUserId: currentUser.id,
    peerId: call.peerId,
    type: call.type,
    role: call.role,
    autoAccept: call.role === "callee",
    onTerminal,
  });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (localVideoRef.current && callState.localStream) {
      localVideoRef.current.srcObject = callState.localStream;
    }
  }, [callState.localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && callState.remoteStream) {
      remoteVideoRef.current.srcObject = callState.remoteStream;
    }
  }, [callState.remoteStream]);

  useEffect(() => {
    if (remoteAudioRef.current && callState.remoteStream) {
      remoteAudioRef.current.srcObject = callState.remoteStream;
    }
  }, [callState.remoteStream]);

  const ringing = callState.status === "ringing" || callState.status === "incoming";
  const label = statusLabel(
    callState.status,
    call.type,
    callState.connectionState,
    callState.elapsedSeconds
  );

  const controlButton = (extra: string) =>
    `flex h-12 w-12 items-center justify-center rounded-full text-white keep-light-text transition-all hover:scale-105 active:scale-95 cursor-pointer ${extra}`;

  const isVideo = call.type === "video";

  return (
    <div className="fixed inset-0 z-[90] bg-brand-bg font-sans">
      {isVideo ? (
        <VideoCallLayout
          call={call}
          peer={peer}
          callState={callState}
          label={label}
          ringing={ringing}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          controlButton={controlButton}
        />
      ) : (
        <VoiceCallLayout
          call={call}
          peer={peer}
          callState={callState}
          label={label}
          ringing={ringing}
          remoteAudioRef={remoteAudioRef}
          controlButton={controlButton}
        />
      )}
    </div>
  );
}

interface LayoutProps {
  call: ActiveCall;
  peer: UserProfile;
  callState: ReturnType<typeof useCall>;
  label: string;
  ringing: boolean;
  controlButton: (extra: string) => string;
}

function CallControls({
  callState,
  controlButton,
  isVideo,
}: {
  callState: ReturnType<typeof useCall>;
  controlButton: (extra: string) => string;
  isVideo: boolean;
}) {

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={callState.toggleMute}
        aria-label={callState.isMuted ? "Unmute" : "Mute"}
        className={controlButton(
          callState.isMuted
            ? "bg-slate-600/90 shadow-lg"
            : "bg-brand-card shadow-lg shadow-brand-primary/20 border border-brand-border/60"
        )}
      >
        {callState.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      {isVideo && (
        <>
          <button
            onClick={callState.toggleCamera}
            aria-label={callState.isCameraOff ? "Turn camera on" : "Turn camera off"}
            className={controlButton(
              callState.isCameraOff
                ? "bg-slate-600/90 shadow-lg"
                : "bg-brand-card shadow-lg shadow-brand-primary/20 border border-brand-border/60"
            )}
          >
            {callState.isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          {callState.canSwitchCamera && (
            <button
              onClick={() => void callState.switchCamera()}
              aria-label="Switch camera"
              className={controlButton(
                "bg-brand-card shadow-lg shadow-brand-primary/20 border border-brand-border/60"
              )}
            >
              <SwitchCamera className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={callState.toggleFullscreen}
            aria-label="Toggle fullscreen"
            className={controlButton(
              "bg-brand-card shadow-lg shadow-brand-primary/20 border border-brand-border/60"
            )}
          >
            {callState.isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </>
      )}

      <button
        onClick={() => callState.endCall()}
        aria-label="End call"
        className={controlButton("bg-red-500/90 shadow-lg shadow-red-500/30 hover:bg-red-500")}
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
}

function ConnectionBadge({
  connectionState,
  label,
}: {
  connectionState: RTCPeerConnectionState | null;
  label: string;
}) {
  const disconnected = connectionState === "disconnected";
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${
        disconnected
          ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
      }`}
    >
      {disconnected ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
      <span>{label}</span>
    </div>
  );
}

function VideoCallLayout({
  call,
  peer,
  callState,
  label,
  ringing,
  localVideoRef,
  remoteVideoRef,
  controlButton,
}: LayoutProps & {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const showLocal =
    !ringing && callState.localStream && !callState.isCameraOff && call.type === "video";

  return (
    <div className="relative h-full w-full bg-black/60">
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          callState.remoteStream ? "opacity-100" : "opacity-0"
        }`}
      />

      <AnimatePresence>
        {!callState.remoteStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-bg via-brand-sec-bg to-brand-bg"
          >
            <div className="relative">
              <span className="absolute -inset-4 animate-ping rounded-full border border-brand-primary/30" />
              <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-brand-primary/50 shadow-2xl shadow-brand-primary/25">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold font-display text-white">{peer.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{label}</p>
            </div>
            {callState.error && (
              <p className="max-w-xs rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-center text-[10px] leading-relaxed text-red-400">
                {callState.error}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-brand-primary/40">
            <img
              src={peer.avatar}
              alt={peer.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{peer.name}</h4>
            <p className="text-[10px] text-slate-300">{call.type === "video" ? "Video" : "Voice"} call</p>
          </div>
        </div>
        <ConnectionBadge connectionState={callState.connectionState} label={label} />
      </div>

      {showLocal && (
        <div className="absolute bottom-28 right-4 overflow-hidden rounded-2xl border border-brand-border/70 shadow-2xl soft-3d">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-40 w-28 -scale-x-100 object-cover sm:h-44 sm:w-32"
          />
        </div>
      )}

      {!showLocal && callState.localStream && call.type === "video" && (
        <div className="absolute bottom-28 right-4 flex h-40 w-28 items-center justify-center rounded-2xl border border-brand-border/70 bg-brand-card/80 shadow-2xl sm:h-44 sm:w-32">
          <div className="text-center">
            <VideoOff className="mx-auto h-5 w-5 text-slate-500" />
            <p className="mt-1 text-[9px] text-slate-500">Camera off</p>
          </div>
        </div>
      )}

      {call.type === "video" && callState.degradedToAudio && (
        <div className="absolute left-1/2 top-16 w-64 -translate-x-1/2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-center text-[10px] leading-relaxed text-amber-400 backdrop-blur">
          Camera unavailable on your device — continuing with audio only.
        </div>
      )}

      {callState.error && callState.remoteStream && (
        <div className="absolute left-1/2 top-28 w-64 -translate-x-1/2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-center text-[10px] leading-relaxed text-red-400 backdrop-blur">
          {callState.error}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
        <CallControls
          callState={callState}
          controlButton={controlButton}
          isVideo={call.type === "video"}
        />
      </div>
    </div>
  );
}

function VoiceCallLayout({
  call,
  peer,
  callState,
  label,
  ringing,
  remoteAudioRef,
  controlButton,
}: LayoutProps & {
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-br from-brand-bg via-brand-sec-bg to-brand-bg p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(250,204,21,0.1),transparent_45%)]" />

      <audio ref={remoteAudioRef} autoPlay playsInline />

      <div className="relative mt-8 flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {ringing && <span className="absolute -inset-5 animate-ping rounded-full border border-brand-primary/40" />}
          <span className="absolute -inset-3 rounded-full bg-brand-primary/10 blur-xl" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-brand-primary/50 shadow-2xl shadow-brand-primary/25">
            <img
              src={peer.avatar}
              alt={peer.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold font-display text-white">{peer.name}</h3>
          <p className="mt-1 text-xs text-slate-400">{peer.college || "Skill Swapper"}</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
          <span className="rounded-full border border-brand-border/60 bg-brand-card/50 px-3 py-1 font-mono">
            {label}
          </span>
        </div>
        {callState.error && (
          <p className="max-w-xs rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-[10px] leading-relaxed text-red-400">
            {callState.error}
          </p>
        )}
      </div>

      <div className="relative mb-6 w-full max-w-xs">
        <CallControls
          callState={callState}
          controlButton={controlButton}
          isVideo={call.type === "video"}
        />
      </div>
    </div>
  );
}
