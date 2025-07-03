import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebase_config';
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
  const { userData, hasInboxNotifications, inboxNotificationCount } = useUser();

  const linking = createLinkingConfig();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
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

    // Members go through onboarding if needed n
    if (needsOnboarding) {
      return <OnboardingStackNavigator MainAppNavigator={MainAppNavigator} />;
    } else {
      return <MainAppNavigator />;
    }
  }

  return (
    <NavigationContainer linking={linking}>
      {user ? (   
        <PostLoginLayout />
      ) : (
        <PreLoginStackNavigator />
      )}
    </NavigationContainer>
  );
}
