import {
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import type { Connection, Message, UserProfile } from "../lib/types";
import { db } from "./firebase";

export function subscribeToFirebaseData(
  userId: string,
  callbacks: {
    profile: (profile: UserProfile) => void;
    users: (users: UserProfile[]) => void;
    connections: (connections: Connection[]) => void;
    messages: (messages: Message[]) => void;
  }
) {
  if (!db) return () => {};
  const stopProfile = onSnapshot(doc(db, "users", userId), snapshot => {
    if (snapshot.exists()) callbacks.profile(snapshot.data() as UserProfile);
  });
  const stopUsers = onSnapshot(
    query(collection(db, "users"), where("isOnboarded", "==", true)),
    snapshot =>
      callbacks.users(
        snapshot.docs
          .map(item => item.data() as UserProfile)
          .filter(user => user.id !== userId)
      )
  );
  let sentConnections: Connection[] = [];
  let receivedConnections: Connection[] = [];
  const publishConnections = () =>
    callbacks.connections([...sentConnections, ...receivedConnections]);
  const stopSent = onSnapshot(
    query(collection(db, "connections"), where("senderId", "==", userId)),
    sent => {
      sentConnections = sent.docs.map(item => ({ id: item.id, ...item.data() } as Connection));
      publishConnections();
    }
  );
  const stopReceived = onSnapshot(
    query(collection(db, "connections"), where("receiverId", "==", userId)),
    received => {
      receivedConnections = received.docs.map(item => ({ id: item.id, ...item.data() } as Connection));
      publishConnections();
    }
  );
  const stopMessages = onSnapshot(
    query(collection(db, "messages"), where("participantIds", "array-contains", userId)),
    snapshot =>
      callbacks.messages(
        snapshot.docs.map(item => ({
          id: item.id,
          ...item.data(),
          createdAt:
            item.data().createdAt instanceof Timestamp
              ? item.data().createdAt.toDate().toISOString()
              : item.data().createdAt,
        } as Message))
      )
  );
  return () => {
    stopProfile();
    stopUsers();
    stopSent();
    stopReceived();
    stopMessages();
  };
}
