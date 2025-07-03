import React from 'react';
import { UserProvider } from './app/contexts/UserContext';
import { AppNavigator } from './app/navigation/AppNavigator';

//   TODO:
//      - ConnectionProfile to display skills and skill levels
//      - Search Bar Functionality
//      

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
