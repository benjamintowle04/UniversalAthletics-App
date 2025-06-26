import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { getCoachByFirebaseId } from '../../../controllers/CoachController'
import { getMemberByFirebaseId } from '../../../controllers/MemberInfoController'
import { Ionicons } from '@expo/vector-icons'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { useUser } from '../../contexts/UserContext'
import { Colors } from '../../themes/colors/Colors'
import { acceptConnectionRequest, declineConnectionRequest, createMemberToCoachConnectionRequest, createCoachToMemberConnectionRequest } from '../../../controllers/ConnectionRequestController'
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { getCoachesMembers } from '../../../controllers/CoachController'
import { getUnsignedUrl } from '../../../utils/UnsignUrls'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { FIREBASE_DB } from '../../../firebase_config';
import { Platform } from 'react-native'

// Generic interface for profile data that works for both coaches and members
interface ProfileData {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  bio1?: string; // For coaches
  bio2?: string; // For coaches
  biography?: string; // For members
  bioPic1?: string; // For coaches
  bioPic2?: string; // For coaches
  skills: Array<{skill_id: number, title: string}>;
  userType: 'COACH' | 'MEMBER';
}

import { RouteProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../firebase_config'

// Make route params optional to handle undefined cases
type ConnectionProfileRouteProp = RouteProp<{ 
  params?: { 
    profileId?: string; 
    profileType?: 'COACH' | 'MEMBER';
    // Legacy support for existing navigation calls
    coachId?: string;
    memberId?: string;
  } 
}, 'params'>;

interface ConnectionProfileProps extends RouterProps {
  route: ConnectionProfileRouteProp;
}

const ConnectionProfile = ({ route, navigation }: ConnectionProfileProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [customMessage, setCustomMessage] = useState("I would like to connect with you");
  const [sendingRequest, setSendingRequest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userData, updateUserData } = useUser();

  // Extract and validate route parameters with fallbacks
  const { profileId, profileType } = useMemo(() => {
    const params = route.params || {};
    
    // Handle legacy navigation calls
    let id: string | undefined;
    let type: 'COACH' | 'MEMBER' | undefined;
    
    if (params.profileId && params.profileType) {
      // New format
      id = params.profileId;
      type = params.profileType;
    } else if (params.coachId) {
      // Legacy coach navigation
      id = params.coachId;
      type = 'COACH';
    } else if (params.memberId) {
      // Legacy member navigation
      id = params.memberId;
      type = 'MEMBER';
    }
    
    return {
      profileId: id,
      profileType: type
    };
  }, [route.params]);

  // Determine connection status based on user types
  const isConnected = useMemo(() => {
    if (!userData || !profileData || !profileId) return false;
    
    if (userData.userType === 'MEMBER' && profileType === 'COACH') {
      return userData.connections?.some(conn => 
        conn.firebaseID === profileId && conn.userType === 'COACH'
      ) || false;
    } else if (userData.userType === 'COACH' && profileType === 'MEMBER') {
      return userData.connections?.some(conn => 
        conn.firebaseID === profileId && conn.userType === 'MEMBER'
      ) || false;
    }
    
    return false;
  }, [userData?.connections, profileId, profileType, profileData]);

  const isLoadingConnectionStatus = userData?.isLoadingConnections ?? true;

  const connectionStatus = useMemo(() => {
    if (!userData || !profileId) return { pendingIncoming: null, pendingSent: null, hasPending: false };

    const pendingIncoming = userData.pendingConnectionRequests?.find(
      request => request.senderFirebaseId === profileId
    ) || null;

    const pendingSent = userData.sentConnectionRequests?.find(
      request => request.receiverFirebaseId === profileId && request.status === 'PENDING'
    ) || null;

    return {
      pendingIncoming,
      pendingSent,
      hasPending: !!(pendingIncoming || pendingSent)
    };
  }, [userData?.pendingConnectionRequests, userData?.sentConnectionRequests, profileId]);

  const skillIcons = useMemo(() => {
    return profileData?.skills ? getIconsFromSkills(profileData.skills) : [];
  }, [profileData?.skills]);

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
      primaryBio: isViewingCoach ? profileData.bio1 : profileData.biography,
      secondaryBio: isViewingCoach ? profileData.bio2 : null,
      bioPic: isViewingCoach ? profileData.bioPic1 : null,
      
      // Action labels
      connectButtonText: isViewingCoach ? 'Connect with Coach' : 'Connect with Member',
      bookButtonText: isViewingCoach ? 'Book Session' : 'Request Session',
      messageButtonText: isViewingCoach ? 'Message Coach' : 'Message Member',
      
      // Section titles
      aboutSectionTitle: 'About',
      secondaryBioTitle: isViewingCoach ? 'What UA Means to me' : null,
      
      // Connection request labels
      requestSentText: isViewingCoach ? 'Request Sent to Coach' : 'Request Sent to Member',
      connectedText: isViewingCoach ? 'Connected with Coach' : 'Connected with Member',
      
      // Conversation participant info
      participantType: profileType,
      participantLabel: isViewingCoach ? 'Coach' : 'Member'
    };
  }, [profileData, userData, profileType]);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Validate required parameters
      if (!profileId || !profileType) {
        setError('Missing profile information. Please try navigating here again.');
        return;
      }

      try {
        setError(null);
        let fetchedData;
        
        if (profileType === 'COACH') {
          fetchedData = await getCoachByFirebaseId(profileId);
          if (fetchedData) {
            fetchedData.userType = 'COACH';
          }
        } else {
          fetchedData = await getMemberByFirebaseId(profileId);
          if (fetchedData) {
            fetchedData.userType = 'MEMBER';
          }
        }
        
        if (!fetchedData) {
          setError(`${profileType.toLowerCase()} profile not found.`);
          return;
        }
        
        setProfileData(fetchedData);
      } catch (error) {
        console.error(`Error fetching ${profileType?.toLowerCase()} data:`, error);
        setError(`Failed to load ${profileType?.toLowerCase()} profile. Please try again.`);
      }
    };
    
    fetchProfileData();
  }, [profileId, profileType]);

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

  const handleMessageProfile = useCallback(async () => {
    if (!profileData || !userData || !getProfileSpecificData || !profileId) {
      Alert.alert("Error", "Unable to start conversation. Please try again later.");
      return;
    }

    try {
      const currentUserFirebaseId = FIREBASE_AUTH.currentUser?.uid;
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
      let existingConversation = {} as {id: string, participants?: []};
      
      // Look for existing conversation with this specific participant
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participantIds.includes(profileData.firebaseID || profileId)) {
          existingConversation = {
            id: doc.id,
            ...data
          };
        }
      });

      let conversationId;
      let otherParticipant;

      if (existingConversation) {
        // Use existing conversation
        conversationId = existingConversation.id;
        
        // Find the other participant from existing conversation
        otherParticipant = existingConversation.participants?.find(
          (p: any) => p.firebaseId !== currentUserFirebaseId
        );
      } else {
        // Create new conversation
        conversationId = `conv_${userData.id}_${profileData.id}`;
        
        otherParticipant = {
          id: profileData.id,
          type: profileData.userType,
          name: `${profileData.firstName} ${profileData.lastName}`,
          profilePic: profileData.profilePic,
          firebaseId: profileData.firebaseID || profileId
        };

        // Create new conversation document
        await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
          participants: [
            {
              id: userData.id.toString(),
              type: userData.userType,
              name: `${userData.firstName} ${userData.lastName}`,
              profilePic: userData.profilePic,
              firebaseId: currentUserFirebaseId
            },
            otherParticipant
          ],
          participantIds: [currentUserFirebaseId, profileData.firebaseID || profileId],
          unreadCount: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      // Navigate to chat screen - use ConnectionChat since we're coming from ConnectionProfile
      navigation.navigate('ChatScreen', {
        conversationId: conversationId,
        otherParticipant: otherParticipant
      });

    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      Alert.alert("Error", "Failed to start conversation. Please try again.");
    }
  }, [profileData, userData, navigation, getProfileSpecificData, profileId]);

  
  // Replace the handleConnectWithProfile function:
  const handleConnectWithProfile = useCallback(() => {
  if (!profileData || !profileId || !profileType) return;
  
  navigation.navigate('SendConnectionRequest', {
    profileId,
    profileType,
    profileData: {
      id: profileData.id || profileId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      profilePic: profileData.profilePic
    }
  });
}, [profileData, profileId, profileType, navigation]);

  // Send connection request based on user types
  const handleSendConnectionRequest = useCallback(async () => {
    if (!userData || !profileData || !getProfileSpecificData || !profileId || !profileType) return;
    
    setSendingRequest(true);
    setIsProcessingRequest(true);
    
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      // Prepare the connection request data
      const connectionRequestData = {
        senderType: userData.userType,
        senderId: userData.id,
        senderFirebaseId: currentUser.uid,
        receiverType: profileType,
        receiverId: parseInt(profileData.id || '0'),
        receiverFirebaseId: profileId,
        senderFirstName: userData.firstName,
        senderLastName: userData.lastName,
        senderProfilePic: getUnsignedUrl(userData.profilePic),
        receiverFirstName: profileData.firstName,
        receiverLastName: profileData.lastName,
        receiverProfilePic: getUnsignedUrl(profileData.profilePic),
        message: customMessage,
        status: 'PENDING' as const
      };

      // Use appropriate controller function based on user types
      let createdRequest;
      if (userData.userType === 'MEMBER' && profileType === 'COACH') {
        createdRequest = await createMemberToCoachConnectionRequest(connectionRequestData);
      } else if (userData.userType === 'COACH' && profileType === 'MEMBER') {
        createdRequest = await createCoachToMemberConnectionRequest(connectionRequestData);
      } else {
        throw new Error("Invalid user type combination for connection request");
      }

      if (userData.sentConnectionRequests) {
        // Create the new request object for local storage
        const newRequest = {
          id: createdRequest.id,
          senderType: userData.userType,
          senderId: userData.id,
          senderFirebaseId: currentUser.uid,
          receiverType: profileType,
          receiverId: parseInt(profileData.id || '0'),
          receiverFirebaseId: profileId,
          status: 'PENDING' as const,
          message: customMessage,
          createdAt: createdRequest.createdAt || new Date().toISOString(),
          updatedAt: createdRequest.updatedAt || new Date().toISOString(),
          senderFirstName: userData.firstName,
          senderLastName: userData.lastName,
          senderProfilePic: userData.profilePic,
          receiverFirstName: profileData.firstName,
          receiverLastName: profileData.lastName,
          receiverProfilePic: profileData.profilePic,
        };
        
        updateUserData({
          sentConnectionRequests: [...userData.sentConnectionRequests, newRequest]
        });
      }

      Alert.alert("Success", "Connection request sent successfully!");
    } catch (error) {
      console.error('Error sending connection request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to send connection request");
    } finally {
      setSendingRequest(false);
      setIsProcessingRequest(false);
    }
  }, [userData, profileData, profileId, profileType, updateUserData, customMessage, getProfileSpecificData]);

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

        updateUserData({
          pendingConnectionRequests: updatedRequests,
          connections: updatedConnections || userData.connections
        });

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
      navigation.navigate('RequestASession', { 
        recipientId: profileData.firebaseID || profileId,
        recipientType: profileType
      });
    }
  }, [profileData, navigation, profileType, profileId]);

  const renderConnectionButton = () => {
    if (!getProfileSpecificData) return null;

    switch (buttonState) {
      case 'loading':
        return (
          <TouchableOpacity 
            className="bg-gray-400 py-3 px-6 rounded-full flex-row items-center justify-center mb-3"
            disabled={true}
          >
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-semibold ml-2">Loading...</Text>
          </TouchableOpacity>
        );

      case 'connected':
        return (
          <TouchableOpacity 
            className="bg-green-500 py-3 px-6 rounded-full flex-row items-center justify-center mb-3"
            disabled={true}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {getProfileSpecificData.connectedText}
            </Text>
          </TouchableOpacity>
        );

      case 'accept_decline':
        return (
          <View className="mb-3">
            <Text className="text-center text-gray-600 mb-2">
              {getProfileSpecificData.participantLabel} wants to connect with you
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="bg-green-500 py-3 px-6 rounded-full flex-1 flex-row items-center justify-center"
                onPress={handleAcceptRequest}
                disabled={isProcessingRequest}
              >
                {isProcessingRequest ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Accept</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-red-500 py-3 px-6 rounded-full flex-1 flex-row items-center justify-center"
                onPress={handleDeclineRequest}
                disabled={isProcessingRequest}
              >
                {isProcessingRequest ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="close" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Decline</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'request_sent':
        return (
          <TouchableOpacity 
            className="bg-yellow-500 py-3 px-6 rounded-full flex-row items-center justify-center mb-3"
            disabled={true}
          >
            <Ionicons name="time" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {getProfileSpecificData.requestSentText}
            </Text>
          </TouchableOpacity>
        );

      case 'connect':
      default:
        return (
          <TouchableOpacity 
            className="bg-blue-500 py-3 px-6 rounded-full flex-row items-center justify-center mb-3"
            onPress={handleConnectWithProfile}
            disabled={isProcessingRequest}
          >
            {isProcessingRequest ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.connectButtonText}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
    }
  };

  // Show error state if parameters are missing or invalid
  if (error || !profileId || !profileType) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
            Profile Not Found
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            {error || 'The profile you are looking for could not be loaded.'}
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 py-3 px-6 rounded-full mt-6"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (!profileData || !getProfileSpecificData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.uaBlue} />
          <Text className="mt-2 text-gray-600">
            Loading {profileType.toLowerCase()} profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="items-center p-6 bg-gray-50">
          <Image
            source={
              profileData.profilePic 
                ? { uri: profileData.profilePic }
                : require('../../images/logo.png')
            }
            className="w-32 h-32 rounded-full mb-4"
            resizeMode="cover"
          />
          
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {profileData.firstName} {profileData.lastName}
          </Text>
          
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="text-gray-600 ml-1">{profileData.location}</Text>
          </View>

          <Text className="text-sm text-gray-500 mb-4 capitalize">
            {profileType.toLowerCase()}
          </Text>

        </View>

        {/* Action Buttons */}
        <View className="p-6">
          {renderConnectionButton()}
          
          {/* Additional action buttons */}
          <View className="flex-row space-x-3 mb-6">
            {isConnected && (
              <TouchableOpacity 
                className="bg-purple-500 py-3 px-6 rounded-full flex-1 flex-row items-center justify-center"
                onPress={handleBookSession}
              >
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.bookButtonText}
                </Text>
              </TouchableOpacity>
            )}
            
            {isConnected && (
              <TouchableOpacity 
                className="bg-blue-600 py-3 px-6 rounded-full flex-1 flex-row items-center justify-center"
                onPress={handleMessageProfile}
              >
                <Ionicons name="chatbubble" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.messageButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Contact Information */}
          {(profileData.email || profileData.phone) && (
            <View className="bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Contact</Text>
              
              {profileData.email && (
                <TouchableOpacity 
                  className="flex-row items-center mb-2"
                  onPress={handleEmailPress}
                >
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <Text className="text-blue-600 ml-2 underline">{profileData.email}</Text>
                </TouchableOpacity>
              )}
              
              {profileData.phone && (
                <View className="flex-row items-center">
                  <Ionicons name="call-outline" size={20} color="#666" />
                  <Text className="text-gray-700 ml-2">{profileData.phone}</Text>
                </View>
              )}
            </View>
          )}

          {/* About Section */}
          {getProfileSpecificData.primaryBio && (
            <View className="bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                {getProfileSpecificData.aboutSectionTitle}
              </Text>
              <Text className="text-gray-700 leading-6">
                {getProfileSpecificData.primaryBio}
              </Text>
            </View>
          )}

          {/* Secondary Bio Section (for coaches) */}
          {getProfileSpecificData.secondaryBio && getProfileSpecificData.secondaryBioTitle && (
            <View className="bg-gray-50 p-4 rounded-lg mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                {getProfileSpecificData.secondaryBioTitle}
              </Text>
              <Text className="text-gray-700 leading-6">
                {getProfileSpecificData.secondaryBio}
              </Text>
            </View>
          )}

          {/* Bio Picture (for coaches) */}
          {getProfileSpecificData.bioPic && (
            <View className="mb-6">
              <Image
                source={{ uri: getProfileSpecificData.bioPic }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectionProfile;
