import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  Star,
  Check,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Award
} from "lucide-react";

import { UserProfile, Connection, Message, Notification } from "./types";


import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import DiscoverView from "./components/DiscoverView";
import ConnectionsView from "./components/ConnectionsView";
import MessagesView from "./components/MessagesView";
import AiAssistantView from "./components/AiAssistantView";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseReady, createFirebaseAccount, getFirebaseProfile, subscribeToFirebaseData, saveFirebaseProfile, createFirebaseConnection, updateFirebaseConnection, removeFirebaseConnection, sendFirebaseMessage, signInWithEmailAndPassword, signOut } from "./firebase";

export default function App() {

  const USER_KEY = "skillsync_user";
  const CONNECTIONS_KEY = "skillsync_connections";
  const MESSAGES_KEY = "skillsync_messages";
  const NOTIFICATIONS_KEY = "skillsync_notifications";
  const [users, setUsers] = useState<UserProfile[]>([]);


  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem(CONNECTIONS_KEY);
    if (saved) return JSON.parse(saved);

    return [
      { id: "conn-1", senderId: "user-2", receiverId: "current-user-id", status: "pending", createdAt: new Date().toISOString() }, // Meera Nair pending
      { id: "conn-2", senderId: "user-1", receiverId: "current-user-id", status: "accepted", createdAt: new Date().toISOString() } // Aarav Shah accepted
    ];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) return JSON.parse(saved);

    return [
      { id: "msg-1", connectionId: "conn-2", senderId: "user-1", text: "Hey! I saw your profile and we look like a good fit. I can teach React if you help me with Figma basics.", createdAt: new Date(Date.now() - 36000000).toISOString(), read: true },
      { id: "msg-2", connectionId: "conn-2", senderId: "current-user-id", text: "Perfect. I can share some simple UI ideas and we can swap notes this week.", createdAt: new Date(Date.now() - 30000000).toISOString(), read: true },
      { id: "msg-3", connectionId: "conn-2", senderId: "user-1", text: "Great. Let’s keep it simple and set up a short call this weekend.", createdAt: new Date(Date.now() - 20000000).toISOString(), read: true }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) return JSON.parse(saved);
    return [
      { id: "not-1", userId: "current-user-id", type: "connection_request", title: "New Request", content: "Meera Nair wants to swap design and coding tips.", createdAt: new Date().toISOString(), read: false }
    ];
  });


  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeChatPeerId, setActiveChatPeerId] = useState<string | null>(null);
  const [activePeerProfile, setActivePeerProfile] = useState<UserProfile | null>(null);


  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!firebaseReady || !auth) return;
    return onAuthStateChanged(auth, async user => {
      if (!user) { setCurrentUser(null); return; }
      try { setCurrentUser(await getFirebaseProfile(user.uid, user.displayName || "SkillSyncer", user.email || "")); }
      catch (error: any) { setAuthError(error.message); }
    });
  }, []);

  useEffect(() => {
    if (!firebaseReady || !currentUser) return;
    return subscribeToFirebaseData(currentUser.id, { profile: setCurrentUser, users: setUsers, connections: setConnections, messages: setMessages });
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
        c => c.status === "accepted" &&
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
      const profile = authMode === "signup" ? await createFirebaseAccount(authName.trim(), authEmail.trim(), authPassword) : await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword).then(credential => getFirebaseProfile(credential.user.uid, credential.user.displayName || "SkillSyncer", credential.user.email || authEmail));
      setCurrentUser(profile); setAuthMode(null); setAuthPassword("");
    } catch (error: any) { setAuthError(error.message || "Could not sign you in."); }
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
    if (!firebaseReady || !auth?.currentUser) {
      setCurrentUser({ ...profile, id: currentUser?.id || profile.id });
      setActiveTab("dashboard");
      return;
    }
    try {
      await saveFirebaseProfile({ ...profile, id: currentUser!.id });
      setCurrentUser({ ...profile, id: currentUser!.id });
      setActiveTab("dashboard");
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
      c => c.status === "accepted" &&
        ((c.senderId === currentUser!.id && c.receiverId === receiverId) ||
          (c.senderId === receiverId && c.receiverId === currentUser!.id))
    );

    if (!activeConn) return;

    sendFirebaseMessage(activeConn.id, currentUser!.id, [activeConn.senderId, activeConn.receiverId], text).catch(error => alert(error.message));
  };

  const handleOpenChat = (peerId: string) => {
    setActiveChatPeerId(peerId);
    setActiveTab("messages");
    setMobileMenuOpen(false);
  };

  const handleViewPeerProfile = (peer: UserProfile) => {
    setActivePeerProfile(peer);
    setActiveTab("profile");
    setMobileMenuOpen(false);
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
    setConnections([
      { id: "conn-1", senderId: "user-2", receiverId: "current-user-id", status: "pending", createdAt: new Date().toISOString() },
      { id: "conn-2", senderId: "user-1", receiverId: "current-user-id", status: "accepted", createdAt: new Date().toISOString() }
    ]);
    setMessages([
      { id: "msg-1", connectionId: "conn-2", senderId: "user-1", text: "Hey! I saw your profile and we look like a good fit. I can teach React if you help me with Figma basics.", createdAt: new Date(Date.now() - 36000000).toISOString(), read: true },
      { id: "msg-2", connectionId: "conn-2", senderId: "current-user-id", text: "Perfect. I can share some simple UI ideas and we can swap notes this week.", createdAt: new Date(Date.now() - 30000000).toISOString(), read: true },
      { id: "msg-3", connectionId: "conn-2", senderId: "user-1", text: "Great. Let’s keep it simple and set up a short call this weekend.", createdAt: new Date(Date.now() - 20000000).toISOString(), read: true }
    ]);
    setNotifications([
      { id: "not-1", userId: "current-user-id", type: "connection_request", title: "New Request", content: "Meera Nair wants to swap design and coding tips.", createdAt: new Date().toISOString(), read: false }
    ]);
    setActiveTab("dashboard");
    setActiveChatPeerId(null);
    setActivePeerProfile(null);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };


  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            currentUser={currentUser!}
            connections={connections}
            onNavigateTab={setActiveTab}
            onConnectPeer={handleConnectPeer}
          />
        );
      case "discover":
        return (
          <DiscoverView
            currentUser={currentUser!}
            connections={connections}
            users={users}
            onConnectPeer={handleConnectPeer}
            onViewPeerProfile={handleViewPeerProfile}
          />
        );
      case "connections":
        return (
          <ConnectionsView
            currentUser={currentUser!}
            connections={connections}
            users={users}
            onAcceptConnection={handleAcceptConnection}
            onRejectConnection={handleRejectConnection}
            onRemoveConnection={handleRemoveConnection}
            onOpenChat={handleOpenChat}
            onViewProfile={handleViewPeerProfile}
          />
        );
      case "messages":
        return (
          <MessagesView
            currentUser={currentUser!}
            connections={connections}
            messages={messages}
            users={users}
            activeChatPeerId={activeChatPeerId}
            setActiveChatPeerId={setActiveChatPeerId}
            onSendMessage={handleSendMessage}
          />
        );
      case "ai":
        return <AiAssistantView currentUser={currentUser!} />;
      case "profile":
        return (
          <ProfileView
            currentUser={currentUser!}
            peerProfile={activePeerProfile}
            onBackToDiscover={() => {
              setActivePeerProfile(null);
              setActiveTab("discover");
            }}
            onConnectPeer={handleConnectPeer}
            connections={connections}
          />
        );
      case "settings":
        return (
          <SettingsView
            currentUser={currentUser!}
            onUpdatePlan={handleUpdatePlan}
            onResetData={handleResetData}
            onLogout={handleLogout}
          />
        );
      default:
        return <div className="p-8 text-center text-slate-500">Page not found</div>;
    }
  };


  if (!currentUser) {
    return (
      <div className="relative min-h-screen bg-brand-bg text-slate-100 overflow-hidden font-sans">
        <LandingPage
          onStartAuth={setAuthMode}
          onExploreDemo={handleStartDemo}
        />


        {authMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/85 p-4 backdrop-blur-xl">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border/70 bg-gradient-to-br from-brand-card via-brand-card/95 to-brand-sec-bg/80 shadow-[0_25px_80px_rgba(2,6,23,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,101,242,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_45%)]" />
              <button
                id="btn-close-auth"
                onClick={() => setAuthMode(null)}
                className="absolute right-4 top-4 z-10 rounded-full border border-brand-border/50 bg-brand-bg/60 p-2 text-slate-500 transition-colors hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative flex flex-col lg:flex-row">
                <div className="w-full border-b border-brand-border/50 bg-brand-bg/30 p-8 lg:w-[42%] lg:border-b-0 lg:border-r lg:p-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white">
                    {authMode === "login" ? "Welcome back to SkillSync" : "Build your SkillSync profile"}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {authMode === "login"
                      ? "Rejoin your learning circle and keep growing together."
                      : "Create a profile that reflects your skills and interests."}
                  </p>


                </div>

                <div className="w-full p-8 lg:w-[58%] lg:p-10">
                  {authError && (
                    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-1">
                        <label htmlFor="auth-name" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                        <input
                          id="auth-name"
                          type="text"
                          value={authName}
                          onChange={e => setAuthName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label htmlFor="auth-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                      <input
                        id="auth-email"
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="you@college.edu"
                        className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="auth-pass" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                      <input
                        id="auth-pass"
                        type="password"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full rounded-2xl border border-brand-border bg-brand-bg/70 px-4 py-2.5 text-sm text-slate-100 transition-colors placeholder:text-slate-600 focus:border-brand-primary focus:outline-none"
                      />
                    </div>

                    <button
                      id="btn-auth-submit"
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.01] hover:shadow-brand-primary/35"
                    >
                      {authMode === "login" ? "Log In" : "Create Account"}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-xs text-slate-500">
                    {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => {
                        setAuthError("");
                        setAuthMode(authMode === "login" ? "signup" : "login");
                      }}
                      className="font-semibold text-brand-primary hover:underline"
                    >
                      {authMode === "login" ? "Sign Up Free" : "Log In"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Onboarding Flow if not yet completed
  if (!currentUser.isOnboarded) {
    return (
      <Onboarding
        email={currentUser.email}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // 3. Authenticated Dashboard Container
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div id="dashboard-container" className="min-h-screen bg-brand-bg flex text-slate-200 overflow-hidden font-sans">

      {/* Sleek Vertical Sidebar Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActivePeerProfile(null);
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Pane wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Horizontal Navigation bar */}
        <header id="top-nav" className="h-16 border-b border-brand-border/40 px-6 flex items-center justify-between bg-brand-sec-bg/15 shrink-0 relative z-40">

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>


          <div className="hidden sm:flex items-center justify-center bg-brand-bg/50 px-3.5 py-1.5 rounded-lg border border-brand-border/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white font-display">SkillSync</span>
          </div>

          {/* Right Top Actions Controls: Notification and Avatar */}
          <div className="flex items-center space-x-4">

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-bell"
                onClick={() => {
                  setShowNotificationsMenu(!showNotificationsMenu);
                  if (!showNotificationsMenu) markNotificationsRead();
                }}
                className={`w-9 h-9 rounded-xl border border-brand-border/60 flex items-center justify-center hover:bg-brand-card/50 transition-all ${unreadNotifications > 0 ? "text-brand-primary" : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-brand-bg">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown Menu */}
              {showNotificationsMenu && (
                <div id="notifications-menu" className="absolute right-0 mt-2.5 w-80 rounded-2xl bg-brand-card border border-brand-border shadow-2xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
                    <h4 className="text-xs font-bold text-slate-200">Sync Notifications</h4>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map(not => (
                        <div key={not.id} className="p-2.5 rounded-xl bg-brand-bg/50 border border-brand-border/40 text-[11px] leading-relaxed">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">{not.title}</span>
                            <span className="text-[8px] text-slate-500 font-mono">
                              {new Date(not.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1">{not.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-600 text-center py-6">No notifications active.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar click tab shortcut */}
            <button
              onClick={() => {
                setActivePeerProfile(null);
                setActiveTab("profile");
              }}
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-brand-primary/30 cursor-pointer"
            >
              <img src={currentUser.avatar} alt={currentUser.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        {/* Dynamic Mobile Navigation drawer menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-brand-bg/95 flex flex-col p-6 space-y-6 md:hidden">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white font-display">Navigation Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center space-y-4">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "discover", label: "Discover Directory" },
                { id: "connections", label: "Swap Network" },
                { id: "messages", label: "P2P Safe Chat" },
                { id: "ai", label: "Syncy AI Mentor (Gemini)" },
                { id: "profile", label: "My Profile" },
                { id: "settings", label: "Settings" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePeerProfile(null);
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-3 text-lg font-bold text-left border-b border-brand-border/40 ${activeTab === item.id ? "text-brand-primary" : "text-slate-400"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              onClick={handleLogout}
              className="py-3 text-red-400 font-bold text-center border border-red-500/25 rounded-xl bg-red-500/5"
            >
              Log Out Session
            </button>
          </div>
        )}

        {/* Embedded Active Scroll View Router core */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

    </div>
  );
}
