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
  biography1?: string; // For coaches
  biography2?: string; // For coaches
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
    profileFirebaseId?: string;
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
  const { profileId, profileType, profileFirebaseId} = useMemo(() => {
    const params = route.params || {};
    
    // Handle legacy navigation calls
    let id: string | undefined;
    let type: 'COACH' | 'MEMBER' | undefined;
    let firebaseId: string | undefined;
    
    if (params.profileId && params.profileType) {
      id = params.profileId;
      type = params.profileType;
      firebaseId = params.profileFirebaseId;
    } else if (params.coachId) {
      id = params.coachId;
      type = 'COACH';
    } else if (params.memberId) {
      id = params.memberId;
      type = 'MEMBER';
    }
    
    return {
      profileId: id,
      profileType: type,
      profileFirebaseId: firebaseId
    };
  }, [route.params]);

  // Determine connection status based on user types
  const isConnected = useMemo(() => {
    console.log("Use memo triggered")
    if (!userData || !profileData || !profileId || !profileFirebaseId) return false;
    
    if (userData.userType === 'MEMBER' && profileType === 'COACH') {
      console.log("Checking if member is connected to coach")
      console.log("Connections: ", userData.connections)
      console.log("Profile Firebase ID: ", profileFirebaseId)
    
      return userData.connections?.some(conn => 
        conn.firebaseID === profileFirebaseId
      ) || false;
      

    } else if (userData.userType === 'COACH' && profileType === 'MEMBER') {
      console.log("Checking if coach is connected to member")
      console.log("Connections: ", userData.connections)
      console.log("Profile Firebase ID: ", profileFirebaseId)

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

  useEffect(() => {
    const fetchProfileData = async () => {
      // Validate required parameters
      if (!profileId || !profileType || !profileFirebaseId) {
        setError('Missing profile information. Please try navigating here again.');
        return;
      }

      try {
        setError(null);
        let fetchedData;
        console.log("Fetching profile data with firebase id of ", profileFirebaseId)
        
        if (profileType === 'COACH') {
          fetchedData = await getCoachByFirebaseId(profileFirebaseId);
          if (fetchedData) {
            fetchedData.userType = 'COACH';
          }
        } else {
          fetchedData = await getMemberByFirebaseId(profileFirebaseId);
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

  const handleMessageProfile = useCallback(async () => {
    if (!profileData || !userData || !getProfileSpecificData || !profileId) {
      Alert.alert("Error", "Unable to start conversation. Please try again later.");
      return;
    }

    console.log("Handling Message Profile")

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
      let existingConversation = {} as {id: string, participants?: []} | null;
      
      if (querySnapshot.size > 0) {
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
      }

      else {
        existingConversation = null
      }

      let conversationId;
      let otherParticipant;

      if (existingConversation != null) {
        console.log("Conversation Exists, navigating to existing convo")

        // Use existing conversation
        conversationId = existingConversation.id;
        
        // Find the other participant from existing conversation
        otherParticipant = existingConversation.participants?.find(
          (p: any) => p.firebaseId !== currentUserFirebaseId
        );
      } else {
        console.log("Conversation doesnt exist, creating new one")
        // Create new conversation
        conversationId = `conv_${userData.id}_${profileData.id}`;
        console.log("Conversation ID: ", conversationId)
        
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
    if (!profileData || !profileId || !profileType || !profileFirebaseId) return;
    console.log("Going to send a connection request from connection profile screen", profileData)
    
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
  }, [profileData, profileId, profileType, navigation]);


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

        console.log("Updated connections before: ", updatedConnections)

        updateUserData({
          pendingConnectionRequests: updatedRequests,
          connections: updatedConnections
        });

        console.log("User Data After", userData)

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

      console.log("Sending data from connection profile to request a session: ", profileData)
      console.log("ProfileId is ", profileId)
      navigation.navigate('RequestASession', { 
        recipientId: profileId,
        recipientFirebaseId: profileFirebaseId,
        recipientFirstName: profileData.firstName,
        recipientLastName: profileData.lastName,
        recipientProfilePic: profileData.profilePic,
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
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.grey.medium }}
            disabled={true}
          >
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-semibold ml-2">Loading...</Text>
          </TouchableOpacity>
        );

      case 'connected':
        return (
          <TouchableOpacity 
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.uaGreen }}
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
          <View className="mb-4">
            <Text className="text-center text-gray-600 mb-3 text-base">
              {getProfileSpecificData.participantLabel} wants to connect with you
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaGreen }}
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
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaRed }}
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
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.grey.dark }}
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
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.uaBlue }}
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
          <Ionicons name="alert-circle-outline" size={64} color={Colors.uaRed} />
          <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
            Profile Not Found
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            {error || 'The profile you are looking for could not be loaded.'}
          </Text>
          <TouchableOpacity 
            className="py-3 px-6 rounded-full mt-6"
            style={{ backgroundColor: Colors.uaBlue }}
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
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Enhanced Profile Header */}
        <View className="items-center p-6 bg-white shadow-sm">
          <View className="relative mb-4">
            <Image
              source={
                profileData.profilePic 
                  ? { uri: profileData.profilePic }
                  : require('../../images/logo.png')
              }
              className="w-32 h-32 rounded-full border-4"
              style={{ borderColor: Colors.uaBlue }}
              resizeMode="cover"
            />
            {/* User Type Badge */}
            <View 
              className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full"
              style={{ backgroundColor: profileType === 'COACH' ? Colors.uaRed : Colors.uaGreen }}
            >
              <Text className="text-white text-xs font-bold">
                {profileType === 'COACH' ? 'COACH' : 'MEMBER'}
              </Text>
            </View>
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {profileData.firstName} {profileData.lastName}
          </Text>
          
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={18} color={Colors.uaBlue} />
            <Text className="text-gray-600 ml-2 text-base">{profileData.location}</Text>
          </View>

          {/* Skills Section */}
          {skillIcons.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Skills & Interests</Text>
              <View className="flex-row flex-wrap justify-center">
                {skillIcons.map((skill, index) => (
                  <View 
                    key={index} 
                    className="flex-row items-center m-1 px-3 py-2 rounded-full"
                    style={{ backgroundColor: Colors.uaBlue + '20' }}
                  >
                    <Text className="mr-2">{skill.icon}</Text>
                    <Text 
                      className="text-sm font-medium capitalize"
                      style={{ color: Colors.uaBlue }}
                    >
                      {skill.title.replace('_', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="p-6 bg-white">
          {renderConnectionButton()}
          
          {/* Additional action buttons */}
          {isConnected && (
            <View className="flex-row space-x-3 mb-6">
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaRed }}
                onPress={handleBookSession}
              >
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.bookButtonText}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaBlue }}
                onPress={handleMessageProfile}
              >
                <Ionicons name="chatbubble" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.messageButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Contact Information */}
        {(profileData.email || profileData.phone) && (
          <View className="bg-white mx-4 p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center mb-4">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: Colors.uaBlue + '20' }}
              >
                <Ionicons name="call-outline" size={20} color={Colors.uaBlue} />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Contact Information</Text>
            </View>
            
            {profileData.email && (
              <TouchableOpacity 
                className="flex-row items-center mb-3 p-3 rounded-lg"
                style={{ backgroundColor: Colors.grey.light }}
                onPress={handleEmailPress}
              >
                <Ionicons name="mail-outline" size={20} color={Colors.uaBlue} />
                <Text className="ml-3 text-base" style={{ color: Colors.uaBlue }}>
                  {profileData.email}
                </Text>
              </TouchableOpacity>
            )}
            
            {profileData.phone && isConnected && (
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-lg"
                style={{ backgroundColor: Colors.grey.light }}
                onPress={handlePhonePress}
              >
                <Ionicons name="call-outline" size={20} color={Colors.uaBlue} />
                <Text className="text-gray-700 ml-3 text-base">{profileData.phone}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Primary Bio Section with Bio Pic 1 */}
        {getProfileSpecificData && (
          <View className="mx-4 mb-4">
            <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-row">
              {/* Bio Text - Left Side */}
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-4">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: Colors.uaGreen + '20' }}
                  >
                    <Ionicons name="person-outline" size={20} color={Colors.uaGreen} />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900 flex-1">
                    {getProfileSpecificData.aboutSectionTitle}
                  </Text>
                </View>
                <ScrollView 
                  style={{ maxHeight: 200 }}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  <Text className="text-gray-700 leading-6 text-base">
                    {getProfileSpecificData.biography1}
                  </Text>
                </ScrollView>
              </View>
              
              {/* Bio Picture 1 - Right Side */}
              {getProfileSpecificData.bioPic1 && (
                <View className="w-32 h-48 ml-2">
                  <Image
                    source={{ uri: getProfileSpecificData.bioPic1 }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* Secondary Bio Section with Bio Pic 2 (flipped layout) */}
        {getProfileSpecificData?.biography2 && getProfileSpecificData.secondaryBioTitle && (
          <View className="mx-4 mb-4">
            <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-row">
              {/* Bio Picture 2 - Left Side */}
              {getProfileSpecificData.bioPic2 && (
                <View className="w-32 h-48 mr-4">
                  <Image
                    source={{ uri: getProfileSpecificData.bioPic2 }}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                  />
                </View>
              )}
              
              {/* Bio Text - Right Side */}
              <View className="flex-1">
                <View className="flex-row items-center mb-4">
                  <View 
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: Colors.uaRed + '20' }}
                  >
                    <Ionicons name="heart-outline" size={20} color={Colors.uaRed} />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900 flex-1">
                    {getProfileSpecificData.secondaryBioTitle}
                  </Text>
                </View>
                <ScrollView 
                  style={{ maxHeight: 200 }}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  <Text className="text-gray-700 leading-6 text-base">
                    {getProfileSpecificData.biography2}
                  </Text>
                </ScrollView>
              </View>
            </View>
          </View>
        )}


        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectionProfile;
