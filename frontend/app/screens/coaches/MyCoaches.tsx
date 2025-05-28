import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext} from 'react'
import { CoachCard } from '../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../contexts/UserContext'
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { RouterProps } from "../../types/RouterProps";
import { HeaderText } from '../../components/text/HeaderText'
import "../../../global.css"


const MyCoaches = ({ navigation }: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  interface Coach {
    firebaseID?: string;
    id?: string;
    firstName: string;
    lastName: string;
    location: string;
    profilePic?: string;
    skills: Array<{skill_id: number, title: string}>;
  }
  
  const [coaches, setCoaches] = useState<Coach[]>([]);

  const userContext = useContext(UserContext);
    if (!userContext) {
        return null;
    }
      
  const { userData, setUserData } = userContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coaches = await getMembersCoaches(userData.id);
        setCoaches(coaches);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-8 mb-0">
        <HeaderText text='My Coaches'/>
      </View>
      
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-0">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
          {searchQuery.length > 0 && (
            <Ionicons 
              name="close-circle" 
              size={20} 
              color="#666" 
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-2">
        {coaches.map((coach) => (
          <View key={coach.firebaseID || coach.id}>
            <CoachCard
              imageUrl={coach.profilePic}
              firstName={coach.firstName || ""}
              lastName={coach.lastName || ""}
              location={coach.location || ""}
              skills={coach.skills ? getIconsFromSkills(coach.skills) : []}
              onPress={() => navigation.navigate('CoachProfile', { coachId: coach.firebaseID})}
            />
          </View> 
        ))}
      </ScrollView>

      {/* Floating Compass Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('ExploreCoaches')}
      >
        <Ionicons name="compass" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default MyCoaches
