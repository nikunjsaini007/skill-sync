import { arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import type { UpdateData } from "firebase/firestore";
import { db } from "../../services/firebase";
import type { CallData, CallStatus } from "../../lib/types";
import { CALLS_COLLECTION as CALLS } from "./constants";

export interface CallRecord {
  id: string;
  data: CallData;
}

export interface CallPatch {
  status?: Exclude<CallStatus, "incoming">;
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

export async function createCallDoc(callId: string, call: CallData): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(doc(db, CALLS, callId), call);
}

export async function updateCallDoc(callId: string, patch: CallPatch): Promise<void> {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, CALLS, callId), patch as unknown as UpdateData<CallData>);
}

export async function deleteCallDoc(callId: string): Promise<void> {
  if (!db) return;
  try {
    await deleteDoc(doc(db, CALLS, callId));
  } catch {
    // The document may already be deleted by the other participant.
  }
}

export async function appendCallCandidates(
  callId: string,
  field: "callerCandidates" | "calleeCandidates",
  candidates: RTCIceCandidateInit[]
): Promise<void> {
  if (!db || candidates.length === 0) return;
  await updateDoc(doc(db, CALLS, callId), {
    [field]: arrayUnion(...candidates),
  } as unknown as UpdateData<CallData>);
}

export function subscribeCallDoc(
  callId: string,
  callback: (data: CallData | null) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) return () => {};
  return onSnapshot(
    doc(db, CALLS, callId),
    snapshot => {
      callback(snapshot.exists() ? (snapshot.data() as CallData) : null);
    },
    error => {
      onError?.(error);
    }
  );
}

export function subscribeIncomingCalls(
  userId: string,
  callback: (calls: CallRecord[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) return () => {};
  return onSnapshot(
    query(
      collection(db, CALLS),
      where("calleeId", "==", userId),
      where("status", "in", ["ringing", "connecting", "connected"])
    ),
    snapshot => {
      callback(
        snapshot.docs
          .filter(item => item.exists())
          .map(item => ({ id: item.id, data: item.data() as CallData }))
      );
    },
    error => {
      onError?.(error);
    }
  );
}

export async function transitionCallStatus(
  callId: string,
  from: Exclude<CallStatus, "incoming">,
  to: Exclude<CallStatus, "incoming">
): Promise<boolean> {
  if (!db) return false;
  const reference = doc(db, CALLS, callId);
  try {
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) return false;
    const data = snapshot.data() as CallData;
    if (data.status !== from) return false;
    await updateDoc(reference, { status: to } as unknown as UpdateData<CallData>);
    return true;
  } catch (error) {
    console.error("[calls] transitionCallStatus failed:", callId, from, "->", to, error);
    return false;
  }
}

export async function markCallConnected(callId: string): Promise<void> {
  if (!db) return;
  const reference = doc(db, CALLS, callId);
  try {
    const snapshot = await getDoc(reference);
    if (!snapshot.exists()) return;
    const data = snapshot.data() as CallData;
    if (data.status === "ringing" || data.status === "connecting") {
      await updateDoc(reference, {
        status: "connected",
        connectedAt: Date.now(),
      } as unknown as UpdateData<CallData>);
    }
  } catch (error) {
    console.error("[calls] markCallConnected failed:", callId, error);
  }
}

export async function callDocExists(callId: string): Promise<boolean> {
  if (!db) return false;
  const snapshot = await getDoc(doc(db, CALLS, callId));
  return snapshot.exists();
}
