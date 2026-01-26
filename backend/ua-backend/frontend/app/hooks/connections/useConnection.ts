import { useState, useMemo, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { FIREBASE_DB, getFirebaseAuthSafe } from '../../../firebase_config';
import { acceptConnectionRequest, declineConnectionRequest } from '../../../controllers/ConnectionRequestController';
import { getMembersCoaches } from '../../../controllers/MemberInfoController';
import { getCoachesMembers } from '../../../controllers/CoachController';
import { useUser } from '../../contexts/UserContext';

interface ProfileData {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  biography1?: string;
  biography2?: string;
  biography?: string;
  bioPic1?: string;
  bioPic2?: string;
  skills: Array<{skill_id: number, title: string}>;
  userType: 'COACH' | 'MEMBER';
}

interface UseConnectionProps {
  profileData: ProfileData | null;
  profileId?: string;
  profileType?: 'COACH' | 'MEMBER';
  profileFirebaseId?: string;
  navigation: any;
}

export const useConnection = ({
  profileData,
  profileId,
  profileType,
  profileFirebaseId,
  navigation
}: UseConnectionProps) => {
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [customMessage, setCustomMessage] = useState("I would like to connect with you");
  const [sendingRequest, setSendingRequest] = useState(false);

  const { userData, updateUserData } = useUser();

  // Determine connection status based on user types
  const isConnected = useMemo(() => {
    console.log("Use memo triggered");
    if (!userData || !profileData || !profileId || !profileFirebaseId) return false;
    
    if (userData.userType === 'MEMBER' && profileType === 'COACH') {
      console.log("Checking if member is connected to coach");
      console.log("Connections: ", userData.connections);
      console.log("Profile Firebase ID: ", profileFirebaseId);
    
      return userData.connections?.some(conn => 
        conn.firebaseID === profileFirebaseId
      ) || false;
    } else if (userData.userType === 'COACH' && profileType === 'MEMBER') {
      console.log("Checking if coach is connected to member");
      console.log("Connections: ", userData.connections);
      console.log("Profile Firebase ID: ", profileFirebaseId);

      return userData.connections?.some(conn => 
        conn.firebaseID === profileFirebaseId
      ) || false;
    }
    
    return false;
  }, [userData?.connections, profileId, profileFirebaseId, profileType, profileData]);

  const isLoadingConnectionStatus = userData?.isLoadingConnections ?? true;

  const connectionStatus = useMemo(() => {
    if (!userData || !profileId) return { pendingIncoming: null, pendingSent: null, hasPending: false };

    const pendingIncoming = userData.pendingConnectionRequests?.find(
      request => request.senderFirebaseId === profileFirebaseId && request.status === 'PENDING'
    ) || null;

    const pendingSent = userData.sentConnectionRequests?.find(
      request => request.receiverFirebaseId === profileFirebaseId && request.status === 'PENDING'
    ) || null;

    return {
      pendingIncoming,
      pendingSent,
      hasPending: !!(pendingIncoming || pendingSent)
    };
  }, [userData?.pendingConnectionRequests, userData?.sentConnectionRequests, profileId, profileFirebaseId]);

  const buttonState = useMemo(() => {
    if (isLoadingConnectionStatus) return 'loading';
    if (isConnected) return 'connected';
    if (connectionStatus.pendingIncoming) return 'accept_decline';
    if (connectionStatus.pendingSent) return 'request_sent';
    return 'connect';
  }, [isLoadingConnectionStatus, isConnected, connectionStatus.pendingIncoming, connectionStatus.pendingSent]);

  // Get user-specific labels and content
  const getProfileSpecificData = useMemo(() => {
    if (!profileData || !userData || !profileType) return null;

    const isViewingCoach = profileType === 'COACH';
    const isViewingMember = profileType === 'MEMBER';
    
    return {
      // Biography handling
      biography1: isViewingCoach ? profileData.biography1 : profileData.biography,
      biography2: isViewingCoach ? profileData.biography2 : null,
      bioPic1: isViewingCoach ? profileData.bioPic1 : null,
      bioPic2: isViewingCoach ? profileData.bioPic2 : null,
      
      // Action labels
      connectButtonText: isViewingCoach ? 'Connect with Coach' : 'Connect with Member',
      bookButtonText: isViewingCoach ? 'Book Session' : 'Request Session',
      messageButtonText: isViewingCoach ? 'Message Coach' : 'Message Member',
      
      // Section titles
      aboutSectionTitle: isViewingCoach ? 'About Me' : 'About',
      secondaryBioTitle: isViewingCoach ? 'What UA Means to Me' : null,
      
      // Connection request labels
      requestSentText: isViewingCoach ? 'Request Sent to Coach' : 'Request Sent to Member',
      connectedText: isViewingCoach ? 'Connected with Coach' : 'Connected with Member',
      
      // Conversation participant info
      participantType: profileType,
      participantLabel: isViewingCoach ? 'Coach' : 'Member'
    };
  }, [profileData, userData, profileType]);

  const handleEmailPress = useCallback(() => {
    if (profileData?.email) {
      const emailUrl = `mailto:${profileData.email}`;
      Linking.canOpenURL(emailUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(emailUrl);
          } else {
            Alert.alert("Error", "Email app is not available on this device");
          }
        })
        .catch((err) => {
          console.error('Error opening email:', err);
          Alert.alert("Error", "Failed to open email app");
        });
    }
  }, [profileData?.email]);

  const handlePhonePress = useCallback(() => {
    if (profileData?.phone) {
      const phoneUrl = `tel:${profileData.phone}`;
      Linking.canOpenURL(phoneUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(phoneUrl);
          } else {
            Alert.alert("Error", "Phone app is not available on this device");
          }
        })
        .catch((err) => {
          console.error('Error opening phone:', err);
          Alert.alert("Error", "Failed to open phone app");
        });
    }
  }, [profileData?.phone]);

  // Create a more flexible handleMessageProfile that can work with different data structures
  const handleMessageProfile = useCallback(async (connectionData?: any) => {
    // Use passed connectionData or fall back to profileData
    const targetProfile = connectionData || profileData;
    const targetId = connectionData?.id || profileId;
    const targetFirebaseId = connectionData?.firebaseID || connectionData?.firebaseId || profileFirebaseId;
    const targetType = connectionData?.userType || profileType;

    if (!targetProfile || !userData || !targetId) {
      Alert.alert("Error", "Unable to start conversation. Please try again later.");
      return;
    }

    console.log("Handling Message Profile with target:", targetProfile);

    try {
  const currentUserFirebaseId = getFirebaseAuthSafe()?.currentUser?.uid;
      if (!currentUserFirebaseId) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      // Check if conversation already exists
      const conversationsRef = collection(FIREBASE_DB, 'conversations');
      const q = query(
        conversationsRef,
        where('participantIds', 'array-contains', currentUserFirebaseId)
      );
      
      const querySnapshot = await getDocs(q);
      let existingConversation: { id: string; participants?: any[] } | null = null;

      if (querySnapshot.size > 0) {
        // Look for existing conversation with this specific participant
        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          if (Array.isArray(data.participantIds) && data.participantIds.includes(targetFirebaseId)) {
            existingConversation = {
              id: docSnap.id,
              ...data
            };
            // stop at the first matching conversation
            break;
          }
        }
      } else {
        existingConversation = null;
      }

      let conversationId;
      let otherParticipant;

      if (existingConversation && existingConversation.participants != null) {
        console.log("Conversation Exists, navigating to existing convo", existingConversation);

        // Use existing conversation
        conversationId = existingConversation.id;
        
        // Find the other participant from existing conversation
        // Find the other participant; support both firebaseId and firebaseID keys
        otherParticipant = existingConversation.participants?.find(
          (p: any) => (p.firebaseId || p.firebaseID) !== currentUserFirebaseId
        );
      } else {
        console.log("Conversation doesnt exist, creating new one");
        // Create new conversation
        conversationId = `conv_${userData.id}_${targetProfile.id || targetId}`;
        console.log("Conversation ID: ", conversationId);
        
        // Build sanitized participant objects to avoid undefined fields (Firestore rejects undefined)
        const participantA = {
          id: userData.id != null ? String(userData.id) : '',
          type: userData.userType,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          profilePic: userData.profilePic || '',
          firebaseId: currentUserFirebaseId
        };

        const participantB = {
          id: targetProfile.id != null ? String(targetProfile.id) : (targetId != null ? String(targetId) : ''),
          type: targetType,
          name: `${targetProfile.firstName || ''} ${targetProfile.lastName || ''}`.trim(),
          profilePic: targetProfile.profilePic || '',
          firebaseId: targetFirebaseId || ''
        };

        // Ensure we have firebase ids for both participants before creating a conversation
        if (!participantA.firebaseId || !participantB.firebaseId) {
          console.error('Missing firebase id for conversation participants', { participantA, participantB });
          Alert.alert('Error', 'Unable to start conversation because one of the users is missing a Firebase ID.');
          return;
        }

        otherParticipant = participantB;

        // Create new conversation document with no undefined fields
        await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
          participants: [participantA, participantB],
          participantIds: [participantA.firebaseId, participantB.firebaseId],
          unreadCount: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      // Navigate to chat screen
      navigation.navigate('ChatScreen', {
        conversationId: conversationId,
        otherParticipant: otherParticipant
      });

    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      Alert.alert("Error", "Failed to start conversation. Please try again.");
    }
  }, [profileData, userData, navigation, profileId, profileFirebaseId, profileType]);

  const handleConnectWithProfile = useCallback(() => {
    if (!profileData || !profileId || !profileType || !profileFirebaseId) return;
    console.log("Going to send a connection request from connection profile screen", profileData);
    
    navigation.navigate('SendConnectionRequest', {
      profileId: profileFirebaseId,
      profileType,
      profileData: {
        id: profileData.id || profileId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        profilePic: profileData.profilePic
      }
    });
  }, [profileData, profileId, profileType, profileFirebaseId, navigation]);

  const handleAcceptRequest = useCallback(async () => {
    if (connectionStatus.pendingIncoming && userData) {
      setIsProcessingRequest(true);
      try {
        await acceptConnectionRequest(connectionStatus.pendingIncoming.id, userData.id);

        const updatedRequests = userData.pendingConnectionRequests.filter(
          request => request.id !== connectionStatus.pendingIncoming!.id
        );

        // Fetch updated connections based on user type
        let updatedConnections;
        if (userData.userType === 'MEMBER') {
          updatedConnections = await getMembersCoaches(userData.id);
        } else {
          updatedConnections = await getCoachesMembers(userData.id);
        }

        console.log("Updated connections before: ", updatedConnections);

        updateUserData({
          pendingConnectionRequests: updatedRequests,
          connections: updatedConnections
        });

        console.log("User Data After", userData);

        Alert.alert("Success", "Connection request accepted! You are now connected.");
      } catch (error) {
        console.error('Error accepting connection request:', error);
        Alert.alert("Error", error instanceof Error ? error.message : "Failed to accept connection request");
      } finally {
        setIsProcessingRequest(false);
      }
    }
  }, [connectionStatus.pendingIncoming, userData, updateUserData]);

  const handleDeclineRequest = useCallback(async () => {
    if (connectionStatus.pendingIncoming && userData) {
      setIsProcessingRequest(true);
      try {
        await declineConnectionRequest(connectionStatus.pendingIncoming.id, userData.id);

        const updatedRequests = userData.pendingConnectionRequests.filter(
          request => request.id !== connectionStatus.pendingIncoming!.id
        );

        updateUserData({
          pendingConnectionRequests: updatedRequests
        });

        Alert.alert("Request Declined", "Connection request has been declined.");
      } catch (error) {
        console.error('Error declining connection request:', error);
        Alert.alert("Error", error instanceof Error ? error.message : "Failed to decline connection request");
      } finally {
        setIsProcessingRequest(false);
      }
    }
  }, [connectionStatus.pendingIncoming, userData, updateUserData]);

  const handleBookSession = useCallback(() => {
    if (profileData && profileId) {
      console.log("Sending data from connection profile to request a session: ", profileData);
      console.log("ProfileId is ", profileId);
      navigation.navigate('RequestASession', { 
        recipientId: profileId,
        recipientFirebaseId: profileFirebaseId,
        recipientFirstName: profileData.firstName,
        recipientLastName: profileData.lastName,
        recipientProfilePic: profileData.profilePic,
        recipientType: profileType
      });
    }
  }, [profileData, navigation, profileType, profileId, profileFirebaseId]);

  return {
    // State
    isProcessingRequest,
    customMessage,
    sendingRequest,
    setSendingRequest,
    setCustomMessage,
    
    // Computed values
    isConnected,
    isLoadingConnectionStatus,
    connectionStatus,
    buttonState,
    getProfileSpecificData,
    
    // Handlers
    handleEmailPress,
    handlePhonePress,
    handleMessageProfile,
    handleConnectWithProfile,
    handleAcceptRequest,
    handleDeclineRequest,
    handleBookSession
  };
};
