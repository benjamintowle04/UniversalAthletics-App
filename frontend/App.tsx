import React from 'react';
import { StyleSheet } from 'react-native';
import initSilenceConsole from './app/utils/silenceConsole';
import { UserProvider } from './app/contexts/UserContext';
import { AppNavigator } from './app/navigation/AppNavigator';

// Ensure nativewind/react-native-css-interop uses the 'class' strategy for dark mode
// to avoid runtime errors when the environment's color scheme is controlled by media queries.
try {
  // setFlag is available on StyleSheet in react-native-web + css interop
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (StyleSheet && typeof (StyleSheet as any).setFlag === 'function') {
    // Use 'class' strategy so dark mode is applied via a class rather than media
    (StyleSheet as any).setFlag('darkMode', 'class');
  }
} catch (err) {
  console.warn('Unable to set StyleSheet darkMode flag:', err);
}

// Initialize optional console silencing (module has side effects)
initSilenceConsole();

//   TODO:
//      - Update onboarding location input to just use strings (Will use geolocating later) (Done by today)
//      - Home Page (Done by today)
//      - Max + Ben Admin Page (Done by Wednesday)
//      - Publish!! (Done by Friday)

export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
}
