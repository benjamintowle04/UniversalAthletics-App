import React from 'react';
import { UserProvider } from './app/contexts/UserContext';
import { AppNavigator } from './app/navigation/AppNavigator';

//   TODO:
//      - Quick Fix? 0 appears in the inbox when icon should be blank
//      - Finish the Distinguishment between web and mobile
//      - Group Chat functionality between coaches/clients
//      - ConnectionProfile to display skills and skill levels
//      - Figure Out location user input 
//      - Home Page!!!

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
