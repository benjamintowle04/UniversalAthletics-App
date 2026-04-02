import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { backButtonOnlyHeader } from '../headers/HeaderOptions';

// Screen imports
import EntryPoint from '../../screens/pre_login/EntryPoint';
import { HomeStackNavigator } from './HomeStack';
import {createInboxHeaderWithoutBackButton} from '../headers/HeaderOptions';

const Stack = createNativeStackNavigator();

export function PreLoginStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='EntryPoint'>
      <Stack.Screen 
        name="EntryPoint" 
        component={EntryPoint} 
        options={{ headerShown: false }}
      />
      {/* Login/SignUp removed — guest-only access */}
      <Stack.Screen
        name="HomeTab"
        component={HomeStackNavigator as React.ComponentType<any>}
        options={createInboxHeaderWithoutBackButton as any}
      />
    </Stack.Navigator>
  );
}
