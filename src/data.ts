import { UserProfile, Review, SkillItem } from "./types";

export const POPULAR_SKILLS: SkillItem[] = [

  { name: "Python", category: "Tech", popularity: 5 },
{ name: "Java", category: "Tech", popularity: 5 },
{ name: "C++", category: "Tech", popularity: 5 },
{ name: "JavaScript", category: "Tech", popularity: 5 },
{ name: "TypeScript", category: "Tech", popularity: 5 },
{ name: "React", category: "Tech", popularity: 5 },
{ name: "Next.js", category: "Tech", popularity: 5 },
{ name: "Node.js", category: "Tech", popularity: 4 },
{ name: "Express.js", category: "Tech", popularity: 4 },
{ name: "Flutter", category: "Tech", popularity: 4 },
{ name: "React Native", category: "Tech", popularity: 4 },
{ name: "Tailwind CSS", category: "Tech", popularity: 5 },
{ name: "HTML & CSS", category: "Tech", popularity: 5 },
{ name: "MongoDB", category: "Tech", popularity: 4 },
{ name: "PostgreSQL", category: "Tech", popularity: 4 },
{ name: "MySQL", category: "Tech", popularity: 4 },
{ name: "Firebase", category: "Tech", popularity: 4 },
{ name: "Supabase", category: "Tech", popularity: 4 },
{ name: "REST APIs", category: "Tech", popularity: 5 },
{ name: "GraphQL", category: "Tech", popularity: 3 },
{ name: "Git & GitHub", category: "Tech", popularity: 5 },
{ name: "Docker", category: "Tech", popularity: 4 },
{ name: "Linux", category: "Tech", popularity: 4 },
{ name: "AWS", category: "Tech", popularity: 4 },
{ name: "Google Cloud", category: "Tech", popularity: 3 },
{ name: "Azure", category: "Tech", popularity: 3 },
{ name: "CI/CD", category: "Tech", popularity: 3 },
{ name: "Machine Learning", category: "Tech", popularity: 5 },
{ name: "Deep Learning", category: "Tech", popularity: 4 },
{ name: "Data Science", category: "Tech", popularity: 5 },
{ name: "Data Analysis", category: "Tech", popularity: 5 },
{ name: "SQL", category: "Tech", popularity: 5 },
{ name: "Power BI", category: "Tech", popularity: 4 },
{ name: "Tableau", category: "Tech", popularity: 3 },
{ name: "Prompt Engineering", category: "Tech", popularity: 4 },
{ name: "AI Agent Development", category: "Tech", popularity: 5 },
{ name: "LLM Applications", category: "Tech", popularity: 5 },
{ name: "LangChain", category: "Tech", popularity: 4 },
{ name: "MCP (Model Context Protocol)", category: "Tech", popularity: 4 },
{ name: "Web Scraping", category: "Tech", popularity: 3 },
{ name: "Competitive Programming", category: "Tech", popularity: 4 },
{ name: "DSA", category: "Tech", popularity: 5 },
{ name: "Ethical Hacking", category: "Tech", popularity: 4 },
{ name: "Network Security", category: "Tech", popularity: 3 },
{ name: "OWASP", category: "Tech", popularity: 3 },
{ name: "Bug Bounty", category: "Tech", popularity: 3 },
{ name: "Cryptography Basics", category: "Tech", popularity: 2 },

 { name: "Figma", category: "Design", popularity: 5 },
{ name: "UI Design", category: "Design", popularity: 5 },
{ name: "UX Design", category: "Design", popularity: 5 },
{ name: "Wireframing", category: "Design", popularity: 4 },
{ name: "Prototyping", category: "Design", popularity: 4 },
{ name: "Design Systems", category: "Design", popularity: 4 },
{ name: "Typography", category: "Design", popularity: 3 },
{ name: "Adobe Photoshop", category: "Design", popularity: 4 },
{ name: "Adobe Illustrator", category: "Design", popularity: 4 },
{ name: "Canva", category: "Design", popularity: 5 },
{ name: "Blender", category: "Design", popularity: 3 },
{ name: "3D Modeling", category: "Design", popularity: 3 },
{ name: "Motion Graphics", category: "Design", popularity: 4 },
{ name: "Brand Identity", category: "Design", popularity: 4 },
{ name: "Logo Design", category: "Design", popularity: 4 },
{ name: "Illustration", category: "Design", popularity: 3 },

  
  { name: "Digital Marketing", category: "Business", popularity: 5 },
{ name: "SEO", category: "Business", popularity: 5 },
{ name: "Content Marketing", category: "Business", popularity: 4 },
{ name: "Social Media Marketing", category: "Business", popularity: 5 },
{ name: "Copywriting", category: "Business", popularity: 4 },
{ name: "Email Marketing", category: "Business", popularity: 3 },
{ name: "Startup Pitching", category: "Business", popularity: 3 },
{ name: "Product Management", category: "Business", popularity: 4 },
{ name: "Product Strategy", category: "Business", popularity: 4 },
{ name: "Growth Marketing", category: "Business", popularity: 4 },
{ name: "Financial Modeling", category: "Business", popularity: 3 },
{ name: "Business Analytics", category: "Business", popularity: 3 },
{ name: "Resume Review", category: "Business", popularity: 4 },
{ name: "Interview Preparation", category: "Business", popularity: 5 },
{ name: "Mock Interviews", category: "Business", popularity: 4 },
{ name: "LinkedIn Optimization", category: "Business", popularity: 4 },
{ name: "Networking", category: "Business", popularity: 3 },
{ name: "Presentation Skills", category: "Business", popularity: 4 },
{ name: "Technical Writing", category: "Business", popularity: 3 },
  
  { name: "Video Editing", category: "Creative", popularity: 5 },
{ name: "Photography", category: "Creative", popularity: 4 },
{ name: "Videography", category: "Creative", popularity: 4 },
{ name: "Cinematography", category: "Creative", popularity: 3 },
{ name: "Content Creation", category: "Creative", popularity: 5 },
{ name: "Podcast Editing", category: "Creative", popularity: 3 },
{ name: "Audio Editing", category: "Creative", popularity: 3 },
{ name: "Music Production", category: "Creative", popularity: 3 },
{ name: "Storytelling", category: "Creative", popularity: 4 },
{ name: "Script Writing", category: "Creative", popularity: 3 },
{ name: "Public Speaking", category: "Creative", popularity: 4 },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: "user-1",
    name: "Rohit Verma",
    email: "rohit.verma22@nitj.ac.in",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80",
    headline: "Frontend developer learning full-stack development",
    bio: "I'm a third-year Computer Science student at NIT Jalandhar. I enjoy building web applications with React and TypeScript and have worked on a few college and personal projects. I'm currently learning backend development and improving my UI design skills by recreating popular websites.",
    college: "Dr. B.R. Ambedkar National Institute of Technology, Jalandhar",
    skillsOffered: ["React", "JavaScript", "TypeScript"],
    skillsWanted: ["Node.js", "PostgreSQL", "UI/UX Design"],
    experience: "Intermediate",
    interests: "Open source, web development, cricket, hackathons",
    learningGoals: "Become a full-stack developer and contribute to open-source projects.",
    isOnboarded: true,
    isPremium: false,
    rating: 4.6,
    reviewsCount: 9,
    achievements: ["Helpful Mentor", "Project Collaborator"],
    location: "Jalandhar, Punjab"
  },
 {
  id: "user-2",
  name: "Ananya Kulkarni",
  email: "ananya.ec22@vitbhopal.ac.in",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "UI designer who loves making React apps look better",
  bio: "I'm a third-year Electronics student at VIT Bhopal. I started learning UI design through Figma and now enjoy designing interfaces for college projects and hackathons. I'm trying to learn frontend development so I can build the designs myself.",
  college: "VIT Bhopal University",
  skillsOffered: ["Figma", "UI Design", "Wireframing"],
  skillsWanted: ["React", "Tailwind CSS", "JavaScript"],
  experience: "Intermediate",
  interests: "Design, hackathons, photography, coffee",
  learningGoals: "Design and build complete web applications without depending on a developer.",
  isOnboarded: true,
  isPremium: false,
  rating: 4.7,
  reviewsCount: 11,
  achievements: ["Creative Designer", "Helpful Reviewer"],
  location: "Bhopal, Madhya Pradesh"
},
{
  id: "user-3",
  name: "Aditya Singh",
  email: "aditya.cs21@lnmiit.ac.in",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "Python developer interested in backend engineering",
  bio: "I'm a fourth-year CSE student at LNMIIT Jaipur. I've used Python for automation, coding contests, and a few backend projects with Flask. Right now I'm learning Docker and system design while also trying to improve my public speaking.",
  college: "The LNM Institute of Information Technology",
  skillsOffered: ["Python", "Flask", "SQL"],
  skillsWanted: ["Docker", "System Design", "Public Speaking"],
  experience: "Intermediate",
  interests: "Backend development, cricket, competitive programming",
  learningGoals: "Land a backend developer role and contribute to open-source projects.",
  isOnboarded: true,
  isPremium: true,
  rating: 4.8,
  reviewsCount: 16,
  achievements: ["Reliable Mentor", "Backend Builder"],
  location: "Jaipur, Rajasthan"
},
 {
  id: "user-4",
  name: "Priya Menon",
  email: "priya.22@nitc.ac.in",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "Content creator exploring UI design",
  bio: "I'm a third-year Mechanical Engineering student at NIT Calicut. Alongside college, I create Instagram content for student clubs and local businesses. I'm interested in learning UI design and frontend development to build better digital experiences.",
  college: "NIT Calicut",
  skillsOffered: ["Video Editing", "Canva", "Content Writing"],
  skillsWanted: ["Figma", "React", "Tailwind CSS"],
  experience: "Intermediate",
  interests: "Content creation, photography, travel",
  learningGoals: "Design and develop a portfolio website from scratch.",
  isOnboarded: true,
  isPremium: false,
  rating: 4.7,
  reviewsCount: 13,
  achievements: ["Creative Mentor", "Content Creator"],
  location: "Kozhikode, Kerala"
},
{
  id: "user-5",
  name: "Arjun Malhotra",
  email: "arjun.cs21@thapar.edu",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "Full-stack developer building side projects",
  bio: "I'm a final-year Computer Engineering student at Thapar Institute. I've built a few MERN stack projects for hackathons and freelancing. These days I'm focusing on Next.js and deployment while learning how to improve product ideas.",
  college: "Thapar Institute of Engineering and Technology",
  skillsOffered: ["React", "Next.js", "Node.js"],
  skillsWanted: ["Product Management", "SEO", "UI/UX Design"],
  experience: "Intermediate",
  interests: "Hackathons, startups, football",
  learningGoals: "Launch my first SaaS project with real users.",
  isOnboarded: true,
  isPremium: true,
  rating: 4.8,
  reviewsCount: 15,
  achievements: ["Project Builder", "Reliable Mentor"],
  location: "Patiala, Punjab"
},
{
  id: "user-6",
  name: "Neha Gupta",
  email: "neha.bba23@christuniversity.in",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
  headline: "Marketing student learning web development",
  bio: "I'm a second-year BBA student at Christ University. I enjoy creating social media campaigns and writing content for student events. Recently I started learning React because I want to build my own portfolio and small business websites.",
  college: "Christ University",
  skillsOffered: ["Content Writing", "Social Media Marketing", "Canva"],
  skillsWanted: ["React", "JavaScript", "Git"],
  experience: "Beginner",
  interests: "Marketing, design, reading, cafes",
  learningGoals: "Build a personal portfolio and collaborate on student projects.",
  isOnboarded: true,
  isPremium: false,
  rating: 4.5,
  reviewsCount: 7,
  achievements: ["Helpful Collaborator"],
  location: "Bengaluru, Karnataka"
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


export function calculateMatchScore(userA: { skillsOffered: string[]; skillsWanted: string[]; experience?: string }, userB: UserProfile) {
  let score = 50; 
  let reasons: string[] = [];


  const mutualHelp1 = userA.skillsOffered.filter(skill => 
    userB.skillsWanted.some(w => w.toLowerCase() === skill.toLowerCase())
  );

 
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

    reasons.push("Different skill tracks, but highly collaborative backgrounds.");
  }


  if (userA.experience && userB.experience) {
    if (userA.experience === userB.experience) {
      score += 10;
      reasons.push(`Matched Peer Level: Both are at the '${userA.experience}' stage.`);
    } else {
      score += 5;
      reasons.push(`Complimentary levels: A great chance for mentor-mentee learning (${userA.experience} & ${userB.experience}).`);
    }
  }


  score = Math.min(Math.max(score, 30), 98);

  return {
    score,
    explanation: reasons.length > 0 ? reasons.join(" ") : "Perfect platform synergy for dual growth!"
  };
}
