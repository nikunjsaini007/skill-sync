import { doc, updateDoc } from "firebase/firestore";
import type { UserProfile } from "../lib/types";
import { db } from "./firebase";

export async function saveFirebaseProfile(profile: UserProfile) {
  if (!db) throw new Error("Firebase is not configured.");
  await updateDoc(doc(db, "users", profile.id), { ...profile });
}
