import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext, useMemo} from 'react'
import { CoachCard } from '../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { Ionicons } from '@expo/vector-icons'
import { UserContext } from '../../contexts/UserContext'
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { getCoachesMembers } from '../../../controllers/CoachController'
import { RouterProps } from "../../types/RouterProps";
import { HeaderText } from '../../components/text/HeaderText'
import "../../../global.css"

const MyConnections = ({ navigation }: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Generic interface for connections that works for both coaches and members
  interface Connection {
    firebaseID?: string;
    id?: string;
    firstName: string;
    lastName: string;
    location: string;
    profilePic?: string;
    skills: Array<{skill_id: number, title: string}>;
    userType: 'COACH' | 'MEMBER'; 
  }
  
  const [connections, setConnections] = useState<Connection[]>([]);

  const userContext = useContext(UserContext);
  if (!userContext) {
    return null;
  }
      
  const { userData, setUserData } = userContext;

  // Memoize user-specific data to prevent infinite re-renders
  const userSpecificData = useMemo(() => {
    if (!userData) return null;

    if (userData.userType === 'COACH') {
      return {
        headerTitle: 'My Members',
        emptyStateTitle: 'No Members Yet',
        emptyStateDescription: 'You haven\'t connected with any members yet. Members can find and connect with you through the explore feature!',
        exploreButtonText: 'View Active Members',
        exploreNavigation: 'ExploreConnections',
        searchPlaceholder: 'Search members...',
        connectionType: 'members' as const
      };
    } else {
      return {
        headerTitle: 'My Coaches',
        emptyStateTitle: 'No Coaches Yet',
        emptyStateDescription: 'You haven\'t connected with any coaches yet. Start exploring to find the perfect coach for your athletic journey!',
        exploreButtonText: 'Explore Coaches',
        exploreNavigation: 'ExploreConnections',
        searchPlaceholder: 'Search coaches...',
        connectionType: 'coaches' as const
      };
    }
  }, [userData?.userType]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!userData || !userData.id || !userSpecificData) {
          console.error('User data is not available or incomplete');
          return;
        } 

        let fetchedConnections: Connection[] = [];
        if (userData.userType === 'MEMBER') {
          console.log('Fetching coaches for member:', userData.id);
          const coaches = await getMembersCoaches(userData.id);
          fetchedConnections = (coaches || []).map((coach: any): Connection => ({
            firebaseID: coach.firebaseID || coach.firebaseId,
            id: coach.id?.toString(),
            firstName: coach.firstName || "",
            lastName: coach.lastName || "",
            location: coach.location || "",
            profilePic: coach.profilePic,
            skills: coach.skills || [],
            userType: 'COACH'
          }));
        } else if (userData.userType === 'COACH') {
          console.log('Fetching members for coach:', userData.id);
          const members = await getCoachesMembers(userData.id);
          fetchedConnections = (members || []).map((member: any): Connection => ({
            firebaseID: member.firebaseID || member.firebaseId,
            id: member.id?.toString(),
            firstName: member.firstName || "",
            lastName: member.lastName || "",
            location: member.location || "",
            profilePic: member.profilePic,
            skills: member.skills || [],
            userType: 'MEMBER'
          }));
        }

        console.log(`Fetched ${fetchedConnections.length} ${userSpecificData.connectionType}`);
        setConnections(fetchedConnections);
      } catch (error) {
        console.error(`Error fetching ${userSpecificData?.connectionType}:`, error);
      } finally {
        setIsLoading(false);
      }
    };



    // Only fetch if we have the required data
    if (userData?.id && userData?.userType && userSpecificData) {
      console.log(`Fetching connections for user ID: ${userData.id}, User Type: ${userData.userType}`);
      fetchData();
    }
    else {
      console.log(`Failed Fetching connections for either member or coach based on user type: ${userData?.userType}`);
    }

  }, [userData?.id, userData?.userType]); // Only depend on specific userData properties

  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEmptyState = () => {
    if (!userSpecificData) return null;

    return (
      <View className="flex-1 items-center justify-center px-8">
        <Ionicons name="people-outline" size={80} color="#ccc" />
        <Text className="text-xl font-semibold text-gray-700 mt-4 text-center">
          {userSpecificData.emptyStateTitle}
        </Text>
        <Text className="text-base text-gray-500 mt-2 text-center leading-6">
          {userSpecificData.emptyStateDescription}
        </Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-full mt-6 flex-row items-center"
          onPress={() => {
            if (userSpecificData.exploreNavigation === 'ExploreConnections') {
              navigation.navigate('ExploreConnections');
            } else {
              navigation.navigate('Profile');
            }
          }}
        >
          <Ionicons 
            name={userData?.userType === 'COACH' ? "settings" : "compass"} 
            size={20} 
            color="white" 
          />
          <Text className="text-white font-semibold ml-2">
            {userSpecificData.exploreButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderConnectionCard = (connection: Connection) => {
    return (
      <View key={connection.firebaseID || connection.id}>
        <CoachCard
          imageUrl={connection.profilePic}
          firstName={connection.firstName}
          lastName={connection.lastName}
          location={connection.location}
          skills={connection.skills ? getIconsFromSkills(connection.skills) : []}
          onPress={() => {
            navigation.navigate("ConnectionProfile", {
              profileId: connection.firebaseID,
              profileType: connection.userType
            });
          }}
        />
      </View>
    );
  };


  // Show loading while user data is being determined
  if (!userData || !userSpecificData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-8 mb-0">
        <HeaderText text={userSpecificData.headerTitle}/>
      </View>
      
      {connections.length > 0 && (
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-0">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder={userSpecificData.searchPlaceholder}
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
          <Text className="text-gray-500">
            Loading {userSpecificData.connectionType}...
          </Text>
        </View>
      ) : connections.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView className="flex-1 px-2">
          {filteredConnections.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text className="text-lg text-gray-500 mt-4">
                No {userSpecificData.connectionType} found
              </Text>
              <Text className="text-gray-400 mt-1">Try adjusting your search</Text>
            </View>
          ) : (
            filteredConnections.map((connection) => renderConnectionCard(connection))
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => { navigation.navigate("ExploreConnections") }}
      >
        <Ionicons 
          name="compass"
          size={28} 
          color="white" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default MyConnections;
