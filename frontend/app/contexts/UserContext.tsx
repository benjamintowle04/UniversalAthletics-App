import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { getMembersIncomingPendingConnectionRequests, getMembersSentPendingConnectionRequests, getCoachesIncomingPendingConnectionRequests , getCoachesSentPendingConnectionRequests} from '../../controllers/ConnectionRequestController';
import { getMembersIncomingPendingSessionRequests, getMembersSentPendingSessionRequests, getCoachesIncomingPendingSessionRequests, getCoachesSentPendingSessionRequests } from '../../controllers/SessionRequestController';
import { getMembersCoaches } from '../../controllers/MemberInfoController';
import { getMemberByFirebaseId } from '../../controllers/MemberInfoController';
import { getCoachByFirebaseId } from '../../controllers/CoachController';
import { getCoachesMembers } from '../../controllers/CoachController';
import { Conversation } from '../types/MessageTypes';
import { getConversationsWithLiveUnreadCounts } from '../../controllers/MessageController';

interface Skill {
  skill_id: number;
  title: string;
}

interface ConnectionRequest {
  id: number;
  senderType: 'COACH' | 'MEMBER';
  senderId: number;
  senderFirebaseId?: string;
  receiverType: 'COACH' | 'MEMBER';
  receiverId: number;
  receiverFirebaseId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderProfilePic?: string;
}

interface SessionRequest {
  id: number;
  senderType: 'COACH' | 'MEMBER';
  senderId: number;
  senderFirebaseId?: string;
  receiverType: 'COACH' | 'MEMBER';
  receiverId: number;
  receiverFirebaseId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  message?: string;
  createdAt: string;
  updatedAt: string;
  senderFirstName?: string;
  senderLastName?: string;
  senderProfilePic?: string;
  receiverFirstName?: string;
  receiverLastName?: string;
  receiverProfilePic?: string;
  sessionDate1: string;
  sessionDate2: string;
  sessionDate3: string;
  sessionTime1: string;
  sessionTime2: string;
  sessionTime3: string;
  sessionLocation: string;
  sessionDescription: string;
}

// Generic connection interface that works for both coaches and members
interface Connection {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography?: string;
  biography1?: string | undefined; // For coaches
  biography2?: string | undefined; // For coaches
  profilePic: string;
  bioPic1?: string; // For coaches
  bioPic2?: string; // For coaches
  location: string;
  firebaseID: string;
  userType: 'COACH' | 'MEMBER';
  skills?: any[];
}

// Coach data interface based on your database schema
interface CoachData {
  id: number; // Coach_ID
  firstName: string; // First_Name
  lastName: string; // Last_Name
  email: string; // Email
  phone: string; // Phone
  biography1: string; // Biography_1
  biography2: string; // Biography_2
  profilePic: string; // Profile_Pic
  bioPic1: string; // Bio_Pic_1
  bioPic2: string; // Bio_Pic_2
  location: string; // Location
  firebaseId: string; // Firebase_ID
  userType: 'COACH';
  skills?: Skill[];
}

// Member data interface
interface MemberData {
  id: number; // Member_ID
  firstName: string; // First_Name
  lastName: string; // Last_Name
  email: string; // Email
  phone: string; // Phone
  biography?: string; // Biography
  profilePic?: string; // Profile_Pic
  location?: string; // Location
  firebaseId: string; // Firebase_ID
  userType: 'MEMBER';
  skills?: Skill[];
}

// Union type for user data
type UserData = (MemberData | CoachData) & {
  // To differentiate between coaches and members
  userType: "COACH" | "MEMBER";

  // Connection requests
  pendingConnectionRequests: ConnectionRequest[];
  isLoadingRequests: boolean;
  sentConnectionRequests: ConnectionRequest[];
  isLoadingSentRequests: boolean;
  // Session requests
  pendingSessionRequests: SessionRequest[];
  isLoadingSessionRequests: boolean;
  sentSessionRequests: SessionRequest[];
  isLoadingSentSessionRequests: boolean;
  // Connections (coaches for members, members for coaches)
  connections: Connection[];
  isLoadingConnections: boolean;
  // Messaging
  conversations?: Conversation[];
  unreadMessageCount?: number;
};

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  setUserData: (data: (MemberData | CoachData) | null) => Promise<void>;
  updateUserData: (updates: Partial<UserData>) => void;
  hasInboxNotifications: boolean;
  inboxNotificationCount: number;
  hasSentNotifications: boolean;
  sentNotificationCount: number;
  isLoading: boolean;
  isConnectedToCoach: (coachFirebaseId: string) => boolean;
  userType: 'MEMBER' | 'COACH' | null;
  // Add new state for initial user type detection
  isDetectingUserType: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetectingUserType, setIsDetectingUserType] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);


  useEffect(() => {
    if (!userData?.id || !FIREBASE_AUTH.currentUser) {
      setUnreadMessageCount(0);
      return;
    }

    console.log('Setting up unread message count listener in UserContext');
    
    const unsubscribe = getConversationsWithLiveUnreadCounts((conversations) => {
      const totalUnread = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      console.log("Total Unread Message Count: ", totalUnread)
      setUnreadMessageCount(totalUnread);
    });

    return () => {
      console.log('Cleaning up unread message count listener');
      unsubscribe();
    };
  }, [userData?.id]);

  // Function to detect user type by trying to fetch from both tables
  const detectUserType = async (firebaseId: string): Promise<'MEMBER' | 'COACH' | null> => {
    try {
      console.log('Detecting user type for Firebase ID:', firebaseId);
      
      // Try member first
      try {
        const memberData = await getMemberByFirebaseId(firebaseId);
        if (memberData && memberData.firstName) {
          console.log('User detected as MEMBER');
          return 'MEMBER';
        }
      } catch (memberError) {
        console.log('Not found in member table, checking coach table...');
      }

      // Try coach
      try {
        const coachData = await getCoachByFirebaseId(firebaseId);
        if (coachData && coachData.firstName) {
          console.log('User detected as COACH');
          return 'COACH';
        } 
      } catch (coachError) {
        console.log('Not found in coach table either');
      }

      return null;
    } catch (error) {
      console.error('Error detecting user type:', error);
      return null;
    }
  };

  // Function to fetch user data based on detected type
  const fetchUserDataByType = async (firebaseId: string, userType: 'MEMBER' | 'COACH'): Promise<MemberData | CoachData | null> => {
    try {
      if (userType === 'MEMBER') {
        const memberData = await getMemberByFirebaseId(firebaseId);
        memberData.userType = 'MEMBER';
        return memberData;
      } else {
        const coachData = await getCoachByFirebaseId(firebaseId);
        coachData.userType = 'COACH';
        return coachData;
        
      }
    } catch (error) {
      console.error(`Error fetching ${userType} data:`, error);
      return null;
    }
  };

  // Function to fetch pending connection requests
  const fetchConnectionRequests = async (userId: number, userType: 'MEMBER' | 'COACH'): Promise<ConnectionRequest[]> => {
    try {
      if (userType === 'MEMBER') {
        const requests = await getMembersIncomingPendingConnectionRequests(userId);
        return requests || [];
      } else {
        const requests = await getCoachesIncomingPendingConnectionRequests(userId);
        return requests || [];
       
      }
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      return [];
    }
  };

  // Function to fetch sent connection requests
  const fetchSentConnectionRequests = async (userId: number, userType: 'MEMBER' | 'COACH'): Promise<ConnectionRequest[]> => {
    try {
      if (userType === 'MEMBER') {
        const requests = await getMembersSentPendingConnectionRequests(userId); 
        return requests || [];
      } else {
        const requests = await getCoachesSentPendingConnectionRequests(userId);
        return requests || [];
      
      }
    } catch (error) {
      console.error('Error fetching sent connection requests:', error);
      return [];
    }
  };

  // Function to fetch pending session requests
  const fetchSessionRequests = async (userId: number, userType: 'MEMBER' | 'COACH'): Promise<SessionRequest[]> => {
    try {
      if (userType === 'MEMBER') {
        const requests = await getMembersIncomingPendingSessionRequests(userId);
        return requests || [];
      } else {
        const requests = await getCoachesIncomingPendingSessionRequests(userId);
        return requests || [];
      }
    } catch (error) {
      console.error('Error fetching session requests:', error);
      return [];
    }
  };

  // Function to fetch sent session requests
  const fetchSentSessionRequests = async (userId: number, userType: 'MEMBER' | 'COACH'): Promise<SessionRequest[]> => {
    try {
      if (userType === 'MEMBER') {
        const requests = await getMembersSentPendingSessionRequests(userId);
        return requests || [];
      } else {
        const requests = await getCoachesSentPendingSessionRequests(userId);
        return requests || [];
     
      }
    } catch (error) {
      console.error('Error fetching sent session requests:', error);
      return [];
    }
  };

 const fetchConnections = async (userId: number, userType: 'MEMBER' | 'COACH'): Promise<Connection[]> => {
  try {
    if (userType === 'MEMBER') {
      const coaches = await getMembersCoaches(userId);
      return (coaches || []).map((coach: any): Connection => ({
        id: coach.id,
        firstName: coach.firstName,
        lastName: coach.lastName,
        email: coach.email,
        phone: coach.phone,
        biography1: coach.biography1,
        biography2: coach.biography2,
        profilePic: coach.profilePic,
        bioPic1: coach.bioPic1,
        bioPic2: coach.bioPic2,
        location: coach.location,
        firebaseID: coach.firebaseID || coach.firebaseId,
        userType: 'COACH' as const,
        skills: coach.skills
      }));
    } else {
      const members = await getCoachesMembers(userId);
      return (members || []).map((member: any): Connection => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        biography: member.biography,
        profilePic: member.profilePic,
        location: member.location,
        firebaseID: member.firebaseID,
        userType: 'MEMBER' as const,
        skills: member.skills
      }));
      return []; // Placeholder for now
    }
  } catch (error) {
    console.error('Error fetching connections:', error);
    return [];
  }
};

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    setUserData(prev => {
      if (!prev) return null;
      
      // Ensure we maintain the correct user type structure
      if (prev.userType === 'COACH') {
        return {
          ...prev,
          ...updates,
          userType: 'COACH' as const, 
        } as UserData;
      } else {
        return {
          ...prev,
          ...updates,
          userType: 'MEMBER' as const, 
        } as UserData;
      }
    });
  }, []);

  // Enhanced function to set user data with automatic user type detection
  const setUserDataWithRequests = async (data: (MemberData | CoachData) | null) => {
    if (data) {
      console.log('Setting user data for user type:', data.userType); 
      
      // Set initial user data with empty arrays and loading states
      const userDataWithRequests: UserData = {
        ...data,
        pendingConnectionRequests: [],
        isLoadingRequests: true,
        sentConnectionRequests: [],
        isLoadingSentRequests: true,
        pendingSessionRequests: [],
        isLoadingSessionRequests: true,
        sentSessionRequests: [],
        isLoadingSentSessionRequests: true,
        connections: [],
        isLoadingConnections: true
      };
      setUserData(userDataWithRequests);

      // Fetch all data in parallel
      try {
        console.log('Fetching data for user type:', data.userType, 'with ID:', data.id); // Debug log
                const [incomingRequests, sentRequests, incomingSessionRequests, sentSessionRequests, connections] = await Promise.all([
          fetchConnectionRequests(data.id, data.userType),
          fetchSentConnectionRequests(data.id, data.userType),
          fetchSessionRequests(data.id, data.userType),
          fetchSentSessionRequests(data.id, data.userType),
          fetchConnections(data.id, data.userType)
        ]);
        
        console.log('Fetched data:', {
          incomingRequests: incomingRequests.length,
          sentRequests: sentRequests.length,
          incomingSessionRequests: incomingSessionRequests.length,
          sentSessionRequests: sentSessionRequests.length,
          connections: connections.length
        }); // Debug log
        
        setUserData(prev => {
          if (!prev) return null;
          return { 
            ...prev, 
            pendingConnectionRequests: incomingRequests,
            isLoadingRequests: false,
            sentConnectionRequests: sentRequests,
            isLoadingSentRequests: false,
            pendingSessionRequests: incomingSessionRequests,
            isLoadingSessionRequests: false,
            sentSessionRequests: sentSessionRequests,
            isLoadingSentSessionRequests: false,
            connections: connections,
            isLoadingConnections: false
          };
        });
      } catch (error) {
        console.error('Error fetching user related data:', error);
        setUserData(prev => {
          if (!prev) return null;
          return { 
            ...prev, 
            isLoadingRequests: false,
            isLoadingSentRequests: false,
            isLoadingSessionRequests: false,
            isLoadingSentSessionRequests: false,
            isLoadingConnections: false
          };
        });
      }
    } else {
      setUserData(null);
    }
  };

  // Helper function to check if connected to a coach using firebaseID
  const isConnectedToCoach = (coachFirebaseId: string): boolean => {
    if (!userData || userData.isLoadingConnections) return false;
    return userData.connections.some(connection => 
      connection.firebaseID === coachFirebaseId && connection.userType === 'COACH'
    );
  };

  // Helper function to check if connected to a member using firebaseID
  const isConnectedToMember = (memberFirebaseId: string): boolean => {
    if (!userData || userData.isLoadingConnections) return false;
    return userData.connections.some(connection => 
      connection.firebaseID === memberFirebaseId && connection.userType === 'MEMBER'
    );
  };

  // Computed values for inbox notifications (connection requests + session requests)
  const hasInboxNotifications = userData ? 
    (userData.pendingConnectionRequests.length > 0 || userData.pendingSessionRequests.length > 0 || unreadMessageCount > 0) : false;
  const inboxNotificationCount = userData ? 
    (userData.pendingConnectionRequests.length + userData.pendingSessionRequests.length + unreadMessageCount) : 0;

  // Computed values for sent notifications (pending sent requests for both types)
  const hasSentNotifications = userData ? 
    (userData.sentConnectionRequests.filter(req => req.status === 'PENDING').length > 0 || 
     userData.sentSessionRequests.filter(req => req.status === 'PENDING').length > 0) : false;
  const sentNotificationCount = userData ? 
    (userData.sentConnectionRequests.filter(req => req.status === 'PENDING').length + 
     userData.sentSessionRequests.filter(req => req.status === 'PENDING').length) : 0;

  // Enhanced useEffect to handle user type detection on app restart
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      console.log('Auth state changed, user:', user?.uid);
      setUser(user);
      
      if (user) {
        // If we don't have userData but we have a user, detect user type and fetch data
        if (!userData) {
          setIsDetectingUserType(true);
          
          try {
            console.log('Detecting user type and fetching data for:', user.uid);
            
            // First detect the user type
            const detectedUserType = await detectUserType(user.uid);
            
            if (detectedUserType) {
              console.log('Detected user type:', detectedUserType);
              
              // Fetch the user data based on detected type
              const fetchedUserData = await fetchUserDataByType(user.uid, detectedUserType);
              
              if (fetchedUserData) {
                console.log('Successfully fetched user data');
                await setUserDataWithRequests(fetchedUserData);
              } else {
                console.error('Failed to fetch user data for detected type:', detectedUserType);
              }
            } else {
              console.error('Could not detect user type for:', user.uid);
            }
          } catch (error) {
            console.error('Error during user type detection and data fetching:', error);
          } finally {
            setIsDetectingUserType(false);
            setIsLoading(false);
          }
        } else {
          // User data already exists, just ensure loading is false
          setIsLoading(false);
        }
      } else {
        // No user, clear everything
        setUserData(null);
        setIsLoading(false);
        setIsDetectingUserType(false);
      }
    });

    return () => unsubscribe();
  }, []); 

  const value: UserContextType = {
    user,
    userData,
    setUserData: setUserDataWithRequests,
    updateUserData,
    hasInboxNotifications,
    inboxNotificationCount,
    hasSentNotifications,
    sentNotificationCount,
    isLoading: isLoading || isDetectingUserType,
    isConnectedToCoach,
    userType: userData?.userType || null,
    isDetectingUserType,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };

        