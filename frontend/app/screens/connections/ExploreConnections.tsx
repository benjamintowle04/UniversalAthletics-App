import { View, Text, TextInput, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useContext, useMemo} from 'react'
import { CoachCard } from '../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { UserContext } from '../../contexts/UserContext'
import { getAllCoaches } from '../../../controllers/CoachController'
import { getAllMembers } from '../../../controllers/MemberInfoController' // Add this import
import { Ionicons } from '@expo/vector-icons'
import { HeaderText } from '../../components/text/HeaderText'
import { RouterProps } from "../../types/RouterProps";

const ExploreConnections = ({navigation}: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Generic interface for connections that works for both coaches and members
  interface Connection {
    firebaseID?: string;
    id?: string;
    firstName: string;
    lastName: string;
    location: string;
    profilePic?: string;
    skills: Array<{skill_id: number, title: string, icon: React.ReactNode}>;
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
        headerTitle: 'Explore Members',
        searchPlaceholder: 'Search members...',
        connectionType: 'members' as const,
        targetUserType: 'MEMBER' as const
      };
    } else {
      return {
        headerTitle: 'Explore Coaches',
        searchPlaceholder: 'Search coaches...',
        connectionType: 'coaches' as const,
        targetUserType: 'COACH' as const
      };
    }
  }, [userData?.userType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userData || !userData.location || !userSpecificData) {
          console.error('User data is not available or incomplete');
          return;
        }

        let fetchedConnections: Connection[] = [];

        if (userData.userType === 'MEMBER') {
          console.log('Fetching coaches for member exploration');
          const coaches = await getAllCoaches(userData.location, userData.skills || []);
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
          console.log('Fetching members for coach exploration');
          const members = await getAllMembers();
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

        console.log(`Fetched ${fetchedConnections.length} ${userSpecificData.connectionType} for exploration`);
        setConnections(fetchedConnections);
      } catch (error) {
        console.error(`Error fetching ${userSpecificData?.connectionType} for exploration:`, error);
      }
    };

    console.log("Preparing to fetch all members")

    // Only fetch if we have the required data
    if (userData?.location && userData?.userType && userSpecificData) {
      console.log(`Fetching ${userSpecificData.connectionType} for exploration - User Type: ${userData.userType}`);
      fetchData();
    } else {
      console.log(`Failed to fetch connections for exploration - User Type: ${userData?.userType}`);
    }
  }, [userData?.location, userData?.userType, userData?.skills]);

  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <View className="mt-4">
        <HeaderText text={userSpecificData.headerTitle}/>
      </View>
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
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
      <ScrollView className="flex-1 px-2">
        {filteredConnections.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4">
              No {userSpecificData.connectionType} found
            </Text>
            <Text className="text-gray-400 mt-1">
              {searchQuery ? 'Try adjusting your search' : `No ${userSpecificData.connectionType} available in your area`}
            </Text>
          </View>
        ) : (
          filteredConnections.map((connection) => (
            <View key={connection.firebaseID || connection.id}>
              <CoachCard
                imageUrl={connection.profilePic}
                firstName={connection.firstName || ""}
                lastName={connection.lastName || ""}
                location={connection.location || ""}
                skills={connection.skills ? getIconsFromSkills(connection.skills) : []}
                onPress={() => {
                    navigation.navigate("ConnectionProfile", {
                      profileId: connection.firebaseID,
                      profileType: connection.userType
                    });
                  }}              
              />
            </View> 
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ExploreConnections
