import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { createInboxHeaderWithBackButton } from '../headers/HeaderOptions';
import { HeaderLogo, BackButton } from '../headers/HeaderComponents';

// Screen imports
import InboxHome from '../../screens/inbox/InboxHome';
import GuestGate from '../../components/navigation/GuestGate';
import SentRequests from '../../screens/inbox/SentRequests';
import ChatScreen from '../../screens/inbox/messaging/ChatScreen';
import SessionRequestDetails from '../../screens/sessions/SessionRequestDetails';
import ConnectionProfile from '../../screens/connections/ConnectionProfile';
import RequestASession from '../../screens/sessions/RequestASession';
import EntryPoint from '../../screens/pre_login/EntryPoint';

const Stack = createNativeStackNavigator();

export const InboxStackNavigator = React.forwardRef<any, any>((props, ref) => {
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
          routes: [{ name: 'Inbox' }],
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
        name="Inbox" 
        options={({ navigation }) => {
          // Store navigation reference for the root screen
          navigationRef.current = navigation;
          return {
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
                <TouchableOpacity 
                  onPress={() => navigation.navigate('InboxTab')}
                  style={{ marginRight: 15, position: 'relative' }}
                >
                  <Ionicons name="mail-outline" size={24} color="blue" />
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
                        {inboxNotificationCount > 99 ? '99+' : inboxNotificationCount.toString()}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ),
          };
        }}
      >
        {(props) => (
          <GuestGate>
            <InboxHome {...props} />
          </GuestGate>
        )}
      </Stack.Screen>
      <Stack.Screen 
        name="SentRequests" 
        component={SentRequests}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Sent Requests',
          headerBackTitle: 'Back',
          headerLeft: () => <HeaderLogo />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
              
              <TouchableOpacity 
                  onPress={() => navigation.navigate('SentRequestsTab')}
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
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Inbox')}
                  style={{ marginRight: 15, position: 'relative' }}
                >
                <Ionicons name="mail-outline" size={24} color="blue" />
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
                      {inboxNotificationCount > 99 ? '99+' : inboxNotificationCount.toString()}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )
        })}
      />

      {/* Expose EntryPoint so pre-login flow can be reached from main app */}
      <Stack.Screen
        name="EntryPoint"
        component={EntryPoint as React.ComponentType<any>}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />

      <Stack.Screen
        name="SessionRequestDetails"
        component={SessionRequestDetails as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton({ ...headerProps, navigation }),
        })}
      />

       <Stack.Screen
        name="ConnectionProfile"
        component={ConnectionProfile as React.ComponentType<any>}
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

InboxStackNavigator.displayName = 'InboxStackNavigator';
