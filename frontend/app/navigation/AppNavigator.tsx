import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './NavigationRef';
import { User } from 'firebase/auth';
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
    let unsub: any = undefined;
    let mounted = true;

    // Poll for auth to become available for up to 5s. Some web builds
    // may initialize auth slightly later or throw when called eagerly.
    const waitForAuth = async (timeoutMs = 5000): Promise<any | undefined> => {
      const intervalMs = 200;
      const maxTries = Math.ceil(timeoutMs / intervalMs);
      let tries = 0;
      return new Promise((resolve) => {
        const t = setInterval(() => {
          tries++;
          const auth = getFirebaseAuthSafe();
          if (auth) {
            clearInterval(t);
            resolve(auth);
            return;
          }
          if (tries >= maxTries) {
            clearInterval(t);
            resolve(undefined);
            return;
          }
        }, intervalMs);
      });
    };

    (async () => {
      const auth = await waitForAuth(5000);
      if (!mounted || !auth) {
        // couldn't obtain auth - avoid throwing so app can still render
        console.warn('[DIAG] AppNavigator: auth not available, skipping onAuthStateChanged subscription');
        return;
      }

      // Require the auth helper at runtime to avoid import-time issues in some bundles
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const authMod = require('firebase/auth');
      const onAuthStateChanged = authMod.onAuthStateChanged;

      unsub = onAuthStateChanged(auth, async (user: any) => {
        console.log('User', user);
        setUser(user);

      if (user) {
        // Check if user has tempPassword (mid-onboarding) - if so, skip backend fetch
        // The onboarding process will handle setting userData after backend creation
        const isOnboarding = (userData && (userData as any).tempPassword) || 
                            (typeof window !== 'undefined' && window.sessionStorage?.getItem('onboarding_in_progress') === 'true');
        if (isOnboarding) {
          console.log('User is mid-onboarding, skipping backend fetch');
          setUserType('MEMBER');
          setNeedsOnboarding(true);
          return;
        }

        try {
          // First try to fetch as member
          let memberData = null;
          let coachData = null;

          try {
            memberData = await getMemberByFirebaseId(user.uid);
            if (memberData && memberData.firstName) {
              setUserType('MEMBER');
              // Check if profile is complete (has required fields filled)
              const isProfileComplete = memberData.firstName && 
                                       memberData.lastName && 
                                       memberData.phone && 
                                       memberData.location && 
                                       memberData.skills && 
                                       memberData.skills.length > 0;
              setNeedsOnboarding(!isProfileComplete);
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
    })();

    return () => {
      mounted = false;
      try {
        if (typeof unsub === 'function') unsub();
      } catch (e) {}
    };
  }, []);

  // Watch for userData changes and update needsOnboarding accordingly
  useEffect(() => {
    // If userData is set with a firebaseId and no tempPassword, user has completed onboarding
    if (userData && userData.firebaseId && !(userData as any).tempPassword) {
      console.log('UserData updated with firebaseId, setting needsOnboarding to false');
      setNeedsOnboarding(false);
      // Set userType from userData if available
      if (userData.userType) {
        setUserType(userData.userType.toUpperCase() as 'MEMBER' | 'COACH');
      }
    }
  }, [userData]);

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
