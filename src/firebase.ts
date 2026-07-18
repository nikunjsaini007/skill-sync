import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, deleteDoc, onSnapshot, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Connection, Message, UserProfile } from "./types";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
const app = firebaseReady ? (getApps()[0] || initializeApp(config)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export const defaultProfile = (id: string, name: string, email: string): UserProfile => ({
  id, name, email,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "", bio: "", college: "", skillsOffered: [], skillsWanted: [], experience: "Intermediate",
  interests: "", learningGoals: "", isOnboarded: false, isPremium: false, rating: 5, reviewsCount: 0,
  achievements: ["Early Adopter"], createdAt: new Date().toISOString(),
});

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

export function subscribeToFirebaseData(userId: string, callbacks: { profile: (profile: UserProfile) => void; users: (users: UserProfile[]) => void; connections: (connections: Connection[]) => void; messages: (messages: Message[]) => void }) {
  if (!db) return () => {};
  const stopProfile = onSnapshot(doc(db, "users", userId), snapshot => { if (snapshot.exists()) callbacks.profile(snapshot.data() as UserProfile); });
  const stopUsers = onSnapshot(query(collection(db, "users"), where("isOnboarded", "==", true)), snapshot => callbacks.users(snapshot.docs.map(item => item.data() as UserProfile).filter(user => user.id !== userId)));
  let sentConnections: Connection[] = []; let receivedConnections: Connection[] = [];
  const publishConnections = () => callbacks.connections([...sentConnections, ...receivedConnections]);
  const stopSent = onSnapshot(query(collection(db, "connections"), where("senderId", "==", userId)), sent => { sentConnections = sent.docs.map(item => ({ id: item.id, ...item.data() } as Connection)); publishConnections(); });
  const stopReceived = onSnapshot(query(collection(db, "connections"), where("receiverId", "==", userId)), received => { receivedConnections = received.docs.map(item => ({ id: item.id, ...item.data() } as Connection)); publishConnections(); });
  const stopMessages = onSnapshot(query(collection(db, "messages"), where("participantIds", "array-contains", userId)), snapshot => callbacks.messages(snapshot.docs.map(item => ({ id: item.id, ...item.data(), createdAt: item.data().createdAt instanceof Timestamp ? item.data().createdAt.toDate().toISOString() : item.data().createdAt } as Message))));
  return () => { stopProfile(); stopUsers(); stopSent(); stopReceived(); stopMessages(); };
}

export async function saveFirebaseProfile(profile: UserProfile) { if (!db) throw new Error("Firebase is not configured."); await updateDoc(doc(db, "users", profile.id), { ...profile }); }
export async function createFirebaseConnection(senderId: string, receiverId: string) { if (!db) throw new Error("Firebase is not configured."); return addDoc(collection(db, "connections"), { senderId, receiverId, status: "pending", createdAt: new Date().toISOString() }); }
export async function updateFirebaseConnection(id: string, status: Connection["status"]) { if (!db) throw new Error("Firebase is not configured."); await updateDoc(doc(db, "connections", id), { status }); }
export async function removeFirebaseConnection(id: string) { if (!db) throw new Error("Firebase is not configured."); await deleteDoc(doc(db, "connections", id)); }
export async function sendFirebaseMessage(connectionId: string, senderId: string, participantIds: string[], text: string) { if (!db) throw new Error("Firebase is not configured."); await addDoc(collection(db, "messages"), { connectionId, senderId, participantIds, text, createdAt: new Date().toISOString(), read: false }); }
export { signInWithEmailAndPassword, signOut };
