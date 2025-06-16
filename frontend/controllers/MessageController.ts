import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase_config';
import {Conversation } from '../app/types/MessageTypes';

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderType: 'COACH' | 'MEMBER',
  senderName: string,
  senderProfilePic: string | undefined,
  receiverId: string,
  receiverType: 'COACH' | 'MEMBER',
  content: string
): Promise<void> => {
  try {
    await addDoc(collection(FIREBASE_DB, 'messages'), {
      conversationId,
      senderId,
      senderType,
      senderName,
      senderProfilePic: senderProfilePic || '',
      receiverId,
      receiverType,
      content,
      timestamp: Timestamp.now(),
      read: false
    });

    // Update conversation's last message
    const conversationRef = doc(FIREBASE_DB, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        content,
        timestamp: Timestamp.now(),
        senderId
      },
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getConversationsForUser = (
  userId: string,
  userType: 'COACH' | 'MEMBER',
  callback: (conversations: Conversation[]) => void
) => {
  const q = query(
    collection(FIREBASE_DB, 'conversations'),
    where('participantIds', 'array-contains', `${userType}_${userId}`),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const conversations: Conversation[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Conversation[];
    
    callback(conversations);
  });
};
