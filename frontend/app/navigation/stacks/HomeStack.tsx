import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton, createInboxHeaderWithBackButton } from '../headers/HeaderOptions';

import Home from '../../screens/home/Home';
import ConnectionProfile from '../../screens/connections/ConnectionProfile';
import RequestASession from '../../screens/sessions/RequestASession';
import ChatScreen from '../../screens/inbox/messaging/ChatScreen';
import SendConnectionRequest from '../../screens/connections/SendConnectionRequest';
import ExploreConnections from '../../screens/connections/ExploreConnections';

const Stack = createNativeStackNavigator();

export const HomeStackNavigator = React.forwardRef<any, any>((props, ref) => {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount } = useUser();

  const headerProps = {
    hasNotifications: hasInboxNotifications,
    notificationCount: inboxNotificationCount,
    hasSentNotifications,
    sentNotificationCount,
  };

  // Expose navigation methods to parent
  React.useImperativeHandle(ref, () => ({
    resetToRoot: () => {
      //handled by the tab navigator
    },
  }));

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
        })}
      />
      <Stack.Screen
        name="ConnectionProfile"
        component={ConnectionProfile as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
          presentation: 'card',
          animationTypeForReplace: 'push',
        })}
      />
      <Stack.Screen 
        name="RequestASession" 
        component={RequestASession as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
      <Stack.Screen 
        name="SendConnectionRequest" 
        component={SendConnectionRequest as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
      <Stack.Screen 
        name="ExploreConnections" 
        component={ExploreConnections as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
});

HomeStackNavigator.displayName = 'HomeStackNavigator';
