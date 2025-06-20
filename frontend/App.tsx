import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase_config';  
import Login from './app/screens/pre_login/Login';
import SignUp from './app/screens/pre_login/SignUp';
import EntryPoint from './app/screens/pre_login/EntryPoint';
import Home from './app/screens/home/Home';
import GenInfo from './app/screens/onboarding/GenInfo';
import EnterSkills from './app/screens/onboarding/EnterSkills';
import { UserProvider, useUser } from './app/contexts/UserContext';
import AccountSummary from './app/screens/onboarding/AccountSummary';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import UserSettings from './app/screens/settings/UserSettings';
import MyCoaches from './app/screens/coaches/MyCoaches';
import ExploreCoaches from './app/screens/coaches/ExploreCoaches';
import CoachProfile from './app/screens/coaches/CoachProfile';
import InboxHome from './app/screens/inbox/InboxHome';
import SentRequests from './app/screens/inbox/SentRequests';
import SessionRequestDetails from './app/screens/sessions/SessionRequestDetails';
import RequestASession from './app/screens/sessions/RequestASession';
import ScheduleContainer from './app/screens/schedule/ScheduleContainer';
import SessionDetails from './app/screens/sessions/SessionDetails';
import { Image } from 'react-native';
import ChatScreen from './app/screens/inbox/messaging/ChatScreen';
import { getMemberByFirebaseId } from './controllers/MemberInfoController';

// Web-specific imports
let linking = {};
if (Platform.OS === 'web') {
  linking = {
    prefixes: ['http://localhost:8081', 'https://yourdomain.com'], // Add your actual domain
    config: {
      screens: {
        // Pre-login screens
        EntryPoint: '',
        Login: '/login',
        SignUp: '/signup',
        
        // Onboarding screens
        GenInfo: '/onboarding/general-info',
        EnterSkills: '/onboarding/skills',
        AccountSummary: '/onboarding/summary',
        
        // Main app screens
        Home: '/home',
        MainTabs: {
          screens: {
            HomeTab: '/home',
            ScheduleContainer: '/schedule',
            Merch: '/merch',
            MyCoaches: '/coaches',
            Profile: '/settings',
          },
        },
        
        // Modal/Detail screens
        InboxStack: {
          screens: {
            Inbox: '/inbox',
            SentRequests: '/inbox/sent',
          },
        },
        CoachProfile: '/coach/:coachId',
        SessionRequestDetails: '/session-request/:requestId',
        RequestASession: '/request-session/:recipientId',
        SessionDetails: '/session/:sessionId',
        ChatScreen: '/chat/:conversationId',
      },
    },
  };
}

// Create placeholder screens for the tab navigator
const MerchScreen = () => <Text>Merch Screen</Text>;

const PreLoginStack = createNativeStackNavigator();
const PostLoginStack = createNativeStackNavigator();
const CoachesStack = createNativeStackNavigator();
const InboxStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HeaderLogo = () => (
  <Image 
    source={require('./app/images/logo.png')} 
    style={{ width: 54, height: 54, marginLeft: 18 }}
    resizeMode="contain"
  />
);

const backButtonOnlyHeader = {
    headerShown: true,
    title: '',
    headerBackTitle: 'Back'
}

const createInboxHeaderWithBackButton = (hasNotifications: boolean, notificationCount: number, hasSentNotifications: boolean, sentNotificationCount: number, navigation: any) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerBackTitleVisible: false,
  headerBackVisible: true,
  headerLeft: () => <HeaderLogo />,
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
      {/* Sent icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('InboxStack', { screen: 'SentRequests', params: { tab: 'sent' } })}
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
      
      {/* Inbox icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('InboxStack')}
        style={{ position: 'relative' }}
      >
        <Ionicons name="mail-outline" size={24} color="blue" />
        {hasNotifications && (
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
              {notificationCount > 99 ? '99+' : notificationCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  ),
})

const createInboxHeaderWithoutBackButton = (hasNotifications: boolean, notificationCount: number, hasSentNotifications: boolean, sentNotificationCount: number, navigation: any) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerBackTitleVisible: false,
  headerBackVisible: false,
  headerLeft: () => <HeaderLogo />,
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
      {/* Sent icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('InboxStack', { screen: 'SentRequests', params: { tab: 'sent' } })}
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
      
      {/* Inbox icon */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('InboxStack')}
        style={{ position: 'relative' }}
      >
        <Ionicons name="mail-outline" size={24} color="blue" />
        {hasNotifications && (
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
              {notificationCount > 99 ? '99+' : notificationCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  ),
})

function CoachesStackNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount} = useUser();

  
  return (
    <CoachesStack.Navigator>
      <CoachesStack.Screen 
        name="MyCoaches" 
        component={MyCoaches} 
        options={({ navigation }) => createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation)}
      />
      <CoachesStack.Screen 
        name="ExploreCoaches" 
        component={ExploreCoaches}
        options={({ navigation }) => createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation)}
      />
    </CoachesStack.Navigator>
  );
}

function MainTabNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount } = useUser();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScheduleContainer') {
            iconName = focused ? 'calendar-number' : 'calendar-number-outline';
          } else if (route.name === 'Merch') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'MyCoaches') {
            iconName = focused ? 'people-outline' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -5,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={Home} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarLabel: 'Home',
        })}
      />
      <Tab.Screen 
        name="ScheduleContainer" 
        component={ScheduleContainer} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarLabel: 'Schedule',
        })}
      />
      <Tab.Screen 
        name="Merch" 
        component={MerchScreen} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarLabel: 'Merch',
        })}
      />

      <Tab.Screen 
        name="MyCoaches"
        component={CoachesStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Coaches',
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={UserSettings} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarLabel: 'Settings',
        })}
      />
    </Tab.Navigator>
  );
}

function InboxStackNavigator() {  
  return (
    <InboxStack.Navigator>
      <InboxStack.Screen 
        name="Inbox" 
        component={InboxHome}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Inbox',
          headerBackTitle: 'Back',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 5 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="chevron-back-outline" size={24} color="blue" />
                <Text style={{ color: 'blue', fontSize: 16 }}>Back</Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />

      <InboxStack.Screen 
        name="SentRequests" 
        component={SentRequests}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'SentRequests',
          headerBackTitle: 'Back',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 15, padding: 5 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="chevron-back-outline" size={24} color="blue" />
                <Text style={{ color: 'blue', fontSize: 16 }}>Back</Text>
              </View>
            </TouchableOpacity>
          ),
        })}
      />
    </InboxStack.Navigator>
  );
}
function MainAppNavigator() {
  const { hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount } = useUser();

  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="MainTabs" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      
      <MainStack.Screen 
        name="InboxStack" 
        component={InboxStackNavigator}
        options={{ headerShown: false }}
      />

       <MainStack.Screen
        name="CoachProfile"
        component={CoachProfile as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarButton: () => null, 
        })}
        />

      <MainStack.Screen
        name='SessionRequestDetails'
        component={SessionRequestDetails as React.ComponentType<any>}                                      
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarButton: () => null, 
        })}
      />

      <MainStack.Screen 
        name="RequestASession" 
        component={RequestASession as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarButton: () => null, 
        })}
      />

      <MainStack.Screen
        name="ChatScreen"
        component={ChatScreen as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarButton: () => null, 
        })}
      />

      <MainStack.Screen 
        name="SessionDetails" 
        component={SessionDetails as React.ComponentType<any>} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, hasSentNotifications, sentNotificationCount, navigation),
          tabBarButton: () => null, 
        })}
      />
    </MainStack.Navigator>
  );
}

// Component uses UserContext - must be inside UserProvider
function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const { userData, hasInboxNotifications, inboxNotificationCount, isLoading } = useUser();

  const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      console.log('User', user);
      setUser(user);

      if (user) {
        try {
          // Check if user has completed onboarding by fetching their profile
          const memberData = await getMemberByFirebaseId(user.uid);
          
          // If we can fetch member data successfully, user has completed onboarding
          if (memberData && memberData.firstName) {
            setNeedsOnboarding(false);
          } else {
            setNeedsOnboarding(true);
          }
        } catch (error) {
          console.error('Error checking user onboarding status:', error);
          // If we can't fetch member data, assume they need onboarding
          setNeedsOnboarding(true);
        }
      } else {
        setNeedsOnboarding(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Log inbox notification updates for debugging
  useEffect(() => {
    if (userData) {
      console.log('Inbox notifications updated:', {
        hasNotifications: hasInboxNotifications,
        count: inboxNotificationCount,
        pendingRequests: userData.pendingConnectionRequests?.length || 0,
        isLoadingRequests: userData.isLoadingRequests
      });
    }
  }, [hasInboxNotifications, inboxNotificationCount, userData]);

  function PostLoginLayout() {
    // Show loading while we determine onboarding status
    if (needsOnboarding === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (needsOnboarding) {
      return (
        <PostLoginStack.Navigator initialRouteName='GenInfo'>
          <PostLoginStack.Screen 
            name="GenInfo" 
            component={GenInfo} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="EnterSkills" 
            component={EnterSkills} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="AccountSummary" 
            component={AccountSummary} 
            options={backButtonOnlyHeader}
          />

          <PostLoginStack.Screen 
            name="Home" 
            component={MainAppNavigator} 
            options={{headerShown: false}}
          />
        </PostLoginStack.Navigator>
      );
    }
    else {
      return <MainAppNavigator />;
    }
  }

  function PreLoginLayout() {
    return (
      <PreLoginStack.Navigator initialRouteName='EntryPoint'>
        <PreLoginStack.Screen 
          name="EntryPoint" 
          component={EntryPoint} 
          options={{ headerShown: false }}
        />
        <PreLoginStack.Screen 
          name="Login" 
          component={Login}
          options={backButtonOnlyHeader}
        />
        <PreLoginStack.Screen 
          name="SignUp" 
          component={SignUp} 
          options={backButtonOnlyHeader}
        />
      </PreLoginStack.Navigator>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {user ? (   
        <PostLoginLayout />
      ) : (
        <PreLoginLayout/>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}


