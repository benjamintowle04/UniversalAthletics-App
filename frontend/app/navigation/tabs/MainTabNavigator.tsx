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
          } else if (route.name === 'InboxTab') {
            iconName = focused ? 'mail' : 'mail-outline';
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
        headerShown: false, // Hide headers since each stack handles its own
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStackNavigator} 
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="ScheduleTab" 
        component={ScheduleStackNavigator} 
        options={{
          tabBarLabel: 'Schedule',
        }}
      />
      <Tab.Screen 
        name="ConnectionsTab"
        component={ConnectionsStackNavigator}
        options={{
          tabBarLabel: userType === 'COACH' ? 'Members' : 'Coaches',
          tabBarBadge: hasInboxNotifications ? (inboxNotificationCount > 99 ? '99+' : inboxNotificationCount) : undefined,
        }}
      />
      <Tab.Screen 
        name="InboxTab" 
        component={InboxStackNavigator} 
        options={{
          tabBarLabel: 'Inbox',
          tabBarBadge: hasInboxNotifications ? (inboxNotificationCount > 99 ? '99+' : inboxNotificationCount) : undefined,
        }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStackNavigator} 
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}
