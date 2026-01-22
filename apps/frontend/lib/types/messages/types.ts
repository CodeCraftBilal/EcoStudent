// types/chat.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  rating: number;
}

export interface Message {
  id: string;
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'system';
  status: 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
  replyTo?: string;
}

export interface Conversation {

  id: string;
  participant: User;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  item?: {
    id: string;
    sellerId: string;
    title: string;
    price: number;
    image: string;
  };
}