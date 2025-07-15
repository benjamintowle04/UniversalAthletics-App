import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton, createInboxHeaderWithBackButton } from '../headers/HeaderOptions';

// Screen imports
import MyConnections from '../../screens/connections/MyConnections';
import ExploreConnections from '../../screens/connections/ExploreConnections';
import ConnectionProfile from '../../screens/connections/ConnectionProfile';
import SendConnectionRequest from '../../screens/connections/SendConnectionRequest';
import ChatScreen from '../../screens/inbox/messaging/ChatScreen';
import RequestASession from '../../screens/sessions/RequestASession';

const Stack = createNativeStackNavigator();

export const ConnectionsStackNavigator = React.forwardRef<any, any>((props, ref) => {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount } = useUser();
  const navigationRef = React.useRef<any>(null);

  const headerProps = {
    hasNotifications: hasInboxNotifications,
    notificationCount: inboxNotificationCount,
    hasSentNotifications,
    sentNotificationCount,
  };

  // Expose navigation methods to parent
  React.useImperativeHandle(ref, () => ({
    resetToRoot: () => {
      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'MyConnections' }],
        });
      }
    },
  }));

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
      initialRouteName="MyConnections"
    >
      <Stack.Screen 
        name="MyConnections"
        component={MyConnections}
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
            ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
          };
        }}
      />

      <Stack.Screen 
        name="ExploreConnections" 
        component={ExploreConnections as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
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
        name="SendConnectionRequest" 
        component={SendConnectionRequest as React.ComponentType<any>} 
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
        name="RequestASession"
        component={RequestASession as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
});

ConnectionsStackNavigator.displayName = 'ConnectionsStackNavigator';
