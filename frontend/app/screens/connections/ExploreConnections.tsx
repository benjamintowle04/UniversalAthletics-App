import { Platform, Dimensions } from 'react-native'
import React, { useEffect, useState, useContext, useMemo} from 'react'
import { UserContext } from '../../contexts/UserContext'
import { getAllCoaches } from '../../../controllers/CoachController'
import { getAllMembers } from '../../../controllers/MemberInfoController'
import { RouterProps } from "../../types/RouterProps";
import ExploreConnectionsWebUI from '../../ui/web/connections/ExploreConnectionsWebUI';
import ExploreConnectionsMobileUI from '../../ui/mobile/connections/ExploreConnectionsMobileUI';

const ExploreConnections = ({navigation}: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Generic interface for connections that works for both coaches and members
  interface Connection {
    firebaseID: string;
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
        console.log("First Connection in explore firebase ID is", fetchedConnections.at(0)?.firebaseID)
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

  // Handler functions for UI components
  const handleConnectionPress = (connection: Connection) => {
    console.log("Navigating to Connection profile with profile firebase ID: ", connection.firebaseID)
    if (userData == null || userData.id == null) {
      console.error('User data is not available or incomplete');
      return;
    }
    
    
    navigation.navigate("ConnectionProfile", {
      profileId: connection.id,
      profileType: connection.userType, 
      profileFirebaseId: connection.firebaseID, 
      coachId: connection.userType === "COACH" ? connection.id : userData.id,
      memberId: connection.userType === "MEMBER" ? connection.id : userData.id,
    });
  };

  const handleFilterPress = () => {
    // TODO: Navigate to filter screen or show filter modal
    console.log('Filter button pressed');
    // Example navigation (you'll need to create this screen):
    // navigation.navigate('ExploreFilters', { 
    //   userType: userData?.userType,
    //   targetUserType: userSpecificData?.targetUserType 
    // });
  };

  // Prepare props for UI components
  const uiProps = {
    connections,
    filteredConnections,
    searchQuery,
    setSearchQuery,
    userSpecificData,
    userData,
    onConnectionPress: handleConnectionPress,
    onFilterPress: handleFilterPress,
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <ExploreConnectionsWebUI {...uiProps} />;
  }

  // Use the extracted mobile UI component
  return <ExploreConnectionsMobileUI {...uiProps} />;
}

export default ExploreConnections
