import type { Review } from "../lib/types";

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
