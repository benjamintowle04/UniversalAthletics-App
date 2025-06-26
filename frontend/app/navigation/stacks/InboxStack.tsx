import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithBackButton } from '../headers/HeaderOptions';
import { HeaderLogo, BackButton } from '../headers/HeaderComponents';

// Screen imports
import InboxHome from '../../screens/inbox/InboxHome';
import SentRequests from '../../screens/inbox/SentRequests';
import ChatScreen from '../../screens/inbox/messaging/ChatScreen';

const Stack = createNativeStackNavigator();

export function InboxStackNavigator() {
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
        name="Inbox" 
        component={InboxHome}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Inbox',
          headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: () => <HeaderLogo />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('SentRequests')}
                style={{ marginRight: 15, position: 'relative' }}
              >
                <Ionicons name="send-outline" size={24} color="blue" />
                {hasSentNotifications && (
                  <View 
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text 
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      {sentNotificationCount > 99 ? '99+' : sentNotificationCount.toString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen 
        name="SentRequests" 
        component={SentRequests}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Sent Requests',
          headerBackTitle: 'Back',
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />
    </Stack.Navigator>
  );
}
