import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { Connection, Message, Notification, UserProfile } from "@/lib/types";
import { CONNECTIONS_KEY, MESSAGES_KEY, NOTIFICATIONS_KEY, USER_KEY } from "@/lib/constants";
import { seedConnections, seedMessages, seedNotifications } from "@/data";
import { auth, firebaseReady } from "@/services/firebase";
import {
  createFirebaseAccount,
  getFirebaseProfile,
  signInWithEmailAndPassword,
  signOut,
} from "@/services/auth";
import { saveFirebaseProfile } from "@/services/profile";
import {
  createFirebaseConnection,
  removeFirebaseConnection,
  updateFirebaseConnection,
} from "@/services/connections";
import { sendFirebaseMessage } from "@/services/messages";
import { subscribeToFirebaseData } from "@/services/realtime";
import { CallProvider } from "@/features/calls";
import LandingPage from "@/pages/LandingPage";
import Onboarding from "@/pages/Onboarding";
import DashboardPage from "@/app/DashboardPage";
import AuthModal from "@/features/auth/AuthModal";
import Courses from "@/pages/Courses";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";

export default function App() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(CONNECTIONS_KEY);
    if (saved) return JSON.parse(saved);

    return seedConnections;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) return JSON.parse(saved);

    return seedMessages;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) return JSON.parse(saved);
    return seedNotifications;
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeChatPeerId, setActiveChatPeerId] = useState<string | null>(null);
  const [activePeerProfile, setActivePeerProfile] = useState<UserProfile | null>(null);

  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!firebaseReady || !auth) return;
    return onAuthStateChanged(auth, async user => {
      if (!user) {
        setCurrentUser(null);
        return;
      }
      try {
        setCurrentUser(await getFirebaseProfile(user.uid, user.displayName || "SkillSyncer", user.email || ""));
      } catch (error: any) {
        setAuthError(error.message);
      }
    });
  }, []);

  useEffect(() => {
    if (!firebaseReady || !currentUser) return;
    return subscribeToFirebaseData(currentUser.id, {
      profile: setCurrentUser,
      users: setUsers,
      connections: setConnections,
      messages: setMessages,
    });
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (activeChatPeerId) {
      const stillConnected = connections.some(
        c =>
          c.status === "accepted" &&
          ((c.senderId === currentUser?.id && c.receiverId === activeChatPeerId) ||
            (c.senderId === activeChatPeerId && c.receiverId === currentUser?.id))
      );
      if (!stillConnected) {
        setActiveChatPeerId(null);
      }
    }
  }, [connections, activeChatPeerId, currentUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill out both email and password fields.");
      return;
    }

    try {
      if (!firebaseReady || !auth) throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values to .env.");
      const profile =
        authMode === "signup"
          ? await createFirebaseAccount(authName.trim(), authEmail.trim(), authPassword)
          : await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword).then(credential =>
              getFirebaseProfile(credential.user.uid, credential.user.displayName || "SkillSyncer", credential.user.email || authEmail)
            );
      setCurrentUser(profile);
      setAuthMode(null);
      setAuthPassword("");
    } catch (error: any) {
      setAuthError(error.message || "Could not sign you in.");
    }
  };

  const handleStartDemo = () => {
    const demoUser: UserProfile = {
      id: "current-user-id",
      name: "Sanjay Rao",
      email: "sanjay@iitd.ac.in",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      headline: "I build web apps and want to learn UI design",
      bio: "I am a student who enjoys building simple web products. I can explain React, TypeScript, and Node basics. I want to get better at design and make cleaner app screens.",
      college: "IIT Delhi",
      skillsOffered: ["React", "TypeScript", "Node.js"],
      skillsWanted: ["Figma", "UI/UX Design"],
      experience: "Advanced",
      interests: "Side projects, clean interfaces, student startups",
      learningGoals: "Create better-looking product demos.",
      isOnboarded: true,
      isPremium: false,
      rating: 5.0,
      reviewsCount: 3,
      achievements: ["Early Adopter", "Proactive Swapper"]
    };
    setCurrentUser(demoUser);
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    const isEditing = currentUser?.isOnboarded === true;
    if (!firebaseReady || !auth?.currentUser) {
      setCurrentUser({ ...profile, id: currentUser?.id || profile.id });
      setActiveTab(isEditing ? "profile" : "dashboard");
      return;
    }
    try {
      await saveFirebaseProfile({ ...profile, id: currentUser!.id });
      setCurrentUser({ ...profile, id: currentUser!.id });
      setActiveTab(isEditing ? "profile" : "dashboard");
    } catch (error: any) {
      alert(error.message || "We couldn't save your profile. Please try again.");
    }
  };

  const handleLogout = () => {
    if (firebaseReady && auth) signOut(auth);
    setCurrentUser(null);
    setActiveTab("dashboard");
    setActiveChatPeerId(null);
    setActivePeerProfile(null);
  };

  const handleConnectPeer = (peerId: string) => {
    createFirebaseConnection(currentUser!.id, peerId).catch(error => alert(error.message));

    const peerName = users.find(u => u.id === peerId)?.name || "Peer";
    const newNot: Notification = {
      id: `not-${Date.now()}`,
      userId: currentUser!.id,
      type: "system",
      title: "Request Sent",
      content: `Your sync connection request has been sent to ${peerName}.`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const handleAcceptConnection = (connId: string) => {
    updateFirebaseConnection(connId, "accepted").catch(error => alert(error.message));

    const conn = connections.find(c => c.id === connId);
    if (conn) {
      const peerId = conn.senderId === currentUser!.id ? conn.receiverId : conn.senderId;
      const peerName = users.find(u => u.id === peerId)?.name || "Peer";

      const newNot: Notification = {
        id: `not-${Date.now()}`,
        userId: currentUser!.id,
        type: "connection_accept",
        title: "Connection Accepted!",
        content: `You are now connected with ${peerName}. Chat space is unlocked!`,
        createdAt: new Date().toISOString(),
        read: false
      };
      setNotifications(prev => [newNot, ...prev]);
    }
  };

  const handleRejectConnection = (connId: string) => {
    updateFirebaseConnection(connId, "rejected").catch(error => alert(error.message));
  };

  const handleRemoveConnection = (connId: string) => {
    if (window.confirm("Are you sure you want to remove this swapper connection?")) {
      removeFirebaseConnection(connId).catch(error => alert(error.message));
    }
  };

  const handleSendMessage = (receiverId: string, text: string) => {
    const activeConn = connections.find(
      c =>
        c.status === "accepted" &&
        ((c.senderId === currentUser!.id && c.receiverId === receiverId) ||
          (c.senderId === receiverId && c.receiverId === currentUser!.id))
    );

    if (!activeConn) return;

    sendFirebaseMessage(activeConn.id, currentUser!.id, [activeConn.senderId, activeConn.receiverId], text).catch(error => alert(error.message));
  };

  const handleUpdatePlan = (isPremium: boolean) => {
    if (currentUser) {
      const updated = { ...currentUser, isPremium };
      setCurrentUser(updated);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(CONNECTIONS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);

    setCurrentUser(null);
    setConnections(seedConnections);
    setMessages(seedMessages);
    setNotifications(seedNotifications);
    setActiveTab("dashboard");
    setActiveChatPeerId(null);
    setActivePeerProfile(null);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-brand-bg text-slate-100 overflow-hidden font-sans">
        <LandingPage onStartAuth={setAuthMode} onExploreDemo={handleStartDemo} />

        {authMode && (
          <AuthModal
            authMode={authMode}
            authName={authName}
            onAuthNameChange={setAuthName}
            authEmail={authEmail}
            onAuthEmailChange={setAuthEmail}
            authPassword={authPassword}
            onAuthPasswordChange={setAuthPassword}
            authError={authError}
            onClose={() => setAuthMode(null)}
            onSubmit={handleAuthSubmit}
            onSwitchMode={() => {
              setAuthError("");
              setAuthMode(authMode === "login" ? "signup" : "login");
            }}
          />
        )}
      </div>
    );
  }

  if (!currentUser.isOnboarded) {
    return <Onboarding email={currentUser.email} onComplete={handleOnboardingComplete} />;
  }

  return (
    <CallProvider currentUser={currentUser} users={users}>
      <DashboardPage
        currentUser={currentUser}
        users={users}
        connections={connections}
        messages={messages}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeChatPeerId={activeChatPeerId}
        setActiveChatPeerId={setActiveChatPeerId}
        activePeerProfile={activePeerProfile}
        setActivePeerProfile={setActivePeerProfile}
        onConnectPeer={handleConnectPeer}
        onAcceptConnection={handleAcceptConnection}
        onRejectConnection={handleRejectConnection}
        onRemoveConnection={handleRemoveConnection}
        onSendMessage={handleSendMessage}
        onUpdatePlan={handleUpdatePlan}
        onResetData={handleResetData}
        onLogout={handleLogout}
        onMarkNotificationsRead={markNotificationsRead}
        onClearNotifications={() => setNotifications([])}
        onEditProfile={() => setActiveTab("edit")}
        onSaveProfile={handleOnboardingComplete}
      />
    </CallProvider>
  );
}
