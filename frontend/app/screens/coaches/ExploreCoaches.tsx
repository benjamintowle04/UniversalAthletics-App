import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useContext} from 'react'
import { CoachCard } from '../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { UserContext } from '../../contexts/UserContext'
import { getAllCoaches } from '../../../controllers/CoachController'
import { Ionicons } from '@expo/vector-icons'
import { HeaderText } from '../../components/text/HeaderText'
import { RouterProps } from "../../types/RouterProps";


const MyCoaches = ({navigation}: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  interface Coach {
    firebaseID?: string;
    id?: string;
    firstName: string;
    lastName: string;
    location: string;
    profilePic?: string;
    skills: Array<{skill_id: number, title: string, icon: React.ReactNode}>;  
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
        //Change to get coaches instead once they are in the database
        const coaches = await getAllCoaches(userData.location, userData.skills);
        setCoaches(coaches);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">  
      <View className="mt-4">
        <HeaderText text='Explore Coaches'/>
      </View>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
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
    </SafeAreaView>
  )
}

export default MyCoaches
