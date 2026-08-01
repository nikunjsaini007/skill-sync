import type { UserProfile } from "../types";

export const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";

export function fallbackUserProfile(id: string): UserProfile {
  return {
    id,
    name: "Swapper Peer",
    email: "peer@skillsync.app",
    avatar: DEFAULT_AVATAR,
    headline: "Skill Swapper",
    bio: "Excited to exchange knowledge and build real projects.",
    college: "External University",
    skillsOffered: [],
    skillsWanted: [],
    experience: "Intermediate",
    interests: "",
    learningGoals: "",
    isOnboarded: true,
    isPremium: false,
    rating: 5,
    reviewsCount: 0,
    achievements: [],
  };
}
