export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'COACH' | 'MEMBER';
  senderName: string;
  senderProfilePic?: string;
  receiverId: string;
  receiverType: 'COACH' | 'MEMBER';
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    type: 'COACH' | 'MEMBER';
    name: string;
    profilePic?: string;
    firebaseId: string;
  }[];
  lastMessage?: {
    content: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  updatedAt: Date;
}
