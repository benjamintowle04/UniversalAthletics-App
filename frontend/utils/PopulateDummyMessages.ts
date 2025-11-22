import { createConversation, addMessageToConversation } from '../controllers/MessageController';
import { getFirebaseAuthSafe } from '../firebase_config';

export const populateSimpleDummyMessages = async () => {
  try {
  const currentUser = getFirebaseAuthSafe()?.currentUser;
    if (!currentUser) {
      console.error('User not authenticated');
      return;
    }

    console.log('Populating dummy messages for user:', currentUser.uid);

    const currentUserData = {
      id: "2", 
      firebaseId: currentUser.uid,
      name: "Benjamin Towle",
      type: 'MEMBER' as const,
      profilePic: "profiles/f9ebd5e2-25d4-49ce-97b3-b18c74ee2677-profile-picture-KDCMIgU1EcYi3ILUdMpo7y5JT372.jpg"
    };

    // Define some coaches (adjust these to match your actual coach data)
    const coaches = [
      {
        id: "1",
        firebaseId: "pGdWihV35TbdydmijyqToZOCkLs2", // Michael Johnson's Firebase ID
        name: "Michael Johnson",
        type: 'COACH' as const,
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      },
      {
        id: "3",
        firebaseId: "xmj9WqDAsNd9Tfrr95Od84w6Ls92", // David Thompson's Firebase ID
        name: "David Thompson",
        type: 'COACH' as const,
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      },
      {
        id: "9",
        firebaseId: "afdafdsafda", // James Miller's Firebase ID
        name: "James Miller",
        type: 'COACH' as const,
        profilePic: "profiles/63658376-ead5-4ed9-a7eb-3e4c19dc59aa-profile-picture-xmj9WqDAsNd9Tfrr95Od84w6Ls92.jpg"
      }
    ];

    for (const coach of coaches) {
      console.log(`Creating conversation with ${coach.name}...`);
      
      // Create conversation
      const conversationId = await createConversation(currentUserData, coach);
      
      // Add messages based on coach
      if (coach.name === "Michael Johnson") {
        // Conversation with multiple messages
        await addMessageToConversation(
          conversationId,
          coach,
          { firebaseId: currentUserData.firebaseId, type: currentUserData.type },
          "testSender1",
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        );
        
        await addMessageToConversation(
          conversationId,
          currentUserData,
          { firebaseId: coach.firebaseId, type: coach.type },
          "testReceiver1",
          new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) // 2 days ago + 30 min
        );
        
        await addMessageToConversation(
          conversationId,
          coach,
          { firebaseId: currentUserData.firebaseId, type: currentUserData.type },
          "testSender2",
          new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        );
        
      } else if (coach.name === "David Thompson") {
        // Conversation with fewer messages
        await addMessageToConversation(
          conversationId,
          currentUserData,
          { firebaseId: coach.firebaseId, type: coach.type },
          "testSender3",
          new Date(Date.now() - 12 * 60 * 60 * 1000)
        );
        
        await addMessageToConversation(
          conversationId,
          coach,
          { firebaseId: currentUserData.firebaseId, type: currentUserData.type },
          "testReceiver2",
          new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        );
        
      } else if (coach.name === "James Miller") {
        // Just one message
        await addMessageToConversation(
          conversationId,
          coach,
          { firebaseId: currentUserData.firebaseId, type: currentUserData.type },
          "testSender4",
          new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        );
      }
    }

    console.log('✅ Simple dummy messages populated successfully!');
  } catch (error) {
    console.error('❌ Error populating dummy messages:', error);
  }
};
