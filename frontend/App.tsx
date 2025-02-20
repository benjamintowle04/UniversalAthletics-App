import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
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
import UploadProfilePicture from './app/screens/onboarding/UploadProfilePicture';
import { Upload } from 'lucide-react-native';

//TODO: 
// 1. Enable Google Sign In
// 2. Finish New User Screen Flow


const PreLoginStack = createNativeStackNavigator();
const PostLoginStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null >(null);
  const [newUser, setNewUser] = useState(false);

  const backButtonOnlyHeader = {
    headerShown: true,
    title: '',
    headerBackTitle: 'Back'
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User', user);
      setUser(user);
      if (user?.metadata.creationTime === user?.metadata.lastSignInTime) {
        setNewUser(true);
      } else {
        setNewUser(true);  
      }
    });

    return () => unsubscribe();
  }, []);
  


  function PostLoginLayout() {
    if (newUser) {
      return (
        <PostLoginStack.Navigator initialRouteName='GenInfo'>
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
            name="UploadProfilePicture" 
            component={UploadProfilePicture} 
            options={backButtonOnlyHeader}
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

  return (
    <UserProvider>
      <NavigationContainer>
        {/* {user ? (   //Uncomment to test authentication
          <PostLoginLayout />
        ) : (
          <PreLoginLayout/>
        )} */}
        <PostLoginLayout />
      </NavigationContainer>
    </UserProvider>
  );
}
