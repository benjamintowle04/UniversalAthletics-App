import React from 'react';
import { View, Text } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetRootToPreLoginWithRetry } from '../../navigation/NavigationRef';

// Note: This file provides a small gate that prompts guest users to login before accessing protected content.

const GuestGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isGuest, endGuestSession } = useUser();
  const navigation = useNavigation();
  const route = useRoute();

  // Map route names to distinct messages/icons so each blocked tab looks different
  const routeKey = route?.name || 'default';
  let header = 'Please log in to access this section';
  let description = 'To use this feature you need an account. You can sign up or log in to continue.';
  let icon = '🔒';
  let accentColor = '#374151'; // default gray

  switch (routeKey) {
    case 'ScheduleContainer':
    case 'ScheduleTab':
      header = 'Schedule';
      description = 'Sign in to view and book training sessions.';
      icon = '📅';
      accentColor = '#0ea5e9'; // sky-500
      break;
    case 'MyConnections':
    case 'ConnectionsTab':
      header = 'Connections';
      description = 'Sign in to connect with coaches and members near you.';
      icon = '🤝';
      accentColor = '#10b981'; // green-500
      break;
    case 'UserSettings':
    case 'SettingsTab':
      header = 'Settings';
      description = 'Sign in to manage your account, skills, and preferences.';
      icon = '⚙️';
      accentColor = '#8b5cf6'; // purple-500
      break;
    case 'Inbox':
    case 'InboxTab':
      header = 'Inbox';
      description = 'Sign in to view messages and requests.';
      icon = '✉️';
      accentColor = '#ef4444'; // red-500
      break;
    case 'SentRequests':
    case 'SentRequestsTab':
      header = 'Sent Requests';
      description = 'Sign in to view and manage requests you have sent.';
      icon = '📤';
      accentColor = '#f59e0b'; // amber-500
      break;
    default:
      header = 'Please log in to access this section';
      description = 'To use this feature you need an account. You can sign up or log in to continue.';
      icon = '🔒';
  }

  if (!isGuest) return <>{children}</>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
  <Text style={{ fontSize: 42, marginBottom: 8, color: accentColor }}>{icon}</Text>
  <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8, color: accentColor }}>{header}</Text>
      <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20, maxWidth: 420 }}>
        {description}
      </Text>
          <View style={{ width: 240 }}>
            <PrimaryButton
              title="Login / Sign Up"
              onPress={() => {
                // End the guest session and reset root to the EntryPoint of the pre-login flow
                endGuestSession();
                // Use the reset helper to make EntryPoint the root route; retry if the navigationRef is not ready.
                resetRootToPreLoginWithRetry().catch((err) => {
                  console.warn('Failed to reset root to PreLogin:', err);
                  // As a fallback, try a normal navigate in case the reset failed
                  try {
                    (navigation as any).navigate('EntryPoint');
                  } catch (e) {
                    console.warn('Fallback navigate to EntryPoint failed:', e);
                  }
                });
              }}
            />
          </View>
    </View>
  );
};

export default GuestGate;
