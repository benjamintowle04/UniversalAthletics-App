import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './NavigationRef';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuthSafe } from '../../firebase_config';
import { useUser } from '../contexts/UserContext';
import { getMemberByFirebaseId } from '../../controllers/MemberInfoController';
import { getCoachByFirebaseId } from '../../controllers/CoachController';

import { PreLoginStackNavigator } from './stacks/PreLoginStack';
import { OnboardingStackNavigator } from './stacks/OnboardingStack';
import { MainTabNavigator } from './tabs/MainTabNavigator';

import { createLinkingConfig } from './config/LinkingConfig';

export function AppNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<'MEMBER' | 'COACH' | null>(null);
  const { userData, hasInboxNotifications, inboxNotificationCount, isGuest } = useUser();

  const linking = createLinkingConfig();

  useEffect(() => {
    const auth = getFirebaseAuthSafe();
    if (!auth) {
      console.warn('[DIAG] AppNavigator: auth not ready, skipping auth subscription');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('User', user);
      setUser(user);

      if (user) {
        try {
          // First try to fetch as member
          let memberData = null;
          let coachData = null;

          try {
            memberData = await getMemberByFirebaseId(user.uid);
            if (memberData && memberData.firstName) {
              setUserType('MEMBER');
              setNeedsOnboarding(false);
            }
          } catch (memberError) {
            console.log('Not a member, checking if coach...');
          }

          // If not a member, try to fetch as coach
          if (!memberData) {
            try {
              coachData = await getCoachByFirebaseId(user.uid);
              if (coachData && coachData.firstName) {
                setUserType('COACH');
                setNeedsOnboarding(false);
              }
              
              // For now, assume coaches don't need onboarding since admins create their accounts
              console.log('Coach login detected - implement getCoachByFirebaseId');
              setUserType('COACH');
              setNeedsOnboarding(false);
            } catch (coachError) {
              console.error('Error checking coach status:', coachError);
              // If neither member nor coach, assume they need onboarding as member
              setUserType('MEMBER');
              setNeedsOnboarding(true);
            }
          }
        } catch (error) {
          console.error('Error checking user onboarding status:', error);
          // Default to member needing onboarding
          setUserType('MEMBER');
          setNeedsOnboarding(true);
        }
      } else {
        setNeedsOnboarding(null);
        setUserType(null);
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
        isLoadingRequests: userData.isLoadingRequests,
        userType: userData.userType
      });
    }
  }, [hasInboxNotifications, inboxNotificationCount, userData]);

  const MainAppNavigator = () => <MainTabNavigator />;

  function PostLoginLayout() {
    // Show loading while we determine onboarding status
    // If guest, skip onboarding detection and show main app immediately
    if (isGuest) {
      return <MainAppNavigator />;
    }

    // If user has tempPassword, they're in the middle of signup (before Firebase account creation)
    // Route them to onboarding
    if (userData && (userData as any).tempPassword) {
      return <OnboardingStackNavigator MainAppNavigator={MainAppNavigator} />;
    }

    if (needsOnboarding === null || userType === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }

    // Coaches skip onboarding since admins create their accounts
    if (userType === 'COACH') {
      return <MainAppNavigator />;
    }

    // Members go through onboarding if needed.
    // If we already have userData set in context (onboarding completed), render the main app immediately.
    if (userData && userData.firebaseId) {
      return <MainAppNavigator />;
    }

    if (needsOnboarding) {
      return <OnboardingStackNavigator MainAppNavigator={MainAppNavigator} />;
    }

    return <MainAppNavigator />;
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      {user || isGuest || (userData && (userData as any).tempPassword) ? (
        <PostLoginLayout />
      ) : (
        <PreLoginStackNavigator />
      )}
    </NavigationContainer>
  );
}
