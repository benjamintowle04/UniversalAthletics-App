import React, { createContext, useState, ReactNode } from 'react';

interface UserContextProps {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>({});

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};