import { UserProfile, Review, SkillItem } from "./types";

export const POPULAR_SKILLS: SkillItem[] = [
  // Tech
  { name: "Python", category: "Tech", popularity: 5 },
  { name: "React", category: "Tech", popularity: 5 },
  { name: "TypeScript", category: "Tech", popularity: 4 },
  { name: "Node.js", category: "Tech", popularity: 4 },
  { name: "Flutter", category: "Tech", popularity: 3 },
  { name: "Next.js", category: "Tech", popularity: 4 },
  { name: "PostgreSQL", category: "Tech", popularity: 3 },
  { name: "Machine Learning", category: "Tech", popularity: 5 },
  { name: "Prompt Engineering", category: "Tech", popularity: 3 },
  { name: "API Design", category: "Tech", popularity: 3 },
  { name: "Data Analysis (Excel/SQL)", category: "Tech", popularity: 4 },
  { name: "AWS & Cloud Basics", category: "Tech", popularity: 3 },
  // Design
  { name: "Figma", category: "Design", popularity: 5 },
  { name: "UI/UX Design", category: "Design", popularity: 5 },
  { name: "Typography", category: "Design", popularity: 3 },
  { name: "3D Modeling (Blender)", category: "Design", popularity: 4 },
  { name: "Motion Graphics", category: "Design", popularity: 4 },
  { name: "Branding & Identity", category: "Design", popularity: 4 },
  { name: "Illustration", category: "Design", popularity: 3 },
  // Business
  { name: "SEO Optimization", category: "Business", popularity: 4 },
  { name: "Digital Marketing", category: "Business", popularity: 4 },
  { name: "Startup Pitching", category: "Business", popularity: 3 },
  { name: "Financial Modeling", category: "Business", popularity: 3 },
  { name: "Copywriting", category: "Business", popularity: 4 },
  { name: "Product Strategy", category: "Business", popularity: 3 },
  { name: "Growth Strategy", category: "Business", popularity: 3 },
  // Creative
  { name: "Video Editing", category: "Creative", popularity: 5 },
  { name: "Photography", category: "Creative", popularity: 4 },
  { name: "Beatmaking & Audio", category: "Creative", popularity: 3 },
  { name: "Storyboarding", category: "Creative", popularity: 2 },
  { name: "Public Speaking", category: "Creative", popularity: 3 },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    name: "Aarav Shah",
    email: "aarav@iitd.ac.in",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I teach React and help with web apps",
    bio: "I am a final-year CS student at IIT Delhi. I can explain React, Node.js, and TypeScript in a simple way. I want to learn better UI ideas and Figma for app screens.",
    college: "IIT Delhi",
    skillsOffered: ["React", "TypeScript", "Node.js"],
    skillsWanted: ["Figma", "UI/UX Design"],
    experience: "Advanced",
    interests: "Side projects, web apps, hackathons",
    learningGoals: "Build cleaner and faster app interfaces.",
    isOnboarded: true,
    isPremium: false,
    rating: 4.9,
    reviewsCount: 14,
    achievements: ["Quick Mentor", "Top Helper"],
    location: "New Delhi"
  },
  {
    id: "user-2",
    name: "Meera Nair",
    email: "meera@bits-pilani.ac.in",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I design clean screens and want to learn Python",
    bio: "I study design at BITS Pilani and enjoy making simple, useful interfaces. I can teach layout, Figma, and visual thinking. I want to learn Python and basic AI tools.",
    college: "BITS Pilani",
    skillsOffered: ["Figma", "UI/UX Design", "Typography"],
    skillsWanted: ["Python", "Machine Learning"],
    experience: "Expert",
    interests: "Design systems, posters, simple apps",
    learningGoals: "Use Python to make small creative tools.",
    isOnboarded: true,
    isPremium: true,
    rating: 5.0,
    reviewsCount: 19,
    achievements: ["Clear Mentor", "Design Spark"],
    location: "Goa"
  },
  {
    id: "user-3",
    name: "Rohan Verma",
    email: "rohan@iiit.ac.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I teach Python and learn video editing",
    bio: "I am in my final year at IIIT Hyderabad. I can help with Python, data work, and SQL basics. I want to learn video editing and storytelling for my own projects.",
    college: "IIIT Hyderabad",
    skillsOffered: ["Python", "Data Analysis (Excel/SQL)", "PostgreSQL"],
    skillsWanted: ["Video Editing", "Storyboarding"],
    experience: "Advanced",
    interests: "Data, short films, campus projects",
    learningGoals: "Make better demo videos for my work.",
    isOnboarded: true,
    isPremium: false,
    rating: 4.8,
    reviewsCount: 8,
    achievements: ["Patient Teacher", "Helpful Friend"],
    location: "Hyderabad"
  },
  {
    id: "user-4",
    name: "Ananya Iyer",
    email: "ananya@nitt.edu",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I teach mobile design and want Flutter help",
    bio: "I make content and study at NIT Trichy. I can explain video editing, reels, and marketing basics. I want to learn Flutter so I can ship a small app for creators.",
    college: "NIT Trichy",
    skillsOffered: ["Video Editing", "Digital Marketing", "Storyboarding"],
    skillsWanted: ["Flutter", "React", "TypeScript"],
    experience: "Expert",
    interests: "Creator apps, reels, product ideas",
    learningGoals: "Build a simple creator app by the end of the month.",
    isOnboarded: true,
    isPremium: true,
    rating: 4.9,
    reviewsCount: 22,
    achievements: ["Creative Mind", "Fast Learner"],
    location: "Tiruchirappalli"
  },
  {
    id: "user-5",
    name: "Kunal Bhatia",
    email: "kunal@iitb.ac.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I teach Next.js and want better pitch skills",
    bio: "I build web products at IIT Bombay. I can help with Next.js, API design, and simple backend setup. I want to learn better pitching and SEO for my own startup ideas.",
    college: "IIT Bombay",
    skillsOffered: ["Next.js", "API Design", "AWS & Cloud Basics"],
    skillsWanted: ["SEO Optimization", "Startup Pitching"],
    experience: "Advanced",
    interests: "Startups, side hustles, product builds",
    learningGoals: "Make my first small product easier to find online.",
    isOnboarded: true,
    isPremium: false,
    rating: 4.7,
    reviewsCount: 6,
    achievements: ["Practical Builder", "Calm Mentor"],
    location: "Mumbai"
  },
  {
    id: "user-6",
    name: "Sana Kapoor",
    email: "sana@christuniversity.in",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "I teach content and want to learn React",
    bio: "I am a design and content student at Christ University. I can help with branding, copy, and simple social content. I want to learn React and build a portfolio site.",
    college: "Christ University",
    skillsOffered: ["Copywriting", "Branding & Identity", "Digital Marketing"],
    skillsWanted: ["React", "TypeScript", "Next.js"],
    experience: "Intermediate",
    interests: "Branding, content, student projects",
    learningGoals: "Create a small portfolio and launch a personal website.",
    isOnboarded: true,
    isPremium: false,
    rating: 4.6,
    reviewsCount: 5,
    achievements: ["Thoughtful Partner", "Clear Communicator"],
    location: "Bengaluru"
  }
];

export const MOCK_REVIEWS: Record<string, Review[]> = {
  "user-1": [
    {
      id: "rev-1",
      fromUserId: "user-2",
      fromUserName: "Meera Nair",
      fromUserAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment: "Aarav explained React in a very simple way and helped me build a better portfolio page.",
      createdAt: "2026-06-12"
    },
    {
      id: "rev-2",
      fromUserId: "user-4",
      fromUserName: "Ananya Iyer",
      fromUserAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment: "He made TypeScript feel easy and practical. I understood it quickly.",
      createdAt: "2026-07-01"
    }
  ],
  "user-2": [
    {
      id: "rev-3",
      fromUserId: "user-1",
      fromUserName: "Aarav Shah",
      fromUserAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
      rating: 5,
      comment: "Meera helped me think about layout and visual balance in a very clear way.",
      createdAt: "2026-06-14"
    }
  ]
};

// Smart matching helper function running on the client
export function calculateMatchScore(userA: { skillsOffered: string[]; skillsWanted: string[]; experience?: string }, userB: UserProfile) {
  let score = 50; // Base score
  let reasons: string[] = [];

  // Match: User A's offered matches User B's wanted
  const mutualHelp1 = userA.skillsOffered.filter(skill => 
    userB.skillsWanted.some(w => w.toLowerCase() === skill.toLowerCase())
  );

  // Match: User B's offered matches User A's wanted
  const mutualHelp2 = userB.skillsOffered.filter(skill => 
    userA.skillsWanted.some(w => w.toLowerCase() === skill.toLowerCase())
  );

  if (mutualHelp1.length > 0 && mutualHelp2.length > 0) {
    score += 35;
    reasons.push(`Perfect mutual fit: You can teach them ${mutualHelp1.join(", ")} and they can teach you ${mutualHelp2.join(", ")}.`);
  } else if (mutualHelp1.length > 0) {
    score += 15;
    reasons.push(`You have skills they want: You can teach them ${mutualHelp1.join(", ")}.`);
  } else if (mutualHelp2.length > 0) {
    score += 15;
    reasons.push(`They have skills you want: They can teach you ${mutualHelp2.join(", ")}.`);
  } else {
    // Partial skill category alignment
    reasons.push("Different skill tracks, but highly collaborative backgrounds.");
  }

  // Interests overlap
  if (userA.experience && userB.experience) {
    if (userA.experience === userB.experience) {
      score += 10;
      reasons.push(`Matched Peer Level: Both are at the '${userA.experience}' stage.`);
    } else {
      score += 5;
      reasons.push(`Complimentary levels: A great chance for mentor-mentee learning (${userA.experience} & ${userB.experience}).`);
    }
  }

  // Clamp score
  score = Math.min(Math.max(score, 30), 98);

  return {
    score,
    explanation: reasons.length > 0 ? reasons.join(" ") : "Perfect platform synergy for dual growth!"
  };
}
