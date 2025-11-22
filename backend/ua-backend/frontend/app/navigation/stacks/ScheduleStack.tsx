import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton, createInboxHeaderWithBackButton } from '../headers/HeaderOptions';
import ScheduleContainer from '../../screens/schedule/ScheduleContainer';
import GuestGate from '../../components/navigation/GuestGate';
import SessionDetails from '../../screens/sessions/SessionDetails';
import EntryPoint from '../../screens/pre_login/EntryPoint';

const Stack = createNativeStackNavigator();

export const ScheduleStackNavigator = React.forwardRef<any, any>((props, ref) => {
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
          routes: [{ name: 'ScheduleContainer' }],
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
    >
      <Stack.Screen 
        name="ScheduleContainer" 
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
            ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation })
          };
        }}
      >
        {(props) => (
          <GuestGate>
            <ScheduleContainer {...props} />
          </GuestGate>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="EntryPoint"
        component={EntryPoint as React.ComponentType<any>}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SessionDetails" 
        component={SessionDetails as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
});

ScheduleStackNavigator.displayName = 'ScheduleStackNavigator';
