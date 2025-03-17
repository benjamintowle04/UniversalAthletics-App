import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase_config';  
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import EntryPoint from './app/screens/EntryPoint';
import Home from './app/screens/Home';
import GenInfo from './app/screens/onboarding/GenInfo';
import EnterSkills from './app/screens/onboarding/EnterSkills';
import React from 'react';
import { UserProvider } from './app/contexts/UserContext';
import AccountSummary from './app/screens/onboarding/AccountSummary';

const PreLoginStack = createNativeStackNavigator();
const PostLoginStack = createNativeStackNavigator();

export default function App() {
  /**
   * These are state variables that are used to determine the user's authentication status.
   */
  const [user, setUser] = useState<User | null >(null);
  const [newUser, setNewUser] = useState(false);

  
  /*
  * This is the standard header for screens that need a back button.
  */
  const backButtonOnlyHeader = {
    headerShown: true,
    title: '',
    headerBackTitle: 'Back'
  }

  /**
   * 
   * This UseEffect hook is used to listen for changes in the user's authentication status. 
   *  Will react for users that log in and out of the app.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User', user);
      setUser(user);

      if (user?.metadata.creationTime === user?.metadata.lastSignInTime) {
        setNewUser(true);
      } else {
        setNewUser(false);  
      }
    });

    return () => unsubscribe();
  }, []);

  
  

/**
 * Extraction of the layout after the user is logged in.
 * @returns The apps onboarding screen flow if the user is new. Otherwise, it will return the main home layout
 * For this branch, initial route name is home to ensure we skip the onboarding screens.
 * Be sure to reset the initial route name to 'GenInfo' before merging to main. 
 */
  function PostLoginLayout() {
    if (newUser) {
      return (
        <PostLoginStack.Navigator initialRouteName='Home'>
          <PostLoginStack.Screen 
            name="GenInfo" 
            component={GenInfo} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="EnterSkills" 
            component={EnterSkills} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="AccountSummary" 
            component={AccountSummary} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="Home" 
            component={Home} 
            options={{headerShown: false}}
          />
        </PostLoginStack.Navigator>
      );
    }
    else {
      return (
        <PostLoginStack.Navigator initialRouteName='Home'>
          <PostLoginStack.Screen name="Home" component={Home} />
        </PostLoginStack.Navigator>
      );
    }
  }

  /**
   * Extraction of the layout before the user is logged in.
   * @returns The pre-login screen flow for navigation between login and signup.
   */
  function PreLoginLayout() {
    return (
      <PreLoginStack.Navigator initialRouteName='EntryPoint'>
        <PreLoginStack.Screen 
          name="EntryPoint" 
          component={EntryPoint} 
          options={{ headerShown: false }}
        />
        <PreLoginStack.Screen 
          name="Login" 
          component={Login}
          options={backButtonOnlyHeader}
        />
        <PreLoginStack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={backButtonOnlyHeader}
        />
      </PreLoginStack.Navigator>
    );
  }

  /**
   * Root logic to determine which layout to render based on the user's authentication status.
   * Actual logic is commented out for now. In this branch, we just want to have the postloginlayout with home as the initial route
   */
  return (
    <UserProvider>
      <NavigationContainer>
        <PostLoginLayout />
        {/* {user ? (   
          <PostLoginLayout />
        ) : (
          <PreLoginLayout/>
        )} */}
      </NavigationContainer>
    </UserProvider>
  );
}
