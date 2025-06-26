import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton } from '../headers/HeaderOptions';
import ScheduleContainer from '../../screens/schedule/ScheduleContainer';

const Stack = createNativeStackNavigator();

export function ScheduleStackNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount } = useUser();

  const headerProps = {
    hasNotifications: hasInboxNotifications,
    notificationCount: inboxNotificationCount,
    hasSentNotifications,
    sentNotificationCount,
  };

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ScheduleContainer" 
        component={ScheduleContainer} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
}
