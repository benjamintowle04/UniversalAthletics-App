import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { HeaderLogo, NotificationIcon, BackButton } from './HeaderComponents';
import { Ionicons } from '@expo/vector-icons';


interface HeaderNotificationProps {
  hasNotifications: boolean;
  notificationCount: number;
  hasSentNotifications: boolean;
  sentNotificationCount: number;
  navigation: any;
}

export const createInboxHeaderWithBackButton = ({
  hasNotifications,
  notificationCount,
  hasSentNotifications,
  sentNotificationCount,
  navigation
}: HeaderNotificationProps) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerBackTitleVisible: true,
  headerBackVisible: true,
  headerLeft: () => <HeaderLogo />,
  // Removed inbox and sent icons per simplified UI requirement
  headerRight: () => null,
});

export const createInboxHeaderWithoutBackButton = ({
  hasNotifications,
  notificationCount,
  hasSentNotifications,
  sentNotificationCount,
  navigation
}: HeaderNotificationProps) => ({
  headerShown: true,
  title: '',
  headerBackTitle: 'Back',
  headerBackTitleVisible: false,
  headerBackVisible: false,
  headerLeft: () => <HeaderLogo />,
  // Removed inbox and sent icons per simplified UI requirement
  headerRight: () => null,
});

export const backButtonOnlyHeader = {
  headerShown: true,
  title: '',
  headerBackTitle: 'Back'
};
