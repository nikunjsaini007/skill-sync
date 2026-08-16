import type { Connection, Message, Notification } from "../lib/types";

export const seedConnections: Connection[] = [
  {
    id: "conn-1",
    senderId: "user-2",
    receiverId: "current-user-id",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "conn-2",
    senderId: "user-1",
    receiverId: "current-user-id",
    status: "accepted",
    createdAt: new Date().toISOString(),
  },
];

export const seedMessages: Message[] = [
  {
    id: "msg-1",
    connectionId: "conn-2",
    senderId: "user-1",
    text: "Hey! I saw your profile and we look like a good fit. I can teach React if you help me with Figma basics.",
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    read: true,
  },
  {
    id: "msg-2",
    connectionId: "conn-2",
    senderId: "current-user-id",
    text: "Perfect. I can share some simple UI ideas and we can swap notes this week.",
    createdAt: new Date(Date.now() - 30000000).toISOString(),
    read: true,
  },
  {
    id: "msg-3",
    connectionId: "conn-2",
    senderId: "user-1",
    text: "Great. Let’s keep it simple and set up a short call this weekend.",
    createdAt: new Date(Date.now() - 20000000).toISOString(),
    read: true,
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "not-1",
    userId: "current-user-id",
    type: "connection_request",
    title: "New Request",
    content: "Meera Nair wants to swap design and coding tips.",
    createdAt: new Date().toISOString(),
    read: false,
  },
];
