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
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        if (!userData || !userData.id) {
          console.error('User data is not available or incomplete');
          return;
        } 
        const coaches = await getMembersCoaches(userData.id);
        setCoaches(coaches);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCoaches = coaches.filter(coach => 
    `${coach.firstName} ${coach.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="people-outline" size={80} color="#ccc" />
      <Text className="text-xl font-semibold text-gray-700 mt-4 text-center">
        No Coaches Yet
      </Text>
      <Text className="text-base text-gray-500 mt-2 text-center leading-6">
        You haven't connected with any coaches yet. Start exploring to find the perfect coach for your athletic journey!
      </Text>
      <TouchableOpacity 
        className="bg-blue-500 px-6 py-3 rounded-full mt-6 flex-row items-center"
        onPress={() => navigation.navigate('ExploreCoaches')}
      >
        <Ionicons name="compass" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">Explore Coaches</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-8 mb-0">
        <HeaderText text='My Coaches'/>
      </View>
      
      {coaches.length > 0 && (
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
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading coaches...</Text>
        </View>
      ) : coaches.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView className="flex-1 px-2">
          {filteredCoaches.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text className="text-lg text-gray-500 mt-4">No coaches found</Text>
              <Text className="text-gray-400 mt-1">Try adjusting your search</Text>
            </View>
          ) : (
            filteredCoaches.map((coach) => (
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
            ))
          )}
        </ScrollView>
      )}

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
