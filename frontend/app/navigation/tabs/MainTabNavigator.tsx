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
import { SentRequestsStackNavigator } from '../stacks/SentRequestsStack';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, userType } = useUser();
  
  // Create refs for each stack navigator
  const homeStackRef = React.useRef<any>(null);
  const scheduleStackRef = React.useRef<any>(null);
  const connectionsStackRef = React.useRef<any>(null);
  const inboxStackRef = React.useRef<any>(null);
  const settingsStackRef = React.useRef<any>(null);
  const sentRequestsStackRef = React.useRef<any>(null);
  
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
        options={{
          tabBarLabel: 'Home',
        }}
        listeners={{
          tabPress: (e) => {
            homeStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <HomeStackNavigator ref={homeStackRef} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="ScheduleTab" 
        options={{
          tabBarLabel: 'Schedule',
        }}
        listeners={{
          tabPress: (e) => {
            scheduleStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <ScheduleStackNavigator ref={scheduleStackRef} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="ConnectionsTab"
        options={{
          tabBarLabel: userType === 'COACH' ? 'Members' : 'Coaches'
        }}
        listeners={{
          tabPress: (e) => {
            connectionsStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <ConnectionsStackNavigator ref={connectionsStackRef} />}
      </Tab.Screen>

      <Tab.Screen 
        name="InboxTab"
        options={{
          tabBarLabel: 'Inbox',
          tabBarItemStyle: { display: 'none' },
        }}
        listeners={{
          tabPress: (e) => {
            // Force reset even if not focused since this tab is hidden
            inboxStackRef.current?.resetToRoot();
          },
          focus: (e) => {
            // Also reset when the tab gains focus programmatically
            inboxStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <InboxStackNavigator ref={inboxStackRef} />}
      </Tab.Screen>

      <Tab.Screen 
        name="SentRequestsTab"
        options={{
          tabBarLabel: 'Sent',
          tabBarItemStyle: { display: 'none' },
        }}
        listeners={{
          tabPress: (e) => {
            // Force reset even if not focused since this tab is hidden
            sentRequestsStackRef.current?.resetToRoot();
          },
          focus: (e) => {
            // Also reset when the tab gains focus programmatically
            sentRequestsStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <InboxStackNavigator ref={sentRequestsStackRef} />}
      </Tab.Screen>

      <Tab.Screen 
        name="SettingsTab" 
        options={{
          tabBarLabel: 'Settings',
        }}
        listeners={{
          tabPress: (e) => {
            settingsStackRef.current?.resetToRoot();
          },
        }}
      >
        {() => <SettingsStackNavigator ref={settingsStackRef} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
