import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { getMembersIncomingPendingConnectionRequests } from '../../controllers/ConnectionRequestController';

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
  // Add pending connection requests - these should be part of the interface
  pendingConnectionRequests: ConnectionRequest[];
  isLoadingRequests: boolean;
  // Add any other user fields you have
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  setUserData: (data: Omit<UserData, 'pendingConnectionRequests' | 'isLoadingRequests'> | null) => void;
  updateUserData: (updates: Partial<UserData>) => void;
  hasInboxNotifications: boolean;
  inboxNotificationCount: number;
  isLoading: boolean;
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

  // Function to update user data
  const updateUserData = (updates: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...updates } : null);
  };

  // Function to set user data and fetch connection requests
  const setUserDataWithRequests = async (data: Omit<UserData, 'pendingConnectionRequests' | 'isLoadingRequests'> | null) => {
    if (data) {
      // Set initial user data with empty requests and loading state
      const userDataWithRequests: UserData = {
        ...data,
        pendingConnectionRequests: [],
        isLoadingRequests: true
      };
      setUserData(userDataWithRequests);

      // Fetch connection requests in the background
      try {
        const requests = await fetchConnectionRequests(data.id);
        setUserData(prev => prev ? { 
          ...prev, 
          pendingConnectionRequests: requests,
          isLoadingRequests: false 
        } : null);
      } catch (error) {
        console.error('Error fetching initial connection requests:', error);
        setUserData(prev => prev ? { ...prev, isLoadingRequests: false } : null);
      }
    } else {
      setUserData(null);
    }
  };

  // Computed values for inbox notifications
  const hasInboxNotifications = userData ? userData.pendingConnectionRequests.length > 0 : false;
  const inboxNotificationCount = userData ? userData.pendingConnectionRequests.length : 0;

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
    isLoading,
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
