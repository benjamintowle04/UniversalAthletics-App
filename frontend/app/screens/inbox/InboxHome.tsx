import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import { acceptConnectionRequest, declineConnectionRequest } from '../../../controllers/ConnectionRequestController'
import {declineSessionRequest } from '../../../controllers/SessionRequestController'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"
import { getConversationsForUser } from '../../../controllers/MessageController';
import { populateDummyMessages } from '../../../utils/PopulateDummyMessages'

const InboxHome = ({navigation}: RouterProps) => {
  const { userData, updateUserData } = useUser()
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())

  // Use useMemo to ensure the component re-renders when requests change
  const connectionRequests = useMemo(() => {
    return userData?.pendingConnectionRequests || []
  }, [userData?.pendingConnectionRequests])

  const sessionRequests = useMemo(() => {
    return userData?.pendingSessionRequests || []
  }, [userData?.pendingSessionRequests])
  
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = getConversationsForUser(
      userData.id.toString(),
      'MEMBER',
      setConversations
    );

    return () => unsubscribe();

  }, [userData]);

  const handleConnectionRequestPress = (request: any) => {
    // Navigate to CoachProfile with the sender's Firebase ID
    if (request.senderFirebaseId) {
      navigation.navigate('CoachProfile', { coachId: request.senderFirebaseId });
    } else {
      console.error('No sender Firebase ID found in connection request:', request);
    }
  }

  const handleSessionRequestPress = (request: any) => {
    // Navigate to SessionDetails with the sender's Firebase ID
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
      
      // Remove the request from the pending list
      const updatedRequests = userData.pendingConnectionRequests.filter(
        req => req.id !== request.id
      );
      
      updateUserData({
        pendingConnectionRequests: updatedRequests
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
      
      // Remove the request from the pending list
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
      
      // Remove the request from the pending list
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
            {/* Profile picture placeholder */}
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.uaBlue + '20' }} // 20% opacity
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
          
          {/* Action buttons */}
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
            {/* Profile picture */}
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: Colors.uaRed + '20' }} // 20% opacity
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
          
          {/* Action buttons */}
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

  // Update the renderRegularMessage function:
  const renderRegularMessage = (conversation: any, index: number) => (
    <TouchableOpacity 
      key={conversation.id}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() => navigation.navigate('ChatScreen', {
        conversationId: conversation.id,
        otherParticipant: conversation.participants.find(
          (p: any) => p.id !== userData?.id.toString()
        )
      })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: Colors.uaGreen + '20' }}
          >
            <Ionicons name="chatbubble" size={24} color={Colors.uaGreen} />
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              {conversation.participants.find((p: any) => p.id !== userData?.id.toString())?.name}
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
        
        {conversation.unreadCount > 0 && (
          <View className="bg-red-500 rounded-full px-2 py-1 min-w-[20px] items-center">
            <Text className="text-white text-xs font-bold">
              {conversation.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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

                
        {__DEV__ && (
          <TouchableOpacity 
            className="bg-purple-500 p-3 rounded-lg mb-4"
            onPress={() => {
              if (userData) {
                populateDummyMessages(userData.id.toString());
              }
            }}
          >
            <Text className="text-white text-center font-bold">
              🧪 Populate Dummy Messages (Dev Only)
            </Text>
          </TouchableOpacity>
        )}


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

        {/* Overall Empty State */}
        {connectionRequests.length === 0 && sessionRequests.length === 0 && conversations.length === 0 && (
          <View className="bg-white rounded-lg p-8 items-center mt-4">
            <Ionicons name="mail-open" size={64} color={Colors.grey.medium} />
            <Text className="text-gray-900 text-xl font-bold mt-4 text-center">
              All Clear!
            </Text>
            <Text className="text-gray-500 text-center mt-2 text-base">
              You have no new notifications.{'\n'}
              Check back later for updates.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default InboxHome

