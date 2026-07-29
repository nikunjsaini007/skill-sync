export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  bio: string;
  college: string;
  skillsOffered: string[];
  skillsWanted: string[];
  experience: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  interests: string;
  learningGoals: string;
  isOnboarded: boolean;
  isPremium: boolean;
  rating: number;
  reviewsCount: number;
  achievements: string[];
  location?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "connection_request" | "connection_accept" | "message" | "recommendation" | "system";
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  linkData?: {
    connectionId?: string;
    senderId?: string;
    skills?: string[];
  };
}

export interface SkillItem {
  name: string;
  category: "Tech" | "Design" | "Business" | "Creative" | "Other";
  popularity: number; 
  link: string;
}
