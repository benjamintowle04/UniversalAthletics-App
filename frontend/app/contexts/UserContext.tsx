import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase_config';
import { onAuthStateChanged } from 'firebase/auth';
import { getMembersIncomingPendingConnectionRequests } from '../../controllers/ConnectionRequestController';
import { User as LucideUser } from 'lucide-react-native';

// Define the connection request interface based on your database schema
interface ConnectionRequest {
  Request_ID: number;
  Sender_Type: 'COACH' | 'MEMBER';
  Sender_ID: number;
  Receiver_Type: 'COACH' | 'MEMBER';
  Receiver_ID: number;
  Status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  Message?: string;
  Created_At: string;
  Updated_At: string;
  // Add any additional fields that your API returns (like sender details)
  Sender_First_Name?: string;
  Sender_Last_Name?: string;
  Sender_Profile_Pic?: string;
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
  // Add pending connection requests
  pendingConnectionRequests: ConnectionRequest[];
  isLoadingRequests: boolean;
  // Add any other user fields you have
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
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
  const setUserDataWithRequests = async (data: UserData | null) => {
    if (data) {
      // Set initial user data
      const userDataWithRequests = {
        ...data,
        pendingConnectionRequests: [],
        isLoadingRequests: true
      };
      setUserData(userDataWithRequests);

      // Fetch connection requests
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


