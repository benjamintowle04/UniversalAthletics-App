import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { backButtonOnlyHeader } from '../headers/HeaderOptions';

// Screen imports
import EntryPoint from '../../screens/pre_login/EntryPoint';
import Login from '../../screens/pre_login/Login';
import SignUp from '../../screens/pre_login/SignUp';

const Stack = createNativeStackNavigator();

export function PreLoginStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='EntryPoint'>
      <Stack.Screen 
        name="EntryPoint" 
        component={EntryPoint} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={backButtonOnlyHeader}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUp} 
        options={backButtonOnlyHeader}
      />
    </Stack.Navigator>
  );
}
