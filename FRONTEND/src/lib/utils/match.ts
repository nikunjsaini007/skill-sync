import type { UserProfile } from "@/lib/types";

export function calculateMatchScore(
  userA: { skillsOffered: string[]; skillsWanted: string[]; experience?: string },
  userB: UserProfile
) {
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
    reasons.push(
      `Perfect mutual fit: You can teach them ${mutualHelp1.join(", ")} and they can teach you ${mutualHelp2.join(", ")}.`
    );
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
      reasons.push(
        `Complimentary levels: A great chance for mentor-mentee learning (${userA.experience} & ${userB.experience}).`
      );
    }
  }

  score = Math.min(Math.max(score, 30), 98);

  return {
    score,
    explanation: reasons.length > 0 ? reasons.join(" ") : "Perfect platform synergy for dual growth!",
  };
}
