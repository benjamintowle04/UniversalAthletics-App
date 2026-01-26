import { View, Text, ScrollView, TouchableOpacity, Image, Alert,  Modal, FlatList } from 'react-native'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import { acceptConnectionRequest, declineConnectionRequest } from '../../../controllers/ConnectionRequestController'
import { declineSessionRequest } from '../../../controllers/SessionRequestController'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"

import { 
  getConversationsWithLiveUnreadCounts, 
  getAllConversations, 
  getAllMessages,
  markMessagesAsRead 
} from '../../../controllers/MessageController';

import { 
  collection,
  doc, 
  getDocs, 
  query, 
  setDoc, 
  Timestamp, 
  where
} from 'firebase/firestore';

import { getFirebaseAuthSafe, FIREBASE_DB } from '../../../firebase_config';
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { getCoachesMembers } from '../../../controllers/CoachController'


const InboxHome = ({navigation}: RouterProps) => {
  const { userData, updateUserData } = useUser()
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())
  const [conversations, setConversations] = useState<any[]>([]);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [creatingConversation, setCreatingConversation] = useState(false);


  // Use useMemo to ensure the component re-renders when requests change
  const connectionRequests = useMemo(() => {
    return userData?.pendingConnectionRequests || []
  }, [userData?.pendingConnectionRequests])

  const sessionRequests = useMemo(() => {
    return userData?.pendingSessionRequests || []
  }, [userData?.pendingSessionRequests])

   useEffect(() => {
    if (!userData?.id) {
      console.log('No user data available');
      return;
    }

    if (!getFirebaseAuthSafe()?.currentUser) {
      console.log('Firebase user not authenticated');
      return;
    }

    console.log('Setting up live conversations listener for user:', userData.id);

    const unsubscribe = getConversationsWithLiveUnreadCounts((conversations) => {
      console.log('Received conversations with live unread counts:', conversations.map(c => ({
        id: c.id,
        unreadCount: c.unreadCount
      })));
      
      // Set the local screen's instance of conversations
      setConversations(conversations);
      
    });

    return () => {
      console.log('Cleaning up live conversations listener');
      unsubscribe();
    };
  }, [userData?.id])




  const handleConnectionRequestPress = (request: any) => {
    if (request.senderFirebaseId) {
      navigation.navigate('ConnectionProfile', {
        profileId: request.senderId,
        profileFirebaseId: request.senderFirebaseId, 
        profileType: request.senderType,
        coachId: request.senderType === "COACH" ? request.senderId : request.receiverId,
        memberId: request.senderType === "MEMBER" ? request.senderId : request.receiverId,                                 
      });
    } else {
      console.error('No sender Firebase ID found in connection request:', request);
    }
  }

  const handleSessionRequestPress = (request: any) => {
    if (request.senderFirebaseId) {
      navigation.navigate('SessionRequestDetails', { sessionRequestId: request.id });
    } else {
      console.error('No sender Firebase ID found in session request:', request);
    }
  }

  const handleAcceptRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id));
    
    try {
      await acceptConnectionRequest(request.id, userData.id);
      

      const updatedRequests = userData.pendingConnectionRequests.filter(
        req => req.id !== request.id
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
        connections: updatedConnections
      });
      
      Alert.alert("Success", "Connection request accepted! You are now connected with this coach.");
    } catch (error) {
      console.error('Error accepting connection request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to accept connection request");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleDeclineRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id));
    
    try {
      await declineConnectionRequest(request.id, userData.id);
      
      const updatedRequests = userData.pendingConnectionRequests.filter(
        req => req.id !== request.id
      );
      
      updateUserData({
        pendingConnectionRequests: updatedRequests
      });
      
      Alert.alert("Request Declined", "Connection request has been declined.");
    } catch (error) {
      console.error('Error declining connection request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to decline connection request");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleDeclineSessionRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id));
    
    try {
      await declineSessionRequest(request.id, userData.id);
      
      const updatedRequests = userData.pendingSessionRequests.filter(
        req => req.id !== request.id
      );
      
      updateUserData({
        pendingSessionRequests: updatedRequests
      });
      
      Alert.alert("Request Declined", "Session request has been declined.");
    } catch (error) {
      console.error('Error declining session request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to decline session request");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleStartConversation = useCallback(async (coach: any) => {
    if (!userData) {
      Alert.alert("Error", "Unable to start conversation. Please try again later.");
      return;
    }

    setCreatingConversation(true);
    
    try {
      const currentUserFirebaseId = getFirebaseAuthSafe()?.currentUser?.uid;
      if (!currentUserFirebaseId) {
        Alert.alert("Error", "User not authenticated");
        setCreatingConversation(false);
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
      
      // Look for existing conversation with this specific coach
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participantIds.includes(coach.firebaseID)) {
          existingConversation = {
            id: doc.id,
            ...data
          };
        }
      });

      let conversationId;
      let otherParticipant;

      if (existingConversation.id) {
        // Use existing conversation
        console.log("Conversation already exists")
        conversationId = existingConversation.id;
        
        
        // Find the other participant from existing conversation
        otherParticipant = existingConversation.participants?.find(
          (p: any) => p.firebaseId !== currentUserFirebaseId
        );
      } else {
        // Create new conversation
        console.log("Conversation does not exist, creating a new one")
        conversationId = `conv_${userData.id}_${coach.id}`;
        
        otherParticipant = {
          id: coach.id.toString(),
          type: 'COACH' as const,
          name: `${coach.firstName} ${coach.lastName}`,
          profilePic: coach.profilePic,
          firebaseId: coach.firebaseID
        };

        // Create new conversation document
        await setDoc(doc(FIREBASE_DB, 'conversations', conversationId), {
          participants: [
            {
              id: userData.id.toString(),
              type: 'MEMBER',
              name: `${userData.firstName} ${userData.lastName}`,
              profilePic: userData.profilePic,
              firebaseId: currentUserFirebaseId
            },
            otherParticipant
          ],
          participantIds: [currentUserFirebaseId, coach.firebaseID],
          unreadCount: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      // Close modal and navigate to chat - use InboxChat since we're coming from InboxHome
      setShowCoachModal(false);
      
      navigation.navigate('ChatScreen', {
        conversationId: conversationId,
        otherParticipant: otherParticipant
      });

    } catch (error) {
      console.error('Error creating/finding conversation:', error);
      Alert.alert("Error", "Failed to start conversation. Please try again.");
    } finally {
      setCreatingConversation(false);
    }
  }, [userData, navigation]);


  const renderCoachItem = ({ item: coach }: { item: any }) => (
    <TouchableOpacity 
      className="flex-row items-center p-4 border-b border-gray-100"
      onPress={() => handleStartConversation(coach)}
      disabled={creatingConversation}
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: Colors.uaBlue + '20' }}
      >
        {coach.profilePic ? (
          <Image 
            source={{ uri: coach.profilePic }}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person" size={24} color={Colors.uaBlue} />
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-gray-900 font-semibold text-base">
          {coach.firstName} {coach.lastName}
        </Text>
        <Text className="text-gray-600 text-sm">
          {coach.location || "Location not specified"}
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={Colors.grey.medium} />
    </TouchableOpacity>
  );

  
  const renderConnectionRequest = (request: any, index: number) => {
    const isProcessing = processingRequests.has(request.id);
    
    return (
      <TouchableOpacity 
        key={request.id || index}
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
        onPress={() => handleConnectionRequestPress(request)}
        disabled={isProcessing}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.uaBlue + '20' }}
            >
              {request.senderProfilePic ? (
                <Image 
                  source={{ uri: request.senderProfilePic }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={24} color={Colors.uaBlue} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {request.senderFirstName && request.senderLastName
                  ? `${request.senderFirstName} ${request.senderLastName}`
                  : `Coach #${request.senderId}`
                }
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {request.message || "Would like to connect with you"}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {new Date(request.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View className="flex-row ml-2">
            <TouchableOpacity 
              className="px-3 py-1 rounded-md mr-2"
              style={{ 
                backgroundColor: isProcessing ? Colors.grey.medium : Colors.uaGreen,
                opacity: isProcessing ? 0.6 : 1 
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleAcceptRequest(request);
              }}
              disabled={isProcessing}
            >
              <Text className="text-white text-xs font-medium">
                {isProcessing ? "..." : "Accept"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="px-3 py-1 rounded-md"
              style={{ 
                backgroundColor: isProcessing ? Colors.grey.medium : Colors.uaRed,
                opacity: isProcessing ? 0.6 : 1 
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleDeclineRequest(request);
              }}
              disabled={isProcessing}
            >
              <Text className="text-white text-xs font-medium">
                {isProcessing ? "..." : "Decline"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSessionRequest = (request: any, index: number) => {
    const isProcessing = processingRequests.has(request.id);
    
    return (
      <TouchableOpacity 
        key={request.id || index}
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
        onPress={() => handleSessionRequestPress(request)}
        disabled={isProcessing}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.uaRed + '20' }}
            >
              {request.senderProfilePic ? (
                <Image 
                  source={{ uri: request.senderProfilePic }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="calendar" size={24} color={Colors.uaRed} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {request.senderFirstName && request.senderLastName
                  ? `${request.senderFirstName} ${request.senderLastName}`
                  : `Coach #${request.senderId}`
                }
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {request.message || "Session request"}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                📍 {request.sessionLocation}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {new Date(request.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View className="flex-row ml-2">
            <TouchableOpacity 
              className="px-3 py-1 rounded-md"
              style={{ 
                backgroundColor: isProcessing ? Colors.grey.medium : Colors.uaRed,
                opacity: isProcessing ? 0.6 : 1 
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleDeclineSessionRequest(request);
              }}
              disabled={isProcessing}
            >
              <Text className="text-white text-xs font-medium">
                {isProcessing ? "..." : "Decline"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRegularMessage = (conversation: any, index: number) => {
    const currentUserFirebaseId = getFirebaseAuthSafe()?.currentUser?.uid;
    const otherParticipant = conversation.participants?.find(
      (p: any) => p.firebaseId !== currentUserFirebaseId
    );

    if (!otherParticipant) {
      console.warn('No other participant found for conversation:', conversation.id);
      return null;
    }

      const handleConversationPress = async () => {
      // Don't need to mark as read here since ChatScreen does it immediately
      navigation.navigate('ChatScreen', {
        conversationId: conversation.id,
        otherParticipant: {
          id: otherParticipant.id,
          type: otherParticipant.type,
          name: otherParticipant.name,
          profilePic: otherParticipant.profilePic,
          firebaseId: otherParticipant.firebaseId
        }
      });
    };

    return (
      <TouchableOpacity 
        key={conversation.id}
        className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
        onPress={handleConversationPress}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.uaGreen + '20' }}
            >
              {otherParticipant.profilePic ? (
                <Image 
                  source={{ uri: otherParticipant.profilePic }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="chatbubble" size={24} color={Colors.uaGreen} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {otherParticipant.name}
              </Text>
              <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
                {conversation.lastMessage?.content || "Start a conversation"}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {conversation.lastMessage?.timestamp ? 
                  new Date(conversation.lastMessage.timestamp.toDate()).toLocaleDateString() : 
                  'New'
                }
              </Text>
            </View>
          </View>
          
          {/* Unread count indicator */}
          {conversation.unreadCount > 0 && (
            <View className="bg-red-500 rounded-full px-2 py-1 min-w-[20px] items-center ml-2">
              <Text className="text-white text-xs font-bold">
                {conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategorySection = (
    title: string, 
    count: number, 
    icon: string, 
    color: string,
    items: any[], 
    renderItem: (item: any, index: number) => React.ReactNode
  ) => (
    <View className="mb-6">
      {/* Category Header */}
      <View 
        className="rounded-lg p-4 mb-3"
        style={{ backgroundColor: color }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3">
              <Ionicons name={icon as any} size={20} color={color} />
            </View>
            <Text className="text-white font-bold text-lg">{title}</Text>
          </View>
          <View className="bg-white rounded-full px-3 py-1">
            <Text className="font-bold text-sm" style={{ color: color }}>
              {count}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Category Items */}
      {items.length > 0 ? (
        <View>
          {items.map((item, index) => renderItem(item, index))}
        </View>
      ) : (
        <View className="bg-gray-50 rounded-lg p-6 items-center">
          <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
          <Text className="text-gray-500 text-center mt-2 font-medium">
            No {title.toLowerCase()} at the moment
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-1">
            You're all caught up!
          </Text>
        </View>
      )}
    </View>
  )

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-gray-900 text-2xl font-bold mb-2">
            Your Inbox
          </Text>
          <Text className="text-gray-600 text-base">
            Stay updated with your latest notifications
          </Text>
        </View>
        
        {/* Connection Requests Section */}
        {renderCategorySection(
          "Connection Requests",
          connectionRequests.length,
          "people",
          Colors.uaBlue,
          connectionRequests,
          renderConnectionRequest
        )}

        {/* Session Requests Section */}
        {renderCategorySection(
          "Session Requests",
          sessionRequests.length,
          "calendar",
          Colors.uaRed,
          sessionRequests,
          renderSessionRequest
        )}

        {/* Regular Messages Section */}
        {renderCategorySection(
          "Messages",
          conversations.length,
          "chatbubble",
          Colors.uaGreen,
          conversations,
          renderRegularMessage
        )}

         {/* New Message Button */}
        <View className="mb-4">
          <TouchableOpacity 
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-row items-center justify-center"
            onPress={() => setShowCoachModal(true)}
            style={{ borderColor: Colors.uaGreen }}
          >
            <Ionicons name="add-circle-outline" size={24} color={Colors.uaGreen} />
            <Text className="ml-2 font-semibold text-lg" style={{ color: Colors.uaGreen }}>
              Start New Conversation
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Coach Selection Modal */}
      <Modal
        visible={showCoachModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCoachModal(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-40">
          <View className="bg-white rounded-t-lg max-h-96">
            {/* Modal Header */}
            <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Select a Coach</Text>
              <TouchableOpacity 
                onPress={() => setShowCoachModal(false)}
                disabled={creatingConversation}
              >
                <Ionicons name="close" size={24} color={Colors.grey.dark} />
              </TouchableOpacity>
            </View>
            
            {/* Coach List */}
            {userData?.connections && userData.connections.length > 0 ? (
              <FlatList
                data={userData.connections}
                renderItem={renderCoachItem}
                keyExtractor={(item) => item.id.toString()}
                className="max-h-80"
              />
            ) : (
              <View className="p-8 items-center">
                <Ionicons name="people-outline" size={48} color={Colors.grey.medium} />
                <Text className="text-gray-500 text-center mt-2 font-medium">
                  No Connected Coaches
                </Text>
                <Text className="text-gray-400 text-center text-sm mt-1">
                  Connect with coaches first to start conversations
                </Text>
              </View>
            )}
            
            {creatingConversation && (
              <View className="absolute inset-0 bg-white bg-opacity-80 items-center justify-center">
                <Text className="text-gray-600 mt-2">Starting conversation...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </ScrollView>
  )
}

export default InboxHome

