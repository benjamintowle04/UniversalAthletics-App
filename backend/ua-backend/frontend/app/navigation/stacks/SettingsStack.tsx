import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton } from '../headers/HeaderOptions';
import UserSettings from '../../screens/settings/UserSettings';
import GuestGate from '../../components/navigation/GuestGate';
import SkillsManagement from '../../screens/settings/SkillsManagement';
import EntryPoint from '../../screens/pre_login/EntryPoint';

const Stack = createNativeStackNavigator();

export const SettingsStackNavigator = React.forwardRef<any, any>((props, ref) => {
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
          routes: [{ name: 'UserSettings' }],
        });
      }
    },
  }));

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="UserSettings" 
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
            ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
          };
        }}
      >
        {(props) => (
          <GuestGate>
            <UserSettings {...props} />
          </GuestGate>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="SkillsManagement" 
        component={SkillsManagement} 
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
            ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
          };
        }}
      />
      <Stack.Screen
        name="EntryPoint"
        component={EntryPoint as React.ComponentType<any>}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>

    
  );
});

SettingsStackNavigator.displayName = 'SettingsStackNavigator';
