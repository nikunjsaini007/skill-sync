import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from "../lib/types";
import { auth, db, defaultProfile } from "./firebase";

export async function createFirebaseAccount(name: string, email: string, password: string) {
  if (!auth || !db) throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values to .env.");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  const profile = defaultProfile(credential.user.uid, name, credential.user.email || email);
  await setDoc(doc(db, "users", profile.id), profile);
  return profile;
}

export async function getFirebaseProfile(uid: string, fallbackName: string, email: string) {
  if (!db) throw new Error("Firebase is not configured.");
  const reference = doc(db, "users", uid); const snapshot = await getDoc(reference);
  if (snapshot.exists()) return snapshot.data() as UserProfile;
  const profile = defaultProfile(uid, fallbackName || "SkillSyncer", email);
  await setDoc(reference, profile); return profile;
}

export { signInWithEmailAndPassword, signOut };
