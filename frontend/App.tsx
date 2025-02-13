import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase_config';  
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import EntryPoint from './app/screens/EntryPoint';
import Home from './app/screens/Home';
import React from 'react';
const PreLoginStack = createNativeStackNavigator();
const PostLoginStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null >(null);

  const preLoginHeaderOptions = {
    headerShown: true,
    title: '',
    headerBackTitle: 'Back'
  }

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User', user);
      setUser(user);
    });
  }, [user]);


  function PostLoginLayout() {
    return (
      <PostLoginStack.Navigator initialRouteName='Home'>
        <PostLoginStack.Screen name="Home" component={Home} />
      </PostLoginStack.Navigator>
    );
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
          options={preLoginHeaderOptions}
        />
        <PreLoginStack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={preLoginHeaderOptions}
        />
      </PreLoginStack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <PostLoginLayout />
      ) : (
        <PreLoginLayout/>
      )}
    </NavigationContainer>
  );
}
