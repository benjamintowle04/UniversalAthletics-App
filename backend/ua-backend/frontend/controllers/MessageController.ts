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
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebase_config';
import { Conversation } from '../app/types/MessageTypes';

// Send a new message
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
    console.log('Sending message:', { conversationId, senderId, content: content.substring(0, 50) });

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

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get all conversations for the current user
export const getConversationsForUser = (
  callback: (conversations: Conversation[]) => void
) => {
  const firebaseUid = FIREBASE_AUTH.currentUser?.uid;
  
  if (!firebaseUid) {
    console.error('User not authenticated');
    callback([]);
    return () => {};
  }

  console.log('Getting conversations for Firebase UID:', firebaseUid);
  
  const q = query(
    collection(FIREBASE_DB, 'conversations'),
    where('participantIds', 'array-contains', firebaseUid),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, async (snapshot) => {
    console.log('Conversations snapshot received:', snapshot.size, 'documents');
    
    const conversations = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        // Calculate real unread count
        const unreadCount = await getUnreadMessageCount(doc.id, firebaseUid);
        
        return {
          id: doc.id,
          ...data,
          unreadCount,
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      })
    );
    
    callback(conversations as Conversation[]);
  }, (error) => {
    console.error('Error getting conversations:', error);
    callback([]);
  });
};

// Get messages for a specific conversation
export const getMessagesForConversation = (
  conversationId: string,
  callback: (messages: any[]) => void
) => {
  console.log('Setting up messages listener for conversation:', conversationId);
  
  const q = query(
    collection(FIREBASE_DB, 'messages'),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    console.log('Messages snapshot received for', conversationId, ':', snapshot.size, 'documents');
    
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    callback(messages);
  }, (error) => {
    console.error('Error getting messages:', error);
    callback([]);
  });
};

// Calculate unread message count for a conversation
export const getUnreadMessageCount = async (
  conversationId: string,
  userId: string
): Promise<number> => {
  try {
    const q = query(
      collection(FIREBASE_DB, 'messages'),
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
};

// Mark messages as read when user opens a conversation
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
) => {
  try {
    const q = query(
      collection(FIREBASE_DB, 'messages'),
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    console.log('Marking', snapshot.size, 'messages as read');
    
    const updatePromises = snapshot.docs.map(messageDoc => {
      return updateDoc(doc(FIREBASE_DB, 'messages', messageDoc.id), {
        read: true
      });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

// Get all existing conversations (for debugging)
export const getAllConversations = async () => {
  try {
    const snapshot = await getDocs(collection(FIREBASE_DB, 'conversations'));
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('All conversations:', conversations);
    return conversations;
  } catch (error) {
    console.error('Error getting all conversations:', error);
    return [];
  }
};

// Get all existing messages (for debugging)
export const getAllMessages = async () => {
  try {
    const snapshot = await getDocs(collection(FIREBASE_DB, 'messages'));
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('All messages:', messages);
    return messages;
  } catch (error) {
    console.error('Error getting all messages:', error);
    return [];
  }
};

// Create a conversation between two users
export const createConversation = async (
  user1: { id: string; firebaseId: string; name: string; type: 'COACH' | 'MEMBER'; profilePic?: string },
  user2: { id: string; firebaseId: string; name: string; type: 'COACH' | 'MEMBER'; profilePic?: string }
) => {
  try {
    const conversationId = `conv_${user1.id}_${user2.id}`;
    
    const conversationData = {
      participants: [
        {
          id: user1.id,
          type: user1.type,
          name: user1.name,
          profilePic: user1.profilePic || '',
          firebaseId: user1.firebaseId
        },
        {
          id: user2.id,
          type: user2.type,
          name: user2.name,
          profilePic: user2.profilePic || '',
          firebaseId: user2.firebaseId
        }
      ],
      participantIds: [user1.firebaseId, user2.firebaseId],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastMessage: null
    };
    
    await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), conversationData);
    console.log('Created conversation:', conversationId);
    
    return conversationId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

// Add a message to an existing conversation
export const addMessageToConversation = async (
  conversationId: string,
  sender: { firebaseId: string; name: string; type: 'COACH' | 'MEMBER'; profilePic?: string },
  receiver: { firebaseId: string; type: 'COACH' | 'MEMBER' },
  content: string,
  timestamp?: Date
) => {
  try {
    const messageData = {
      conversationId,
      senderId: sender.firebaseId,
      senderType: sender.type,
      senderName: sender.name,
      senderProfilePic: sender.profilePic || '',
      receiverId: receiver.firebaseId,
      receiverType: receiver.type,
      content,
      timestamp: timestamp ? Timestamp.fromDate(timestamp) : Timestamp.now(),
      read: false
    };
    
    const messageRef = await addDoc(collection(FIREBASE_DB, 'messages'), messageData);
    
    // Update conversation's last message
    await updateDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
      lastMessage: {
        content,
        timestamp: messageData.timestamp,
        senderId: sender.firebaseId
      },
      updatedAt: messageData.timestamp
    });
    
    console.log('Added message to conversation:', conversationId);
    return messageRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};

// Add this new function to MessageController.ts

// Get conversations with real-time unread count updates
export const getConversationsWithLiveUnreadCounts = (
  callback: (conversations: Conversation[]) => void
) => {
  const firebaseUid = FIREBASE_AUTH.currentUser?.uid;
  
  if (!firebaseUid) {
    console.error('User not authenticated');
    callback([]);
    return () => {};
  }

  console.log('Getting conversations with live unread counts for:', firebaseUid);
  
  const conversationsQuery = query(
    collection(FIREBASE_DB, 'conversations'),
    where('participantIds', 'array-contains', firebaseUid),
    orderBy('updatedAt', 'desc')
  );

  // Also listen to ALL messages to detect read status changes
  const messagesQuery = query(
    collection(FIREBASE_DB, 'messages'),
    where('receiverId', '==', firebaseUid)
  );

  let conversations: any[] = [];
  let allMessages: any[] = [];

  const updateConversationsWithCounts = () => {
    const conversationsWithCounts = conversations.map(conversation => {
      // Count unread messages for this conversation
      const unreadCount = allMessages.filter(message => 
        message.conversationId === conversation.id && 
        message.receiverId === firebaseUid && 
        !message.read
      ).length;

      console.log("unread count from controller: ", unreadCount)
      return {
        ...conversation,
        unreadCount
      };
    });

    callback(conversationsWithCounts as Conversation[]);
  };

  // Listen to conversations
  const unsubscribeConversations = onSnapshot(conversationsQuery, (snapshot) => {
    console.log('Conversations updated:', snapshot.size);
    conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }));
    
    updateConversationsWithCounts();
  });

  // Listen to messages (for real-time unread count updates)
  const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
    console.log('Messages updated for unread count calculation:', snapshot.size);
    allMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    updateConversationsWithCounts();
  });

  // Return cleanup function
  return () => {
    unsubscribeConversations();
    unsubscribeMessages();
  };
};

