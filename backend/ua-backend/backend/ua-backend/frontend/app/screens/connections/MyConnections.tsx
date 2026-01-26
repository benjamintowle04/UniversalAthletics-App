import { Platform, Dimensions } from 'react-native'
import React, { useEffect, useState, useContext, useMemo} from 'react'
import { UserContext } from '../../contexts/UserContext'
import { getMembersCoaches } from '../../../controllers/MemberInfoController'
import { getCoachesMembers } from '../../../controllers/CoachController'
import { RouterProps } from "../../types/RouterProps";
import { useConnection } from '../../hooks/connections/useConnection'
import "../../../global.css"
import MyConnectionsWebUI from '../../ui/web/connections/MyConnectionsWebUI';
import MyConnectionsMobileUI from '../../ui/mobile/connections/MyConnectionsMobileUI';

const MyConnections = ({ navigation }: RouterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRIES = 10;
  const RETRY_DELAY_MS = 500;

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

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
      
  const { userData, setUserData, userDataVersion } = userContext as any;

  // Use the connection hook for message functionality
  // We'll pass null for profileData since we'll pass the connection data directly to handleMessageProfile
  const { handleMessageProfile } = useConnection({
    profileData: null,
    profileId: undefined,
    profileType: undefined,
    profileFirebaseId: undefined,
    navigation
  });

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
          const coaches = await getMembersCoaches(userData.id);
          console.log("Fetched coaches for member:", coaches);
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
          const members = await getCoachesMembers(userData.id);
          console.log("Fetched members for coach:", members);
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
    } else {
      console.log(`User data incomplete for fetching connections. userData:`, userData);
      // If userData exists but is incomplete (e.g., right after signup), retry a few times before giving up
      if (retryAttempts < MAX_RETRIES) {
        const t = setTimeout(() => setRetryAttempts((v) => v + 1), RETRY_DELAY_MS);
        return () => clearTimeout(t);
      } else {
        console.warn('Max retry attempts reached for fetching connections.');
        setIsLoading(false);
      }
    }

  }, [userData?.id, userData?.userType, retryAttempts, userDataVersion]); // Retry when attempts increment

  // Filter connections based on search query
  const filteredConnections = connections.filter(connection => 
    `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler functions for UI components
  const handleConnectionPress = (connection: Connection) => {
    navigation.navigate("ConnectionProfile", {
      profileId: connection.id,
      profileType: connection.userType, 
      profileFirebaseId: connection.firebaseID
    });
  };

  const handleExplorePress = () => {
    navigation.navigate('ExploreConnections');
  };

  // Create a wrapper for handleMessageProfile that passes the connection data
  const handleMessageConnection = (connection: Connection) => {
    handleMessageProfile(connection);
  };

  // Prepare props for UI components
  const uiProps = {
    connections,
    filteredConnections,
    searchQuery,
    setSearchQuery,
    isLoading,
    userSpecificData,
    userData: userData ? {...userData, id: userData.id.toString()} : null,
    navigation,
    onConnectionPress: handleConnectionPress,
    onExplorePress: handleExplorePress, 
    onMessagePress: handleMessageConnection,
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <MyConnectionsWebUI {...uiProps} />;
  }

  // Use the extracted mobile UI component
  return <MyConnectionsMobileUI {...uiProps} />;
}

export default MyConnections;
