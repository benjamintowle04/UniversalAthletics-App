import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, Modal, ActivityIndicator, TextInput as RNTextInput } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { getCoachByFirebaseId } from '../../../controllers/CoachController'
import { Ionicons } from '@expo/vector-icons'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { useUser } from '../../contexts/UserContext'
import { Colors } from '../../themes/colors/Colors'
import { acceptConnectionRequest, declineConnectionRequest, createMemberToCoachConnectionRequest } from '../../../controllers/ConnectionRequestController'
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { getUnsignedUrl } from '../../../utils/UnsignUrls'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"


interface Coach {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  email?: string;
  profilePic?: string;
  bio1?: string;
  bio2?: string;
  bioPic1?: string;
  bioPic2?: string;
  skills: Array<{skill_id: number, title: string}>;
}

import { RouteProp } from '@react-navigation/native';

type CoachProfileRouteProp = RouteProp<{ params: { coachId: string } }, 'params'>;

interface CoachProfileProps extends RouterProps {
  route: CoachProfileRouteProp;
}

const CoachProfile = ({ route, navigation }: CoachProfileProps) => {  const [coachData, setCoachData] = useState<Coach | null>(null);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const { coachId } = route.params;
  const { userData, updateUserData, isConnectedToCoach } = useUser();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [customMessage, setCustomMessage] = useState("I would like to connect with you");
  const [sendingRequest, setSendingRequest] = useState(false);

  const isConnected = isConnectedToCoach(coachId);
  const isLoadingConnectionStatus = userData?.isLoadingConnectedCoaches ?? true;

  const connectionStatus = useMemo(() => {
    if (!userData) return { pendingIncoming: null, pendingSent: null, hasPending: false };

    const pendingIncoming = userData.pendingConnectionRequests?.find(
      request => request.senderFirebaseId === coachId
    ) || null;

    const pendingSent = userData.sentConnectionRequests?.find(
      request => request.receiverFirebaseId === coachId && request.status === 'PENDING'
    ) || null;

    return {
      pendingIncoming,
      pendingSent,
      hasPending: !!(pendingIncoming || pendingSent)
    };
  }, [userData?.pendingConnectionRequests, userData?.sentConnectionRequests, coachId]);

  const skillIcons = useMemo(() => {
    return coachData?.skills ? getIconsFromSkills(coachData.skills) : [];
  }, [coachData?.skills]);

  const buttonState = useMemo(() => {
    if (isLoadingConnectionStatus) return 'loading';
    if (isConnected) return 'connected';
    if (connectionStatus.pendingIncoming) return 'accept_decline';
    if (connectionStatus.pendingSent) return 'request_sent';
    return 'connect';
  }, [isLoadingConnectionStatus, isConnected, connectionStatus.pendingIncoming, connectionStatus.pendingSent]);

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        let coachData = await getCoachByFirebaseId(coachId);
        setCoachData(coachData);
      } catch (error) {
        console.error("Error fetching coach data:", error);
      }
    }
    fetchCoachData();
  }, [coachId]);

  const handleEmailPress = useCallback(() => {
    if (coachData?.email) {
      const emailUrl = `mailto:${coachData.email}`;
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
  }, [coachData?.email]);

  // Show modal to enter message
  const handleConnectWithCoach = useCallback(() => {
    setCustomMessage("I would like to connect with you");
    setShowMessageModal(true);
  }, []);

// Actually send the request
const handleSendConnectionRequest = useCallback(async () => {
  if (!userData || !coachData) return;
  setSendingRequest(true);
  setIsProcessingRequest(true);
  try {
    const connectionRequestData = {
      senderType: 'MEMBER' as const,
      senderId: userData.id,
      senderFirebaseId: userData.firebaseId,
      receiverType: 'COACH' as const,
      receiverId: parseInt(coachData.id || '0'),
      receiverFirebaseId: coachId,
      senderFirstName: userData.firstName,
      senderLastName: userData.lastName,
      senderProfilePic: getUnsignedUrl(userData.profilePic),
      receiverFirstName: coachData.firstName,
      receiverLastName: coachData.lastName,
      receiverProfilePic: getUnsignedUrl(coachData.profilePic),
      message: customMessage,
      status: 'PENDING' as const
    };

    // Send the request and get the response with the actual ID from the database
    const createdRequest = await createMemberToCoachConnectionRequest(connectionRequestData);

    if (userData.sentConnectionRequests) {
      // Use the actual response from the API instead of creating a fake one
      const newRequest = {
        ...createdRequest, // This contains the real ID from the database
        // Add any additional fields that might be missing
        createdAt: createdRequest.createdAt || new Date().toISOString(),
        updatedAt: createdRequest.updatedAt || new Date().toISOString()
      };
      updateUserData({
        sentConnectionRequests: [...userData.sentConnectionRequests, newRequest]
      });
    }

    setShowMessageModal(false);
    Alert.alert("Success", "Connection request sent successfully!");
  } catch (error) {
    console.error('Error sending connection request:', error);
    Alert.alert("Error", error instanceof Error ? error.message : "Failed to send connection request");
  } finally {
    setSendingRequest(false);
    setIsProcessingRequest(false);
  }
}, [userData, coachData, coachId, updateUserData, customMessage]);


  const handleAcceptRequest = useCallback(async () => {
    if (connectionStatus.pendingIncoming && userData) {
      setIsProcessingRequest(true);
      try {
        await acceptConnectionRequest(connectionStatus.pendingIncoming.id, userData.id);

        const updatedRequests = userData.pendingConnectionRequests.filter(
          request => request.id !== connectionStatus.pendingIncoming!.id
        );

        const updatedConnectedCoaches = await getMembersCoaches(userData.id);

        updateUserData({
          pendingConnectionRequests: updatedRequests,
          connectedCoaches: updatedConnectedCoaches || userData.connectedCoaches
        });

        Alert.alert("Success", "Connection request accepted! You are now connected with this coach.");
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
    console.log("Booking session with coach:", coachData, userData);
    if (coachData && userData) {
      navigation.navigate('RequestASession', {
        recipientId: parseInt(coachData.id || '0'),
        recipientFirstName: coachData.firstName,
        recipientLastName: coachData.lastName,
        recipientProfilePic: coachData.profilePic,
        recipientFirebaseId: coachData.firebaseID || '',
        recipientType: 'coach' as const
      });
    } else {
      Alert.alert("Error", "Unable to book session. Please try again later.");
    }

  }, [userData, coachData, navigation]);

  const ActionButton = useMemo(() => {
    switch (buttonState) {
      case 'loading':
        return (
          <TouchableOpacity 
            className="bg-gray-400 py-3 rounded-lg items-center"
            disabled={true}
          >
            <Text className="text-white font-semibold text-lg">Loading...</Text>
          </TouchableOpacity>
        );

      case 'connected':
        return (
          <TouchableOpacity 
            className="py-3 rounded-lg items-center"
            style={{ backgroundColor: Colors.uaGreen }}
            onPress={handleBookSession}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">Book Session</Text>
            </View>
          </TouchableOpacity>
        );

      case 'accept_decline':
        return (
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="flex-1 py-3 rounded-lg items-center mr-2"
              style={{ 
                backgroundColor: isProcessingRequest ? Colors.grey.medium : Colors.uaGreen,
                opacity: isProcessingRequest ? 0.6 : 1 
              }}
              onPress={handleAcceptRequest}
              disabled={isProcessingRequest}
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isProcessingRequest ? "Processing..." : "Accept"}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 py-3 rounded-lg items-center ml-2"
              style={{ 
                backgroundColor: isProcessingRequest ? Colors.grey.medium : Colors.uaRed,
                opacity: isProcessingRequest ? 0.6 : 1 
              }}
              onPress={handleDeclineRequest}
              disabled={isProcessingRequest}
            >
              <View className="flex-row items-center">
                <Ionicons name="close-circle-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  {isProcessingRequest ? "Processing..." : "Decline"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );

      case 'request_sent':
        return (
          <TouchableOpacity 
            className="py-3 rounded-lg items-center"
            style={{ backgroundColor: Colors.uaBlue }}
            disabled={true}
          >
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">Request Sent</Text>
            </View>
          </TouchableOpacity>
        );

      case 'connect':
      default:
        return (
          <TouchableOpacity 
            className="py-3 rounded-lg items-center"
            style={{ 
              backgroundColor: isProcessingRequest ? Colors.grey.medium : Colors.uaBlue,
              opacity: isProcessingRequest ? 0.6 : 1 
            }}
            onPress={handleConnectWithCoach}
            disabled={isProcessingRequest}
          >
            <View className="flex-row items-center">
              <Ionicons name="person-add-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                {isProcessingRequest ? "Sending..." : "Connect with Coach"}
              </Text>
            </View>
          </TouchableOpacity>
        );
    }
  }, [buttonState, isProcessingRequest, handleBookSession, handleAcceptRequest, handleDeclineRequest, handleConnectWithCoach]);

  const StatusNotice = useMemo(() => {
    if (connectionStatus.pendingIncoming) {
      return (
        <View className="mt-4 mx-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color={Colors.uaBlue} />
            <Text className="ml-2 text-blue-800 font-medium">
              Connection Request Pending
            </Text>
          </View>
          <Text className="mt-1 text-blue-600 text-sm">
            This coach has sent you a connection request.
          </Text>
        </View>
      );
    }

    if (connectionStatus.pendingSent) {
      return (
        <View className="mt-4 mx-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <View className="flex-row items-center">
            <Ionicons name="send-outline" size={20} color={Colors.uaBlue} />
            <Text className="ml-2 text-orange-800 font-medium">
              Connection Request Sent
            </Text>
          </View>
          <Text className="mt-1 text-orange-600 text-sm">
            Your connection request is pending approval.
          </Text>
        </View>
      );
    }

    if (isConnected) {
      return (
        <View className="mt-4 mx-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.uaGreen} />
            <Text className="ml-2 text-green-800 font-medium">
              Connected
            </Text>
          </View>
          <Text className="mt-1 text-green-600 text-sm">
            You are connected with this coach.
          </Text>
        </View>
      );
    }

    return null;
  }, [connectionStatus.pendingIncoming, connectionStatus.pendingSent, isConnected]);

  if (!coachData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-600">Loading coach profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Modal for custom message */}
      <Modal
        visible={showMessageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-40">
          <View className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
            <Text className="text-lg font-bold mb-2">Send a message to this coach</Text>
            <RNTextInput
              className="border border-gray-300 rounded-md p-2 mb-4 min-h-16"
              multiline
              numberOfLines={4}
              value={customMessage}
              onChangeText={setCustomMessage}
              placeholder="Write your message..."
              editable={!sendingRequest}
            />
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                className="px-4 py-2 rounded bg-gray-200"
                onPress={() => setShowMessageModal(false)}
                disabled={sendingRequest}
              >
                <Text className="text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 rounded"
                onPress={handleSendConnectionRequest}
                disabled={sendingRequest}
                style={{ backgroundColor: Colors.uaBlue, opacity: sendingRequest ? 0.6 : 1 }}
              >
                {sendingRequest ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="relative">
          {/* Banner/Background */}
          <View className="h-40 bg-blue-400 border-b" >
            <Image 
              source={require('../../images/sports-banner.jpg')} 
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          {/* Profile Image */}
          <View className="absolute -bottom-0 pb-3 left-4">
            <Image 
              source={coachData.profilePic ? { uri: coachData.profilePic } : require('../../images/logo.png')} 
              className="w-32 h-32 rounded-full border-4 border-blue-400"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Coach Name and Location */}
        <View className="mt-10 px-4">
          <Text className="text-2xl font-bold">{coachData.firstName} {coachData.lastName}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text className="text-gray-600 ml-1">{coachData.location || "Location not specified"}</Text>
          </View>
        </View>

        {/* Status Notice */}
        {StatusNotice}

        {/* Contact Information Section */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-3">Contact Information</Text>
          {coachData.email ? (
            <TouchableOpacity 
              className="flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg"
              onPress={handleEmailPress}
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="text-base text-gray-900">{coachData.email}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color="#666" />
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg opacity-50">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-400">Email</Text>
                <Text className="text-base text-gray-400">Not provided</Text>
              </View>
            </View>
          )}
        </View>

        {/* Skills Section */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-2">Skills</Text>
          <View className="flex-row flex-wrap">
            {skillIcons.map((skill, index) => (
              <View key={index} className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                <Text className="text-gray-700 ml-1">{skill.title}</Text>
              </View>
            ))}
            {skillIcons.length === 0 && (
              <Text className="text-gray-500 italic">No skills specified</Text>
            )}
          </View>
        </View>

        {/* About Section */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-2">About</Text>
          <Text className="text-gray-700 leading-5">
            {coachData.bio1 || "No bio information available for this coach."}
          </Text>
        </View>

        {/* What UA Means to Me Section with Bio Image */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold mb-2">What UA Means to me</Text>
          <View className="mb-3">
            {coachData.bio2 ? (
              <Text className="text-gray-700">{coachData.bio2}</Text>
            ) : (
              <Text className="text-gray-500 italic">No information available</Text>
            )}
          </View>
          <View className="my-3 flex items-center justify-center">
            <Image 
              source={coachData.bioPic1 ? { uri: coachData.bioPic1 } : require('../../images/logo.png')} 
              className="w-3/4 h-48 rounded-lg"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 px-4 mb-8">
          {ActionButton}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CoachProfile