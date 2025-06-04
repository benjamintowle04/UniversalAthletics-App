import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { getMembersIncomingPendingConnectionRequests, getMembersSentPendingConnectionRequests } from '../../controllers/ConnectionRequestController';
import { getMembersIncomingPendingSessionRequests, getMembersSentPendingSessionRequests } from '../../controllers/SessionRequestController';
import { getMembersCoaches } from '../../controllers/MemberInfoController';

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

interface ConnectedCoach {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography1: string;
  biography2: string;
  profilePic: string;
  bioPic1: string;
  bioPic2: string;
  location: string;
  firebaseID: string;
  skill: any[];
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography?: string;
  profilePic?: string;
  location?: string;
  firebaseId: string;
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
  // Connected coaches
  connectedCoaches: ConnectedCoach[];
  isLoadingConnectedCoaches: boolean;
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  setUserData: (data: Omit<UserData, 'pendingConnectionRequests' | 'isLoadingRequests' | 'sentConnectionRequests' | 'isLoadingSentRequests' | 'pendingSessionRequests' | 'isLoadingSessionRequests' | 'sentSessionRequests' | 'isLoadingSentSessionRequests' | 'connectedCoaches' | 'isLoadingConnectedCoaches'> | null) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  hasInboxNotifications: boolean;
  inboxNotificationCount: number;
  hasSentNotifications: boolean;
  sentNotificationCount: number;
  isLoading: boolean;
  isConnectedToCoach: (coachFirebaseId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch pending connection requests
  const fetchConnectionRequests = async (memberId: number): Promise<ConnectionRequest[]> => {
    try {
      const requests = await getMembersIncomingPendingConnectionRequests(memberId);
      return requests || [];
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      return [];
    }
  };

  // Function to fetch sent connection requests
  const fetchSentConnectionRequests = async (memberId: number): Promise<ConnectionRequest[]> => {
    try {
      const requests = await getMembersSentPendingConnectionRequests(memberId); 
      return requests || [];
    } catch (error) {
      console.error('Error fetching sent connection requests:', error);
      return [];
    }
  };

  // Function to fetch pending session requests
  const fetchSessionRequests = async (memberId: number): Promise<SessionRequest[]> => {
    try {
      const requests = await getMembersIncomingPendingSessionRequests(memberId);
      return requests || [];
    } catch (error) {
      console.error('Error fetching session requests:', error);
      return [];
    }
  };

  // Function to fetch sent session requests
  const fetchSentSessionRequests = async (memberId: number): Promise<SessionRequest[]> => {
    try {
      const requests = await getMembersSentPendingSessionRequests(memberId);
      return requests || [];
    } catch (error) {
      console.error('Error fetching sent session requests:', error);
      return [];
    }
  };

  // Function to fetch connected coaches using existing API
  const fetchConnectedCoaches = async (memberId: number): Promise<ConnectedCoach[]> => {
    try {
      const coaches = await getMembersCoaches(memberId);
      return coaches || [];
    } catch (error) {
      console.error('Error fetching connected coaches:', error);
      return [];
    }
  };

  // Function to update user data
  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...updates } : null);
  };

  // Function to set user data and fetch all related data
  const setUserDataWithRequests = async (data: Omit<UserData, 'pendingConnectionRequests' | 'isLoadingRequests' | 'sentConnectionRequests' | 'isLoadingSentRequests' | 'pendingSessionRequests' | 'isLoadingSessionRequests' | 'sentSessionRequests' | 'isLoadingSentSessionRequests' | 'connectedCoaches' | 'isLoadingConnectedCoaches'> | null) => {
    if (data) {
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
        connectedCoaches: [],
        isLoadingConnectedCoaches: true
      };
      setUserData(userDataWithRequests);

      // Fetch all data in parallel
      try {
        const [incomingRequests, sentRequests, incomingSessionRequests, sentSessionRequests, connectedCoaches] = await Promise.all([
          fetchConnectionRequests(data.id),
          fetchSentConnectionRequests(data.id),
          fetchSessionRequests(data.id),
          fetchSentSessionRequests(data.id),
          fetchConnectedCoaches(data.id)
        ]);
        
        setUserData(prev => prev ? { 
          ...prev, 
          pendingConnectionRequests: incomingRequests,
          isLoadingRequests: false,
          sentConnectionRequests: sentRequests,
          isLoadingSentRequests: false,
          pendingSessionRequests: incomingSessionRequests,
          isLoadingSessionRequests: false,
          sentSessionRequests: sentSessionRequests,
          isLoadingSentSessionRequests: false,
          connectedCoaches: connectedCoaches,
          isLoadingConnectedCoaches: false
        } : null);
      } catch (error) {
        console.error('Error fetching user related data:', error);
        setUserData(prev => prev ? { 
          ...prev, 
          isLoadingRequests: false,
          isLoadingSentRequests: false,
          isLoadingSessionRequests: false,
          isLoadingSentSessionRequests: false,
          isLoadingConnectedCoaches: false
        } : null);
      }
    } else {
      setUserData(null);
    }
  };

  // Helper function to check if connected to a coach using firebaseID
  const isConnectedToCoach = (coachFirebaseId: string): boolean => {
    if (!userData || userData.isLoadingConnectedCoaches) return false;
    return userData.connectedCoaches.some(coach => coach.firebaseID === coachFirebaseId);
  };

  // Computed values for inbox notifications (connection requests + session requests)
  const hasInboxNotifications = userData ? 
    (userData.pendingConnectionRequests.length > 0 || userData.pendingSessionRequests.length > 0) : false;
  const inboxNotificationCount = userData ? 
    (userData.pendingConnectionRequests.length + userData.pendingSessionRequests.length) : 0;

  // Computed values for sent notifications (pending sent requests for both types)
  const hasSentNotifications = userData ? 
    (userData.sentConnectionRequests.filter(req => req.status === 'PENDING').length > 0 || 
     userData.sentSessionRequests.filter(req => req.status === 'PENDING').length > 0) : false;
  const sentNotificationCount = userData ? 
    (userData.sentConnectionRequests.filter(req => req.status === 'PENDING').length + 
     userData.sentSessionRequests.filter(req => req.status === 'PENDING').length) : 0;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setIsLoading(false);
      
      if (!user) {
        setUserData(null);
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
    isLoading,
    isConnectedToCoach,
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
