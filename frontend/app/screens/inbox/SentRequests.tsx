import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useMemo } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"
import { cancelConnectionRequest } from '../../../controllers/ConnectionRequestController'
import { cancelSessionRequest } from '../../../controllers/SessionRequestController'

const SentRequests = ({navigation}: RouterProps) => {
  const { userData, updateUserData } = useUser()
  const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set())

  // Use useMemo to ensure the component re-renders when requests change
  const sentConnectionRequests = useMemo(() => {
    return userData?.sentConnectionRequests?.filter(req => req.status === 'PENDING') || []
  }, [userData?.sentConnectionRequests])
  
  const sentSessionRequests = useMemo(() => {
    return userData?.sentSessionRequests?.filter(req => req.status === 'PENDING') || []
  }, [userData?.sentSessionRequests])

  const handleConnectionRequestPress = (request: any) => {
    // Navigate to CoachProfile with the receiver's Firebase ID
    if (request.receiverFirebaseId) {
      navigation.navigate('CoachProfile', { coachId: request.receiverFirebaseId });
    } else {
      console.error('No receiver Firebase ID found in sent connection request:', request);
    }
  }

  const handleSessionRequestPress = (request: any) => {
    // Navigate to CoachProfile with the receiver's Firebase ID
    if (request.receiverFirebaseId) {
      navigation.navigate('CoachProfile', { coachId: request.receiverFirebaseId });
    } else {
      console.error('No receiver Firebase ID found in sent session request:', request);
    }
  }

  const handleCancelConnectionRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id)); 
    
    try {
      await cancelConnectionRequest(request.id, userData.id); 
      
      // Remove the request from the pending list
      const updatedRequests = userData.sentConnectionRequests.filter(
        req => req.id !== request.id 
      );
      
      updateUserData({
        sentConnectionRequests: updatedRequests
      });
      
      Alert.alert("Success", "Connection request cancelled.");
    } catch (error) {
      console.error('Error cancelling connection request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to cancel connection request");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };

  const handleCancelSessionRequest = async (request: any) => {
    if (!userData) return;
    
    setProcessingRequests(prev => new Set(prev).add(request.id)); 
    
    try {
      await cancelSessionRequest(request.id, userData.id); 
      
      // Remove the request from the pending list
      const updatedRequests = userData.sentSessionRequests.filter(
        req => req.id !== request.id 
      );
      
      updateUserData({
        sentSessionRequests: updatedRequests
      });
      
      Alert.alert("Success", "Session request cancelled.");
    } catch (error) {
      console.error('Error cancelling session request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to cancel session request");
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(request.id);
        return newSet;
      });
    }
  };
  
  const renderSentConnectionRequest = (request: any, index: number) => {
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
              {request.receiverProfilePic ? (
                <Image 
                  source={{ uri: request.receiverProfilePic }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={24} color={Colors.uaBlue} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {request.receiverFirstName && request.receiverLastName
                  ? `${request.receiverFirstName} ${request.receiverLastName}`
                  : `Coach #${request.receiverId}`
                }
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {request.message || "Connection request sent"}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400 text-xs">
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </Text>
                <View className="flex-row items-center ml-2">
                  <View 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: Colors.uaBlue }}
                  />
                  <Text className="text-xs font-medium" style={{ color: Colors.uaBlue }}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Action button */}
          <View className="ml-2">
            <TouchableOpacity 
              className="px-3 py-1 rounded-md"
              style={{ 
                backgroundColor: isProcessing ? Colors.grey.medium : Colors.uaRed,
                opacity: isProcessing ? 0.6 : 1 
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelConnectionRequest(request);
              }}
              disabled={isProcessing}
            >
              <Text className="text-white text-xs font-medium">
                {isProcessing ? "..." : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSentSessionRequest = (request: any, index: number) => {
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
              style={{ backgroundColor: Colors.uaRed + '20' }} // 20% opacity
            >
              {request.receiverProfilePic ? (
                <Image 
                  source={{ uri: request.receiverProfilePic }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="calendar" size={24} color={Colors.uaRed} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-base">
                {request.receiverFirstName && request.receiverLastName
                  ? `${request.receiverFirstName} ${request.receiverLastName}`
                  : `Coach #${request.receiverId}`
                }
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {request.sessionDescription || "Session request sent"}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                Location: {request.sessionLocation || "TBD"}
              </Text>
              <View className="flex-row items-center mt-1">
                <Text className="text-gray-400 text-xs">
                  Sent {new Date(request.createdAt).toLocaleDateString()}
                </Text>
                <View className="flex-row items-center ml-2">
                  <View 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: Colors.uaRed }}
                  />
                  <Text className="text-xs font-medium" style={{ color: Colors.uaRed }}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Action button */}
          <View className="ml-2">
            <TouchableOpacity 
              className="px-3 py-1 rounded-md"
              style={{ 
                backgroundColor: isProcessing ? Colors.grey.medium : Colors.uaRed,
                opacity: isProcessing ? 0.6 : 1 
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleCancelSessionRequest(request);
              }}
              disabled={isProcessing}
            >
              <Text className="text-white text-xs font-medium">
                {isProcessing ? "..." : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
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
            You haven't sent any requests recently
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
            Sent Requests
          </Text>
          <Text className="text-gray-600 text-base">
            Track your outgoing connection and session requests
          </Text>
        </View>

        {/* Sent Connection Requests Section */}
        {renderCategorySection(
          "Connection Requests",
          sentConnectionRequests.length,
          "send",
          Colors.uaBlue,
          sentConnectionRequests,
          renderSentConnectionRequest
        )}

        {/* Sent Session Requests Section */}
        {renderCategorySection(
          "Session Requests",
          sentSessionRequests.length,
          "calendar",
          Colors.uaRed,
          sentSessionRequests,
          renderSentSessionRequest
        )}

      </View>
    </ScrollView>
  )
}

export default SentRequests
