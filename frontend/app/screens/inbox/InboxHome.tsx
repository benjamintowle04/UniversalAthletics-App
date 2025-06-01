import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useMemo } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import { acceptConnectionRequest, declineConnectionRequest } from '../../../controllers/ConnectionRequestController'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"

const InboxHome = ({navigation}: RouterProps) => {
  const { userData, updateUserData } = useUser()
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())

  // Use useMemo to ensure the component re-renders when pendingConnectionRequests changes
  const connectionRequests = useMemo(() => {
    return userData?.pendingConnectionRequests || []
  }, [userData?.pendingConnectionRequests])
  
  // Placeholder data for other categories
  const sessionRequests: any[] = [] // Will be populated later
  const regularMessages: any[] = [] // Will be populated later

  const handleConnectionRequestPress = (request: any) => {
    // Navigate to CoachProfile with the sender's Firebase ID
    if (request.senderFirebaseId) {
      navigation.navigate('CoachProfile', { coachId: request.senderFirebaseId });
    } else {
      console.error('No sender Firebase ID found in connection request:', request);
    }
  }

  const handleAcceptRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id)); // Use request.id instead of request.requestId
    
    try {
      await acceptConnectionRequest(request.id, userData.id); // Use request.id instead of request.requestId
      
      // Remove the request from the pending list
      const updatedRequests = userData.pendingConnectionRequests.filter(
        req => req.id !== request.id // Use request.id instead of request.requestId
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
        newSet.delete(request.id); // Use request.id instead of request.requestId
        return newSet;
      });
    }
  };

  const handleDeclineRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id)); // Use request.id instead of request.requestId
    
    try {
      await declineConnectionRequest(request.id, userData.id); // Use request.id instead of request.requestId
      
      // Remove the request from the pending list
      const updatedRequests = userData.pendingConnectionRequests.filter(
        req => req.id !== request.id // Use request.id instead of request.requestId
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
        newSet.delete(request.id); // Use request.id instead of request.requestId
        return newSet;
      });
    }
  };
  
  const renderConnectionRequest = (request: any, index: number) => {
    const isProcessing = processingRequests.has(request.id); // Use request.id instead of request.requestId
    
    return (
      <TouchableOpacity 
        key={request.id || index} // Use request.id instead of request.requestId
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

  // ... rest of your component remains the same

  const renderSessionRequest = (request: any, index: number) => (
    <TouchableOpacity 
      key={index}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: Colors.uaRed + '20' }} // 20% opacity
          >
            <Ionicons name="calendar" size={24} color={Colors.uaRed} />
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              Session Request
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Coming soon...
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderRegularMessage = (message: any, index: number) => (
    <TouchableOpacity 
      key={index}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: Colors.uaGreen + '20' }} // 20% opacity
          >
            <Ionicons name="chatbubble" size={24} color={Colors.uaGreen} />
          </View>
          
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              Message
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              Coming soon...
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

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
          regularMessages.length,
          "chatbubble",
          Colors.uaGreen,
          regularMessages,
          renderRegularMessage
        )}

        {/* Overall Empty State */}
        {connectionRequests.length === 0 && sessionRequests.length === 0 && regularMessages.length === 0 && (
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
