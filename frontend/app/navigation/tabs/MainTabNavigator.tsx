import React from 'react';
import { HomeStackNavigator } from '../stacks/HomeStack';

// Simplified navigator: return only the Home stack to remove bottom tab navigation
export function MainTabNavigator() {
  return <HomeStackNavigator />;
}
