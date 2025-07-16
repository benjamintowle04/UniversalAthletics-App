import React from 'react';
import { UserProvider } from './app/contexts/UserContext';
import { AppNavigator } from './app/navigation/AppNavigator';

//   TODO:
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
