import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export async function sendFirebaseMessage(
  connectionId: string,
  senderId: string,
  participantIds: string[],
  text: string,
  imageUrls: string[] = []
) {
  if (!db) throw new Error("Firebase is not configured.");
  await addDoc(collection(db, "messages"), {
    connectionId,
    senderId,
    participantIds,
    text,
    imageUrls,
    createdAt: new Date().toISOString(),
    read: false,
  });
}
