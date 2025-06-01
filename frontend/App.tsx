import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text } from 'react-native';
import UserSettings from './app/screens/settings/UserSettings';
import MyCoaches from './app/screens/coaches/MyCoaches';
import ExploreCoaches from './app/screens/coaches/ExploreCoaches';
import CoachProfile from './app/screens/coaches/CoachProfile';
import InboxHome from './app/screens/inbox/InboxHome';
import { Inbox } from 'lucide-react-native';

// Create placeholder screens for the tab navigator
const ScheduleScreen = () => <Text>Schedule Screen</Text>;
const MerchScreen = () => <Text>Merch Screen</Text>;

const PreLoginStack = createNativeStackNavigator();
const PostLoginStack = createNativeStackNavigator();
const CoachesStack = createNativeStackNavigator();
const InboxStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const backButtonOnlyHeader = {
    headerShown: true,
    title: '',
    headerBackTitle: 'Back'
}

// Header functions that use UserContext
const createInboxHeaderWithBackButton = (hasNotifications: boolean, notificationCount: number, navigation: any) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerRight: () => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('InboxStack')}
      style={{ marginRight: 15, position: 'relative' }}
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
  ),
})

const createInboxHeaderWithoutBackButton = (hasNotifications: boolean, notificationCount: number, navigation: any) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerRight: () => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('InboxStack')}
      style={{ marginRight: 15, position: 'relative' }}
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
  ),
})

function CoachesStackNavigator() {
  const { hasInboxNotifications, inboxNotificationCount } = useUser();
  
  return (
    <CoachesStack.Navigator>
      <CoachesStack.Screen 
        name="MyCoaches" 
        component={MyCoaches} 
        options={({ navigation }) => createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation)}
      />
      <CoachesStack.Screen 
        name="ExploreCoaches" 
        component={ExploreCoaches}
        options={({ navigation }) => createInboxHeaderWithBackButton(hasInboxNotifications, inboxNotificationCount, navigation)}
      />
    </CoachesStack.Navigator>
  );
}

function MainTabNavigator() {
  const { hasInboxNotifications, inboxNotificationCount } = useUser();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ScheduleMonthView') {
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
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation),
          tabBarLabel: 'Home',
        })}
      />
      <Tab.Screen 
        name="ScheduleMonthView" 
        component={ScheduleScreen} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation),
          tabBarLabel: 'Schedule',
        })}
      />
      <Tab.Screen 
        name="Merch" 
        component={MerchScreen} 
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation),
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
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation),
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
    </InboxStack.Navigator>
  );
}

function MainAppNavigator() {
  const { hasInboxNotifications, inboxNotificationCount } = useUser();

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
        name = "CoachProfile"
        component={CoachProfile as React.ComponentType<any>}
        options={({ navigation }) => ({
          ...createInboxHeaderWithoutBackButton(hasInboxNotifications, inboxNotificationCount, navigation),
          tabBarButton: () => null, // Hide this tab button
        })}
        />
    </MainStack.Navigator>
  );
}

// Component uses UserContext - must be inside UserProvider
function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState(false);
  const { userData, hasInboxNotifications, inboxNotificationCount, isLoading } = useUser();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User', user);
      setUser(user);

      if (user?.metadata.creationTime === user?.metadata.lastSignInTime) {
        setNewUser(true);
      } else {
        setNewUser(false);  
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
    if (newUser) {
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
    <NavigationContainer>
      <PostLoginLayout/>
      {/* user ? (   
        <PostLoginLayout />
      ) : (
        <PreLoginLayout/>
      ) */}
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
