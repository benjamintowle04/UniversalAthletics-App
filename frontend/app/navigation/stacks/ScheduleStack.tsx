import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton, createInboxHeaderWithBackButton } from '../headers/HeaderOptions';
import ScheduleContainer from '../../screens/schedule/ScheduleContainer';
import SessionDetails from '../../screens/sessions/SessionDetails';

const Stack = createNativeStackNavigator();

export const ScheduleStackNavigator = React.forwardRef<any, any>((props, ref) => {
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
      // This will be handled by the tab navigator
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
        component={ScheduleContainer} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
        })}
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
