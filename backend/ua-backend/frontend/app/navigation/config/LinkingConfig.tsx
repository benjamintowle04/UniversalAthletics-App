import { Platform } from 'react-native';
import { LinkingOptions, NavigatorScreenParams } from '@react-navigation/native';

// Define parameter lists for each navigator level
export type HomeStackParamList = {
  Home: undefined;
  ConnectionProfile: { connectionId: string };
  SessionRequestDetails: { requestId: string };
  RequestASession: { recipientId: string };
  SessionDetails: { sessionId: string };
  ConnectionChat: { conversationId: string }; // Renamed from ChatScreen
  SendConnectionRequest: undefined;
  ExploreConnections: undefined;
};

export type ScheduleStackParamList = {
  ScheduleContainer: undefined;
};

export type MerchStackParamList = {
  Merch: undefined;
};

export type ConnectionsStackParamList = {
  MyConnections: undefined;
  ExploreConnections: undefined;
  ConnectionProfile: { connectionId: string };
  SendConnectionRequest: undefined;
};

export type SettingsStackParamList = {
  UserSettings: undefined;
};

export type InboxStackParamList = {
  Inbox: undefined;
  SentRequests: undefined;
  InboxChat: { conversationId: string }; // Renamed from ChatScreen
};

export type MainTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  ScheduleStack: NavigatorScreenParams<ScheduleStackParamList>;
  MerchStack: NavigatorScreenParams<MerchStackParamList>;
  ConnectionsStack: NavigatorScreenParams<ConnectionsStackParamList>;
  SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
  InboxStack: NavigatorScreenParams<InboxStackParamList>;
};

export type RootStackParamList = {
  // Pre-login screens
  EntryPoint: undefined;
  Login: undefined;
  SignUp: undefined;
  
  // Onboarding screens
  GenInfo: undefined;
  EnterSkills: undefined;
  AccountSummary: undefined;
  
  // Main app screens with tabs
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

export const createLinkingConfig = (): LinkingOptions<RootStackParamList> => {
  if (Platform.OS !== 'web') {
    return {
      prefixes: ['myapp://', 'https://myapp.com'],
    };
  }

  return {
    prefixes: ['http://localhost:8081', 'https://yourdomain.com'], 
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
        
        // Main app screens with tabs
        MainTabs: {
          screens: {
            HomeStack: {
              screens: {
                Home: '/home',
                ConnectionProfile: '/home/connection/:connectionId', 
                SessionRequestDetails: '/home/session-request/:requestId',  
                RequestASession: '/home/request-session/:recipientId',  
                SessionDetails: '/home/session/:sessionId',  
                ConnectionChat: '/home/chat/:conversationId', 
                SendConnectionRequest: '/home/send-connection-request',  
                ExploreConnections: '/home/explore-connections',  
              },
            },
            ScheduleStack: {
              screens: {
                ScheduleContainer: '/schedule',
              },
            },
            MerchStack: {
              screens: {
                Merch: '/merch',
              },
            },
            ConnectionsStack: {
              screens: {
                MyConnections: '/connections',
                ExploreConnections: '/connections/explore', 
                ConnectionProfile: '/connections/profile/:connectionId', 
                SendConnectionRequest: '/connections/send-request',
              },
            },
            SettingsStack: {
              screens: {
                UserSettings: '/settings',
              },
            },
            InboxStack: {
              screens: {
                Inbox: '/inbox',
                SentRequests: '/inbox/sent',
                InboxChat: '/inbox/chat/:conversationId', 
              },
            },
          },
        },
      },
    },
  };
};
