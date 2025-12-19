import { Conversation, Message, User } from "@/lib/types/messages/types";

// Mock data
export const currentUser: User = {
  id: "user1",
  name: "You",
  avatar: "/api/placeholder/100/100",
  verified: true,
  isOnline: true,
  rating: 4.9
};


export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participant: {
      id: "user2",
      name: "Ali Ahmed",
      avatar: "/dashboard/messages/ali.png",
      verified: true,
      isOnline: true,
      rating: 4.8
    },
    lastMessage: "Hi, I'm interested in the Calculus book. Is it still available?",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 2,
    item: {
      id: "item1",
      title: "Calculus Early Transcendentals",
      price: 2500,
      image: "/dashboard/messages/sara.png"
    }
  },
  {
    id: "conv2",
    participant: {
      id: "user3",
      name: "Sara Khan",
      avatar: "/dashboard/messages/sara.png",
      verified: true,
      isOnline: false,
      lastSeen: "2 hours ago",
      rating: 4.9
    },
    lastMessage: "Thanks for the uniform! It fits perfectly.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    item: {
      id: "item2",
      title: "Oxford University Uniform",
      price: 1500,
      image: "/dashboard/messages/ali.png"
    }
  },
  {
    id: "conv3",
    participant: {
      id: "user4",
      name: "Bilal Raza",
      avatar: "/dashboard/messages/bilal.png",
      verified: false,
      isOnline: true,
      rating: 4.5
    },
    lastMessage: "Can we meet tomorrow at the library?",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    item: {
      id: "item3",
      title: "Scientific Calculator FX-991ES",
      price: 800,
      image: "/api/placeholder/80/80"
    }
  }
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "u1",
    receiverId: "user1",
    content: "<div dangerouslySetInnerHTML={{__html: '<script>alert(\"Hacked!\")</script>'}}> </div>",
    timestamp: "2025-01-15T09:25:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "m2",
    senderId: "user1",
    receiverId: "u1",
    content: "Yes, it is still available.",
    timestamp: "2025-01-15T09:26:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "m3",
    senderId: "u1",
    receiverId: "user1",
    content: "Can you share more pictures?",
    timestamp: "2025-01-15T09:27:00Z",
    type: "text",
    status: "delivered",
  },
  {
    id: "m4",
    senderId: "user1",
    receiverId: "u1",
    content: "Sure, uploading now.",
    timestamp: "2025-01-15T09:28:00Z",
    type: "text",
    status: "sent",
  },
  {
    id: "m5",
    senderId: "u1",
    receiverId: "user1",
    content: "/images/laptop-side.jpg",
    timestamp: "2025-01-15T09:29:00Z",
    type: "image",
    status: "sent",
  },
  {
    id: "m6",
    senderId: "user1",
    receiverId: "u1",
    content: "/images/laptop-side.jpg",
    timestamp: "2025-01-15T09:29:00Z",
    type: "image",
    status: "delivered",
  },
];
