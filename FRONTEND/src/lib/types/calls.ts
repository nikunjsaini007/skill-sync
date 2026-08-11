export type CallType = "voice" | "video";

export type CallRole = "caller" | "callee";

export type CallStatus =
  | "ringing"
  | "incoming"
  | "connecting"
  | "connected"
  | "ended"
  | "declined"
  | "missed"
  | "cancelled"
  | "busy"
  | "failed";

export interface CallData {
  callerId: string;
  calleeId: string;
  type: CallType;
  status: Exclude<CallStatus, "incoming">;
  createdAt: number;
  offer?: RTCSessionDescriptionInit | null;
  offerRound?: number;
  answer?: RTCSessionDescriptionInit | null;
  answerRound?: number;
  callerCandidates?: RTCIceCandidateInit[];
  calleeCandidates?: RTCIceCandidateInit[];
  startedAt?: number | null;
  connectedAt?: number | null;
  endedAt?: number | null;
  endedBy?: string | null;
}
