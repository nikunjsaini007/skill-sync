import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Connection, Message, Notification, UserProfile } from "@/lib/types";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import MobileMenu from "@/components/layout/MobileMenu";
import AuroraBackground from "@/components/AuroraBackground";
import { DashboardView } from "@/features/dashboard";
import { DiscoverView, ConnectionsView } from "@/features/connections";
import { MessagesView } from "@/features/messages";
import { AiAssistantView } from "@/features/ai";
import { ProfileView } from "@/features/profile";
import { SettingsView } from "@/features/settings";
import Onboarding from "@/pages/Onboarding";

interface DashboardPageProps {
  currentUser: UserProfile;
  users: UserProfile[];
  connections: Connection[];
  messages: Message[];
  notifications: Notification[];
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeChatPeerId: string | null;
  setActiveChatPeerId: (peerId: string | null) => void;
  activePeerProfile: UserProfile | null;
  setActivePeerProfile: (peer: UserProfile | null) => void;
  onConnectPeer: (peerId: string) => void;
  onAcceptConnection: (connId: string) => void;
  onRejectConnection: (connId: string) => void;
  onRemoveConnection: (connId: string) => void;
  onSendMessage: (receiverId: string, text: string) => void;
  onUpdatePlan: (isPremium: boolean) => void;
  onResetData: () => void;
  onLogout: () => void;
  onMarkNotificationsRead: () => void;
  onClearNotifications: () => void;
  onEditProfile: () => void;
  onSaveProfile: (profile: UserProfile) => void;
}

export default function DashboardPage({
  currentUser,
  users,
  connections,
  messages,
  notifications,
  theme,
  onThemeChange,
  activeTab,
  setActiveTab,
  activeChatPeerId,
  setActiveChatPeerId,
  activePeerProfile,
  setActivePeerProfile,
  onConnectPeer,
  onAcceptConnection,
  onRejectConnection,
  onRemoveConnection,
  onSendMessage,
  onUpdatePlan,
  onResetData,
  onLogout,
  onMarkNotificationsRead,
  onClearNotifications,
  onEditProfile,
  onSaveProfile,
}: DashboardPageProps) {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navigateToTab = (tab: string) => {
    setActivePeerProfile(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
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

  const handleOpenProfile = () => {
    setActivePeerProfile(null);
    setActiveTab("profile");
  };

  const handleBellClick = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    if (!showNotificationsMenu) onMarkNotificationsRead();
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            currentUser={currentUser}
            connections={connections}
            onNavigateTab={setActiveTab}
            onConnectPeer={onConnectPeer}
          />
        );
      case "discover":
        return (
          <DiscoverView
            currentUser={currentUser}
            connections={connections}
            users={users}
            onConnectPeer={onConnectPeer}
            onViewPeerProfile={handleViewPeerProfile}
          />
        );
      case "connections":
        return (
          <ConnectionsView
            currentUser={currentUser}
            connections={connections}
            users={users}
            onAcceptConnection={onAcceptConnection}
            onRejectConnection={onRejectConnection}
            onRemoveConnection={onRemoveConnection}
            onOpenChat={handleOpenChat}
            onViewProfile={handleViewPeerProfile}
          />
        );
      case "messages":
        return (
          <MessagesView
            currentUser={currentUser}
            connections={connections}
            messages={messages}
            users={users}
            activeChatPeerId={activeChatPeerId}
            setActiveChatPeerId={setActiveChatPeerId}
            onSendMessage={onSendMessage}
          />
        );
      case "ai":
        return <AiAssistantView currentUser={currentUser} />;
      case "profile":
        return (
          <ProfileView
            currentUser={currentUser}
            peerProfile={activePeerProfile}
            onBackToDiscover={() => {
              setActivePeerProfile(null);
              setActiveTab("discover");
            }}
            onConnectPeer={onConnectPeer}
            connections={connections}
            onEditProfile={onEditProfile}
          />
        );
      case "edit":
        return (
          <Onboarding
            email={currentUser.email}
            initialProfile={currentUser}
            initialStep={1}
            mode="edit"
            onComplete={onSaveProfile}
            onCancel={() => setActiveTab("profile")}
          />
        );
      case "settings":
        return (
          <SettingsView
            currentUser={currentUser}
            theme={theme}
            onThemeChange={onThemeChange}
            onUpdatePlan={onUpdatePlan}
            onResetData={onResetData}
            onLogout={onLogout}
          />
        );
      default:
        return <div className="p-8 text-center text-slate-500">Page not found</div>;
    }
  };

  return (
    <div id="dashboard-container" className="relative min-h-screen bg-[linear-gradient(180deg,#0A1428_0%,#060B16_55%,#04070F_100%)] flex text-slate-200 overflow-hidden font-sans">

      <AuroraBackground className="z-0" />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">

        <TopNav
          currentUser={currentUser}
          unreadNotifications={unreadNotifications}
          showNotificationsMenu={showNotificationsMenu}
          onToggleNotifications={handleBellClick}
          notifications={notifications}
          onClearNotifications={onClearNotifications}
          onOpenProfile={handleOpenProfile}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {mobileMenuOpen && (
          <MobileMenu
            activeTab={activeTab}
            onNavigate={navigateToTab}
            onClose={() => setMobileMenuOpen(false)}
            onLogout={onLogout}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
}
