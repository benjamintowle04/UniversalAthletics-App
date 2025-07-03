import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useUser } from '../../contexts/UserContext'
import { createMemberToCoachConnectionRequest, createCoachToMemberConnectionRequest } from '../../../controllers/ConnectionRequestController'
import { getUnsignedUrl } from '../../../utils/UnsignUrls'
import { FIREBASE_AUTH } from '../../../firebase_config'
import { RouterProps } from "../../types/RouterProps"
import { RouteProp } from '@react-navigation/native'
import "../../../global.css"

type SendConnectionRequestRouteProp = RouteProp<{ 
  params: { 
    profileId: string;
    profileType: 'COACH' | 'MEMBER';
    profileData: {
      id: string;
      firstName: string;
      lastName: string;
      profilePic?: string;
    };
  } 
}, 'params'>;

interface SendConnectionRequestProps extends RouterProps {
  route: SendConnectionRequestRouteProp;
}

const SendConnectionRequest = ({ route, navigation }: SendConnectionRequestProps) => {
  const { profileId, profileType, profileData } = route.params;
  const [customMessage, setCustomMessage] = useState(
    profileType === 'COACH' 
      ? "I would like to connect with you as my coach"
      : "I would like to connect with you"
  );
  const [sendingRequest, setSendingRequest] = useState(false);
  const { userData, updateUserData } = useUser();

  const handleSendConnectionRequest = useCallback(async () => {
    if (!userData || !profileData) return;
    
    setSendingRequest(true);
    
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        throw new Error("User is not authenticated");
      }

      console.log("Receiver profile pic before unsigning:", profileData.profilePic);



      const connectionRequestData = {
        senderType: userData.userType,
        senderId: userData.id,
        senderFirebaseId: currentUser.uid,
        receiverType: profileType,
        receiverId: parseInt(profileData.id),
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

      console.log("Sending connection request with data:", connectionRequestData);
      console.log("Receiver Profile Pic URL after unsigning:", connectionRequestData.receiverProfilePic);

      let createdRequest;
      if (userData.userType === 'MEMBER') {
        createdRequest = await createMemberToCoachConnectionRequest(connectionRequestData);
      } else if (userData.userType === 'COACH') {
        createdRequest = await createCoachToMemberConnectionRequest(connectionRequestData);
      } else {
        throw new Error("Invalid user type combination for connection request");
      }

      if (userData.sentConnectionRequests) {
        const newRequest = {
          id: createdRequest.id,
          senderType: userData.userType,
          senderId: userData.id,
          senderFirebaseId: currentUser.uid,
          receiverType: profileType,
          receiverId: parseInt(profileData.id),
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
      navigation.goBack();
    } catch (error) {
      console.error('Error sending connection request:', error);
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to send connection request");
    } finally {
      setSendingRequest(false);
    }
  }, [userData, profileData, profileId, profileType, updateUserData, customMessage, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Send Connection Request
          </Text>
          <Text className="text-gray-600">
            Send a personal message to {profileData.firstName}
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Your Message
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 h-32 text-base"
            multiline
            textAlignVertical="top"
            value={customMessage}
            onChangeText={setCustomMessage}
            placeholder="Enter your message..."
            maxLength={500}
          />
          <Text className="text-gray-400 text-sm mt-2 text-right">
            {customMessage.length}/500
          </Text>
        </View>

        <View className="flex-row space-x-4">
          <TouchableOpacity 
            className="bg-gray-500 py-4 px-6 rounded-lg flex-1"
            onPress={() => navigation.goBack()}
            disabled={sendingRequest}
          >
            <Text className="text-white font-semibold text-center text-base">Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-blue-500 py-4 px-6 rounded-lg flex-1 flex-row items-center justify-center"
            onPress={handleSendConnectionRequest}
            disabled={sendingRequest || !customMessage.trim()}
          >
            {sendingRequest ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Send Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SendConnectionRequest;
