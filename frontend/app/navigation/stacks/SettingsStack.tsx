import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton } from '../headers/HeaderOptions';
import UserSettings from '../../screens/settings/UserSettings';

const Stack = createNativeStackNavigator();

export function SettingsStackNavigator() {
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
        name="UserSettings" 
        component={UserSettings} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
}
