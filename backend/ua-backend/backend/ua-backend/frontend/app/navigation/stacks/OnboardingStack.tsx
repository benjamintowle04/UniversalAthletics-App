import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { backButtonOnlyHeader } from '../headers/HeaderOptions';

// Screen imports
import GenInfo from '../../screens/onboarding/GenInfo';
import EnterSkills from '../../screens/onboarding/EnterSkills';
import AccountSummary from '../../screens/onboarding/AccountSummary';

const Stack = createNativeStackNavigator();

interface OnboardingStackNavigatorProps {
  MainAppNavigator: React.ComponentType<any>;
}

export function OnboardingStackNavigator({ MainAppNavigator }: OnboardingStackNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName='GenInfo'>
      <Stack.Screen 
        name="GenInfo" 
        component={GenInfo} 
        options={backButtonOnlyHeader}
      />
      <Stack.Screen 
        name="EnterSkills" 
        component={EnterSkills} 
        options={backButtonOnlyHeader}
      />
      <Stack.Screen 
        name="AccountSummary" 
        component={AccountSummary} 
        options={backButtonOnlyHeader}
      />
      <Stack.Screen 
        name="Home" 
        component={MainAppNavigator} 
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
