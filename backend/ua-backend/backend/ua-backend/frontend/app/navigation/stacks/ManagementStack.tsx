import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithoutBackButton } from '../headers/HeaderOptions';
import ManagementLogin from '../../screens/management/ManagementLogin';


const Stack = createNativeStackNavigator();

export const ManagementStackNavigator = React.forwardRef<any, any>((props, ref) => {
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
          routes: [{ name: 'ManagementHome' }],
        });
      }
    },
  }));

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ManagementLogin" 
        component={ManagementLogin} 
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
            ...createInboxHeaderWithoutBackButton({ ...headerProps, navigation }),
          };
        }}
      />
      
    </Stack.Navigator>

    
  );
});

ManagementStackNavigator.displayName = 'ManagementStackNavigator';
