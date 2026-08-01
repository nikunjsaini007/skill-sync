import type { CallStatus } from "../../lib/types";

export const CALLS_COLLECTION = "calls";

export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const MISSED_CALL_TIMEOUT_MS = 30_000;
export const RESTART_DELAY_MS = 2_500;
export const RECONNECT_GRACE_MS = 12_000;
export const CLEANUP_DELAY_MS = 1_800;

export const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "user",
};

export const STALE_INCOMING_MS = 120_000;
export const EVENT_TOAST_MS = 4_000;
export const BUSY_CLEANUP_DELAY_MS = 1_500;

export const EVENT_LABELS: Partial<Record<CallStatus, string>> = {
  ended: "Call ended",
  declined: "Call declined",
  missed: "Missed call",
  cancelled: "Call cancelled",
  busy: "Line busy",
  failed: "Call failed",
};
