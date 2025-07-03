import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';

// Stack Navigator imports
import { HomeStackNavigator } from '../stacks/HomeStack';
import { ScheduleStackNavigator } from '../stacks/ScheduleStack';
import { ConnectionsStackNavigator } from '../stacks/ConnectionsStack';
import { SettingsStackNavigator } from '../stacks/SettingsStack';
import { InboxStackNavigator } from '../stacks/InboxStack';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, userType } = useUser();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScheduleTab') {
            iconName = focused ? 'calendar-number' : 'calendar-number-outline';
          } else if (route.name === 'MerchTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ConnectionsTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          } 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{
          tabBarLabel: 'Home',
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Only reset if the tab is already focused (user taps the same tab twice)
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (!currentRoute.state?.index) {
              // If the current route has no state, it means it's the root screen
              return;
            }
            
            if (currentRoute.name === 'HomeTab' && currentRoute.state?.index > 0) {
              // User is on HomeTab and not on the root screen, so reset to root
              navigation.reset({
                index: 0,
                routes: [{ name: 'HomeTab' }],
              });
            }
          },
        })}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleStackNavigator} 
        options={{
          tabBarLabel: 'Schedule',
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Only reset if the tab is already focused (user taps the same tab twice)
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (!currentRoute.state?.index) {
              // If the current route has no state, it means it's the root screen
              return;
            }
            
            if (currentRoute.name === 'ScheduleTab' && currentRoute.state?.index > 0) {
              // User is on ScheduleTab and not on the root screen, so reset to root
              navigation.reset({
                index: 0,
                routes: [{ name: 'ScheduleTab' }],
              });
            }
          },
        })}
      />
      <Tab.Screen 
        name="ConnectionsTab"
        component={ConnectionsStackNavigator}
        options={{
          tabBarLabel: userType === 'COACH' ? 'Members' : 'Coaches'
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Only reset if the tab is already focused (user taps the same tab twice)
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (!currentRoute.state?.index) {
              // If the current route has no state, it means it's the root screen
              return;
            }
            
            if (currentRoute.name === 'ConnectionsTab' && currentRoute.state?.index > 0) {
              // User is on ConnectionsTab and not on the root screen, so reset to root
              navigation.reset({
                index: 0,
                routes: [{ name: 'ConnectionsTab' }],
              });
            }
          },
        })}
      />

      <Tab.Screen 
        name="InboxTab"
        component={InboxStackNavigator}
        options={{
          tabBarLabel: 'Inbox',
          tabBarItemStyle: { display: 'none' },
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Only reset if the tab is already focused (user taps the same tab twice)
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (!currentRoute.state?.index) {
              // If the current route has no state, it means it's the root screen
              return;
            }
            
            if (currentRoute.name === 'InboxTab' && currentRoute.state?.index > 0) {
              // User is on InboxTab and not on the root screen, so reset to root
              navigation.reset({
                index: 0,
                routes: [{ name: 'InboxTab' }],
              });
            }
          },
        })}
      />

      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStackNavigator} 
        options={{
          tabBarLabel: 'Settings',
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Only reset if the tab is already focused (user taps the same tab twice)
            const state = navigation.getState();
            const currentRoute = state.routes[state.index];
            if (!currentRoute.state?.index) {
              // If the current route has no state, it means it's the root screen
              return;
            }
            
            if (currentRoute.name === 'SettingsTab' && currentRoute.state?.index > 0) {
              // User is on SettingsTab and not on the root screen, so reset to root
              navigation.reset({
                index: 0,
                routes: [{ name: 'SettingsTab' }],
              });
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}
