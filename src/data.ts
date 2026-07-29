import { UserProfile, Review, SkillItem } from "./types";

export const POPULAR_SKILLS: SkillItem[] = [

  // Tech
  { name: "Python", category: "Tech", popularity: 5, link: "https://docs.python.org/3/" },
  { name: "Java", category: "Tech", popularity: 5, link: "https://dev.java/learn/" },
  { name: "C++", category: "Tech", popularity: 5, link: "https://cplusplus.com/doc/tutorial/" },
  { name: "JavaScript", category: "Tech", popularity: 5, link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "TypeScript", category: "Tech", popularity: 5, link: "https://www.typescriptlang.org/docs/" },
  { name: "React", category: "Tech", popularity: 5, link: "https://react.dev/learn" },
  { name: "Next.js", category: "Tech", popularity: 5, link: "https://nextjs.org/docs" },
  { name: "Node.js", category: "Tech", popularity: 4, link: "https://nodejs.org/en/docs" },
  { name: "Express.js", category: "Tech", popularity: 4, link: "https://expressjs.com/" },
  { name: "Flutter", category: "Tech", popularity: 4, link: "https://docs.flutter.dev/" },
  { name: "React Native", category: "Tech", popularity: 4, link: "https://reactnative.dev/docs/getting-started" },
  { name: "Tailwind CSS", category: "Tech", popularity: 5, link: "https://tailwindcss.com/docs" },
  { name: "HTML & CSS", category: "Tech", popularity: 5, link: "https://developer.mozilla.org/en-US/docs/Learn" },
  { name: "MongoDB", category: "Tech", popularity: 4, link: "https://www.mongodb.com/docs/" },
  { name: "PostgreSQL", category: "Tech", popularity: 4, link: "https://www.postgresql.org/docs/" },
  { name: "MySQL", category: "Tech", popularity: 4, link: "https://dev.mysql.com/doc/" },
  { name: "Firebase", category: "Tech", popularity: 4, link: "https://firebase.google.com/docs" },
  { name: "Supabase", category: "Tech", popularity: 4, link: "https://supabase.com/docs" },
  { name: "REST APIs", category: "Tech", popularity: 5, link: "https://restfulapi.net/" },
  { name: "GraphQL", category: "Tech", popularity: 3, link: "https://graphql.org/learn/" },
  { name: "Git & GitHub", category: "Tech", popularity: 5, link: "https://git-scm.com/doc" },
  { name: "Docker", category: "Tech", popularity: 4, link: "https://docs.docker.com/" },
  { name: "Linux", category: "Tech", popularity: 4, link: "https://linuxjourney.com/" },
  { name: "AWS", category: "Tech", popularity: 4, link: "https://docs.aws.amazon.com/" },
  { name: "Google Cloud", category: "Tech", popularity: 3, link: "https://cloud.google.com/docs" },
  { name: "Azure", category: "Tech", popularity: 3, link: "https://learn.microsoft.com/azure/" },
  { name: "CI/CD", category: "Tech", popularity: 3, link: "https://www.atlassian.com/continuous-delivery/ci-vs-ci-vs-cd" },
  { name: "Machine Learning", category: "Tech", popularity: 5, link: "https://scikit-learn.org/stable/user_guide.html" },
  { name: "Deep Learning", category: "Tech", popularity: 4, link: "https://pytorch.org/tutorials/" },
  { name: "Data Science", category: "Tech", popularity: 5, link: "https://www.kaggle.com/learn" },
  { name: "Data Analysis", category: "Tech", popularity: 5, link: "https://pandas.pydata.org/docs/" },
  { name: "SQL", category: "Tech", popularity: 5, link: "https://www.w3schools.com/sql/" },
  { name: "Power BI", category: "Tech", popularity: 4, link: "https://learn.microsoft.com/power-bi/" },
  { name: "Tableau", category: "Tech", popularity: 3, link: "https://help.tableau.com/current/guides/get-started-tutorial/en-us/get-started-tutorial-home.htm" },
  { name: "Prompt Engineering", category: "Tech", popularity: 4, link: "https://www.promptingguide.ai/" },
  { name: "AI Agent Development", category: "Tech", popularity: 5, link: "https://docs.langchain.com/" },
  { name: "LLM Applications", category: "Tech", popularity: 5, link: "https://platform.openai.com/docs" },
  { name: "LangChain", category: "Tech", popularity: 4, link: "https://docs.langchain.com/" },
  { name: "MCP (Model Context Protocol)", category: "Tech", popularity: 4, link: "https://modelcontextprotocol.io/introduction" },
  { name: "Web Scraping", category: "Tech", popularity: 3, link: "https://beautiful-soup-4.readthedocs.io/en/latest/" },
  { name: "Competitive Programming", category: "Tech", popularity: 4, link: "https://cp-algorithms.com/" },
  { name: "DSA", category: "Tech", popularity: 5, link: "https://www.geeksforgeeks.org/dsa/" },
  { name: "Ethical Hacking", category: "Tech", popularity: 4, link: "https://tryhackme.com/" },
  { name: "Network Security", category: "Tech", popularity: 3, link: "https://www.cloudflare.com/learning/security/" },
  { name: "OWASP", category: "Tech", popularity: 3, link: "https://owasp.org/www-project-top-ten/" },
  { name: "Bug Bounty", category: "Tech", popularity: 3, link: "https://www.hackerone.com/resources" },
  { name: "Cryptography Basics", category: "Tech", popularity: 2, link: "https://cryptohack.org/" },

  // Design
  { name: "Figma", category: "Design", popularity: 5, link: "https://help.figma.com/" },
  { name: "UI Design", category: "Design", popularity: 5, link: "https://www.interaction-design.org/literature/topics/ui-design" },
  { name: "UX Design", category: "Design", popularity: 5, link: "https://www.interaction-design.org/literature/topics/ux-design" },
  { name: "Wireframing", category: "Design", popularity: 4, link: "https://www.figma.com/resource-library/wireframing/" },
  { name: "Prototyping", category: "Design", popularity: 4, link: "https://help.figma.com/hc/en-us/categories/360002051613-Prototyping" },
  { name: "Design Systems", category: "Design", popularity: 4, link: "https://www.designsystems.com/" },
  { name: "Typography", category: "Design", popularity: 3, link: "https://fonts.google.com/knowledge" },
  { name: "Adobe Photoshop", category: "Design", popularity: 4, link: "https://helpx.adobe.com/photoshop/tutorials.html" },
  { name: "Adobe Illustrator", category: "Design", popularity: 4, link: "https://helpx.adobe.com/illustrator/tutorials.html" },
  { name: "Canva", category: "Design", popularity: 5, link: "https://www.canva.com/designschool/" },
  { name: "Blender", category: "Design", popularity: 3, link: "https://docs.blender.org/manual/en/latest/" },
  { name: "3D Modeling", category: "Design", popularity: 3, link: "https://docs.blender.org/manual/en/latest/modeling/index.html" },
  { name: "Motion Graphics", category: "Design", popularity: 4, link: "https://www.schoolofmotion.com/blog" },
  { name: "Brand Identity", category: "Design", popularity: 4, link: "https://www.canva.com/learn/brand-identity/" },
  { name: "Logo Design", category: "Design", popularity: 4, link: "https://www.canva.com/learn/logo-design/" },
  { name: "Illustration", category: "Design", popularity: 3, link: "https://drawabox.com/" },

  // Business
  { name: "Digital Marketing", category: "Business", popularity: 5, link: "https://learndigital.withgoogle.com/digitalgarage" },
  { name: "SEO", category: "Business", popularity: 5, link: "https://developers.google.com/search/docs" },
  { name: "Content Marketing", category: "Business", popularity: 4, link: "https://blog.hubspot.com/marketing" },
  { name: "Social Media Marketing", category: "Business", popularity: 5, link: "https://buffer.com/library/" },
  { name: "Copywriting", category: "Business", popularity: 4, link: "https://copyblogger.com/blog/" },
  { name: "Email Marketing", category: "Business", popularity: 3, link: "https://mailchimp.com/resources/" },
  { name: "Startup Pitching", category: "Business", popularity: 3, link: "https://www.ycombinator.com/library" },
  { name: "Product Management", category: "Business", popularity: 4, link: "https://www.atlassian.com/agile/product-management" },
  { name: "Product Strategy", category: "Business", popularity: 4, link: "https://www.productplan.com/learn/" },
  { name: "Growth Marketing", category: "Business", popularity: 4, link: "https://growthhackers.com/" },
  { name: "Financial Modeling", category: "Business", popularity: 3, link: "https://corporatefinanceinstitute.com/resources/financial-modeling/" },
  { name: "Business Analytics", category: "Business", popularity: 3, link: "https://www.ibm.com/topics/business-analytics" },
  { name: "Resume Review", category: "Business", popularity: 4, link: "https://www.overleaf.com/latex/templates/tagged/cv" },
  { name: "Interview Preparation", category: "Business", popularity: 5, link: "https://www.interviewbit.com/" },
  { name: "Mock Interviews", category: "Business", popularity: 4, link: "https://www.pramp.com/" },
  { name: "LinkedIn Optimization", category: "Business", popularity: 4, link: "https://linkedin.github.io/" },
  { name: "Networking", category: "Business", popularity: 3, link: "https://www.linkedin.com/learning/" },
  { name: "Presentation Skills", category: "Business", popularity: 4, link: "https://www.canva.com/designschool/" },
  { name: "Technical Writing", category: "Business", popularity: 3, link: "https://developers.google.com/tech-writing" },

  // Creative
  { name: "Video Editing", category: "Creative", popularity: 5, link: "https://www.blackmagicdesign.com/products/davinciresolve/training" },
  { name: "Photography", category: "Creative", popularity: 4, link: "https://photographylife.com/" },
  { name: "Videography", category: "Creative", popularity: 4, link: "https://nofilmschool.com/" },
  { name: "Cinematography", category: "Creative", popularity: 3, link: "https://www.studiobinder.com/blog/" },
  { name: "Content Creation", category: "Creative", popularity: 5, link: "https://creatoracademy.youtube.com/" },
  { name: "Podcast Editing", category: "Creative", popularity: 3, link: "https://podcast.adobe.com/" },
  { name: "Audio Editing", category: "Creative", popularity: 3, link: "https://manual.audacityteam.org/" },
  { name: "Music Production", category: "Creative", popularity: 3, link: "https://learningmusic.ableton.com/" },
  { name: "Storytelling", category: "Creative", popularity: 4, link: "https://moth.org/" },
  { name: "Script Writing", category: "Creative", popularity: 3, link: "https://www.studiobinder.com/blog/category/screenwriting/" },
  { name: "Public Speaking", category: "Creative", popularity: 4, link: "https://www.toastmasters.org/resources" },
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
