import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { getCoachByFirebaseId } from '../../../controllers/CoachController'
import { Ionicons } from '@expo/vector-icons'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import "../../../global.css"

// Define the Coach interface based on your data structure
interface Coach {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
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
        
        {/* Bio Image - Adjusted width to match your changes */}
        <View className="my-3 flex items-center justify-center">
          <Image 
            source={coachData.bioPic1 ? { uri: coachData.bioPic1 } : require('../../images/logo.png')} 
            className="w-3/4 h-48 rounded-lg"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Contact Button */}
      <View className="mt-8 px-4 mb-8">
        <TouchableOpacity className="bg-blue-500 py-3 rounded-lg items-center">
          <Text className="text-white font-semibold text-lg">Contact Coach</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
)

}

export default CoachProfile
