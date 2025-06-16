import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { FIREBASE_DB } from '../firebase_config';

export const populateDummyMessages = async (currentUserId: string) => {
  try {
    // Dummy participants (coaches from your SQL data)
    const coaches = [
      {
        id: "1",
        firebaseId: "pGdWihV35TbdydmijyqToZOCkLs2",
        name: "Michael Johnson",
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      },
      {
        id: "3", 
        firebaseId: "xmj9WqDAsNd9Tfrr95Od84w6Ls92",
        name: "David Thompson",
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      },
      {
        id: "9",
        firebaseId: "afdafdsafda", 
        name: "James Miller",
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      }
    ];

    // Current user info (from your SQL data)
    const currentUser = {
      id: currentUserId,
      firebaseId: "EFogg1abZOeVRPDxcp541GNzk0o2",
      name: "TestFirst TestLast",
      profilePic: "profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-EFogg1abZOeVRPDxcp541GNzk0o2.jpg"
    };

    for (const coach of coaches) {
      const conversationId = `conv_${currentUser.id}_${coach.id}`;
      
      // Create conversation document
      await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
        participants: [
          {
            id: currentUser.id,
            type: 'MEMBER',
            name: currentUser.name,
            profilePic: currentUser.profilePic,
            firebaseId: currentUser.firebaseId
          },
          {
            id: coach.id,
            type: 'COACH', 
            name: coach.name,
            profilePic: coach.profilePic,
            firebaseId: coach.firebaseId
          }
        ],
        participantIds: [`MEMBER_${currentUser.id}`, `COACH_${coach.id}`],
        unreadCount: Math.floor(Math.random() * 3), // 0-2 unread messages
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Create dummy messages for this conversation
      const messages = getDummyMessages(coach.name, conversationId, currentUser, coach);
      
      for (const message of messages) {
        await addDoc(collection(FIREBASE_DB, 'messages'), message);
      }

      // Update conversation with last message
      const lastMessage = messages[messages.length - 1];
      await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
        lastMessage: {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          senderId: lastMessage.senderId
        },
        updatedAt: lastMessage.timestamp
      }, { merge: true });
    }

    console.log('✅ Dummy messages populated successfully!');
  } catch (error) {
    console.error('❌ Error populating dummy messages:', error);
  }
};

const getDummyMessages = (coachName: string, conversationId: string, currentUser: any, coach: any) => {
  const now = new Date();
  const messages = [];

  // Different message patterns for each coach
  if (coachName === "Michael Johnson") {
    messages.push(
      {
        conversationId,
        senderId: coach.id,
        senderType: 'COACH',
        senderName: coach.name,
        senderProfilePic: coach.profilePic,
        receiverId: currentUser.id,
        receiverType: 'MEMBER',
        content: "Hey! Thanks for connecting. I saw you're interested in basketball training?",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
        read: true
      },
      {
        conversationId,
        senderId: currentUser.id,
        senderType: 'MEMBER',
        senderName: currentUser.name,
        senderProfilePic: currentUser.profilePic,
        receiverId: coach.id,
        receiverType: 'COACH',
        content: "Yes! I'm looking to improve my shooting and ball handling skills.",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000)), // 2 days ago + 30 min
        read: true
      },
      {
        conversationId,
        senderId: coach.id,
        senderType: 'COACH',
        senderName: coach.name,
        senderProfilePic: coach.profilePic,
        receiverId: currentUser.id,
        receiverType: 'MEMBER',
        content: "Perfect! I have some great drills we can work on. When are you usually available?",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 1 * 60 * 60 * 1000)), // 1 hour ago
        read: false
      }
    );
  } else if (coachName === "David Thompson") {
    messages.push(
      {
        conversationId,
        senderId: currentUser.id,
        senderType: 'MEMBER',
        senderName: currentUser.name,
        senderProfilePic: currentUser.profilePic,
        receiverId: coach.id,
        receiverType: 'COACH',
        content: "Hi David! I really enjoyed our tennis session yesterday.",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 12 * 60 * 60 * 1000)), // 12 hours ago
        read: true
      },
      {
        conversationId,
        senderId: coach.id,
        senderType: 'COACH',
        senderName: coach.name,
        senderProfilePic: coach.profilePic,
        receiverId: currentUser.id,
        receiverType: 'MEMBER',
        content: "Great to hear! Your backhand is really improving. Same time next week?",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 30 * 60 * 1000)), // 30 minutes ago
        read: false
      }
    );
  } else if (coachName === "James Miller") {
    messages.push(
      {
        conversationId,
        senderId: coach.id,
        senderType: 'COACH',
        senderName: coach.name,
        senderProfilePic: coach.profilePic,
        receiverId: currentUser.id,
        receiverType: 'MEMBER',
        content: "Don't forget about our session tomorrow at 3 PM!",
        timestamp: Timestamp.fromDate(new Date(now.getTime() - 2 * 60 * 60 * 1000)), // 2 hours ago
        read: false
      }
    );
  }

  return messages;
};
