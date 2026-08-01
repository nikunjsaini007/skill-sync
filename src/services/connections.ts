import { addDoc, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import type { Connection } from "../lib/types";
import { db } from "./firebase";

export async function createFirebaseConnection(senderId: string, receiverId: string) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "connections"), { senderId, receiverId, status: "pending", createdAt: new Date().toISOString() });
}

export async function updateFirebaseConnection(id: string, status: Connection["status"]) {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "connections", id), { status });
}

export async function removeFirebaseConnection(id: string) {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "connections", id));
}
