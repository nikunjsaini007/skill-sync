import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PhoneOff, PhoneMissed, PhoneCall } from "lucide-react";
import type { CallRole, CallStatus, CallType, UserProfile } from "../types";
import { db } from "../firebase";
import { deleteCallDoc, subscribeIncomingCalls, transitionCallStatus } from "./signaling";
import { fallbackUserProfile } from "./peer";
import IncomingCallPopup from "../components/IncomingCallPopup";
import CallScreen from "../components/CallScreen";

export interface ActiveCall {
  callId: string;
  peerId: string;
  type: CallType;
  role: CallRole;
}

export interface IncomingCall {
  callId: string;
  callerId: string;
  type: CallType;
  receivedAt: number;
}

export interface CallEvent {
  status: CallStatus;
  peerId: string;
  type: CallType;
  message?: string;
}

interface CallContextValue {
  activeCall: ActiveCall | null;
  incomingCall: IncomingCall | null;
  startCall: (peerId: string, type: CallType) => void;
  acceptIncomingCall: () => void;
  declineIncomingCall: () => void;
  timeoutIncomingCall: () => void;
}

const CallContext = createContext<CallContextValue | null>(null);

interface CallProviderProps {
  currentUser: UserProfile;
  users: UserProfile[];
  children: React.ReactNode;
}

const STALE_INCOMING_MS = 120_000;
const EVENT_TOAST_MS = 4_000;
const BUSY_CLEANUP_DELAY_MS = 1_500;

const EVENT_LABELS: Partial<Record<CallStatus, string>> = {
  ended: "Call ended",
  declined: "Call declined",
  missed: "Missed call",
  cancelled: "Call cancelled",
  busy: "Line busy",
  failed: "Call failed",
};

export function CallProvider({ currentUser, users, children }: CallProviderProps) {
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callEvent, setCallEvent] = useState<CallEvent | null>(null);

  const activeCallRef = useRef<ActiveCall | null>(null);
  const incomingCallRef = useRef<IncomingCall | null>(null);
  const usersRef = useRef(users);
  usersRef.current = users;

  const setActive = useCallback((call: ActiveCall | null) => {
    activeCallRef.current = call;
    setActiveCall(call);
  }, []);

  const setIncoming = useCallback((call: IncomingCall | null) => {
    incomingCallRef.current = call;
    setIncomingCall(call);
  }, []);

  useEffect(() => {
    let active = true;
    const unsub = subscribeIncomingCalls(
      currentUser.id,
      records => {
        if (!active) return;

        if (activeCallRef.current) {
          for (const record of records) {
            if (record.data.status === "ringing" && record.id !== activeCallRef.current.callId) {
              void transitionCallStatus(record.id, "ringing", "busy").then(ok => {
                if (ok) {
                  window.setTimeout(() => void deleteCallDoc(record.id), BUSY_CLEANUP_DELAY_MS);
                }
              });
            }
          }
          return;
        }

        const ringing = records.find(record => record.data.status === "ringing");
        if (!ringing) {
          if (incomingCallRef.current) setIncoming(null);
          return;
        }
        if (incomingCallRef.current?.callId === ringing.id) return;

        if (Date.now() - ringing.data.createdAt > STALE_INCOMING_MS) {
          void transitionCallStatus(ringing.id, "ringing", "missed");
          return;
        }

        setIncoming({
          callId: ringing.id,
          callerId: ringing.data.callerId,
          type: ringing.data.type,
          receivedAt: Date.now(),
        });
      },
      error => {
        if (!active) return;
        console.error("[calls] incoming listener error:", currentUser.id, error);
        const code = (error as { code?: string })?.code;
        setCallEvent({
          status: "failed",
          peerId: currentUser.id,
          type: "voice",
          message:
            code === "failed-precondition"
              ? `Incoming-call listener failed: Firestore needs the composite index on "calls" (calleeId ASC, status ASC). Create it in Firebase console > Firestore > Indexes and wait until Enabled.`
              : `Incoming-call listener failed (${error.message}). Make sure the "calls" security rules from firestore.rules are published in the Firebase console.`,
        });
        window.setTimeout(() => setCallEvent(null), EVENT_TOAST_MS);
      }
    );
    return () => {
      active = false;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const startCall = useCallback(
    (peerId: string, type: CallType) => {
      if (!db) {
        setCallEvent({ status: "failed", peerId, type });
        window.setTimeout(() => setCallEvent(null), EVENT_TOAST_MS);
        return;
      }
      if (activeCallRef.current) return;
      if (incomingCallRef.current) return;
      const callId = `call_${currentUser.id}_${peerId}_${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      setActive({ callId, peerId, type, role: "caller" });
    },
    [currentUser.id]
  );

  const acceptIncomingCall = useCallback(() => {
    const inc = incomingCallRef.current;
    if (!inc) return;
    setIncoming(null);
    setActive({ callId: inc.callId, peerId: inc.callerId, type: inc.type, role: "callee" });
  }, [setIncoming, setActive]);

  const declineIncomingCall = useCallback(() => {
    const inc = incomingCallRef.current;
    if (!inc) return;
    setIncoming(null);
    void transitionCallStatus(inc.callId, "ringing", "declined").then(ok => {
      if (ok) window.setTimeout(() => void deleteCallDoc(inc.callId), BUSY_CLEANUP_DELAY_MS);
      else void deleteCallDoc(inc.callId);
    });
  }, [setIncoming]);

  const timeoutIncomingCall = useCallback(() => {
    const inc = incomingCallRef.current;
    if (!inc) return;
    setIncoming(null);
    void transitionCallStatus(inc.callId, "ringing", "missed").then(ok => {
      if (ok) window.setTimeout(() => void deleteCallDoc(inc.callId), BUSY_CLEANUP_DELAY_MS);
      else void deleteCallDoc(inc.callId);
    });
  }, [setIncoming]);

  const handleTerminal = useCallback(
    (status: CallStatus, message?: string) => {
      const call = activeCallRef.current;
      if (!call) return;
      setActive(null);
      setCallEvent({ status, peerId: call.peerId, type: call.type, message });
      window.setTimeout(() => setCallEvent(null), EVENT_TOAST_MS);
    },
    [setActive]
  );

  const peerProfile = useMemo(() => {
    const id = activeCall?.peerId ?? incomingCall?.callerId ?? "";
    if (!id) return null;
    return users.find(user => user.id === id) ?? fallbackUserProfile(id);
  }, [users, activeCall, incomingCall]);

  const value: CallContextValue = useMemo(
    () => ({
      activeCall,
      incomingCall,
      startCall,
      acceptIncomingCall,
      declineIncomingCall,
      timeoutIncomingCall,
    }),
    [activeCall, incomingCall, startCall, acceptIncomingCall, declineIncomingCall, timeoutIncomingCall]
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      {callEvent && <CallEventToast event={callEvent} users={users} />}
      {incomingCall && peerProfile && (
        <IncomingCallPopup
          call={incomingCall}
          peer={peerProfile}
          onAccept={acceptIncomingCall}
          onDecline={declineIncomingCall}
          onTimeout={timeoutIncomingCall}
        />
      )}
      {activeCall && peerProfile && (
        <CallScreen
          call={activeCall}
          peer={peerProfile}
          currentUser={currentUser}
          onTerminal={handleTerminal}
        />
      )}
    </CallContext.Provider>
  );
}

export function useCalls(): CallContextValue {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCalls must be used within a CallProvider");
  }
  return context;
}

function CallEventToast({ event, users }: { event: CallEvent; users: UserProfile[] }) {
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
