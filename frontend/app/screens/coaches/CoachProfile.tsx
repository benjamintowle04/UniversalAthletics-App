import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { getCoachByFirebaseId } from '../../../controllers/CoachController'
import { Ionicons } from '@expo/vector-icons'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { useUser } from '../../contexts/UserContext'
import { Colors } from '../../themes/colors/Colors'
import "../../../global.css"

// Define the Coach interface based on your data structure
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

const CoachProfile = ({ route }: { route: CoachProfileRouteProp }) => {
  // Initialize with proper typing
  const [coachData, setCoachData] = useState<Coach | null>(null);
  const { coachId } = route.params;
  const { userData } = useUser();

  // Check if this coach has a pending connection request to the current user
  const pendingRequest = userData?.pendingConnectionRequests?.find(
    request => request.senderFirebaseId === coachId
  );

  useEffect(() => {
    const fetchCoachData = async () => {
      console.log("Fetching coach data by firebase ID:", coachId);
      try {
        let coachData = await getCoachByFirebaseId(coachId);
        console.log("Coach data received in page layer:", coachData);
        setCoachData(coachData);
      } catch (error) {
        console.error("Error fetching coach data:", error);
      }
    }
    fetchCoachData();
  }, [coachId]);

  const handleEmailPress = () => {
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
  };

  const handleAcceptRequest = () => {
    if (pendingRequest) {
      // TODO: Implement accept connection request logic
      console.log('Accept pressed for request:', pendingRequest);
      Alert.alert("Request Accepted", "Connection request has been accepted!");
      // You'll need to call your API to accept the request and update the user context
    }
  };

  const handleDeclineRequest = () => {
    if (pendingRequest) {
      // TODO: Implement decline connection request logic
      console.log('Decline pressed for request:', pendingRequest);
      Alert.alert("Request Declined", "Connection request has been declined.");
      // You'll need to call your API to decline the request and update the user context
    }
  };

  if (!coachData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-600">Loading coach profile...</Text>
      </SafeAreaView>
    );
  }

  const skillIcons = coachData.skills ? getIconsFromSkills(coachData.skills) : [];

  return (
  <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="flex-1">
      {/* Profile Header */}
      <View className="relative">
        {/* Banner/Background - Using a generic blue background */}
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

      {/* Pending Request Notice */}
      {pendingRequest && (
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
      )}

      {/* Contact Information Section */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-semibold mb-3">Contact Information</Text>
        
        {/* Email */}
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
        {pendingRequest ? (
          // Show Accept/Decline buttons if there's a pending request
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="flex-1 py-3 rounded-lg items-center mr-2"
              style={{ backgroundColor: Colors.uaGreen }}
              onPress={handleAcceptRequest}
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Accept</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 py-3 rounded-lg items-center ml-2"
              style={{ backgroundColor: Colors.uaRed }}
              onPress={handleDeclineRequest}
            >
              <View className="flex-row items-center">
                <Ionicons name="close-circle-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Decline</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          // Show Contact button if no pending request
          <TouchableOpacity 
            className="bg-blue-500 py-3 rounded-lg items-center"
            onPress={() => {
              if (coachData.email) {
                handleEmailPress();
              } else {
                Alert.alert("Contact Unavailable", "No email address is available for this coach.");
              }
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">Contact Coach</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
)

}

export default CoachProfile
