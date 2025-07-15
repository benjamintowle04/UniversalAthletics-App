import React from 'react';
import { View } from 'react-native';
import { HeaderLogo, NotificationIcon, BackButton } from './HeaderComponents';


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
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
      <NotificationIcon
        iconName="send-outline"
        onPress={() => navigation.navigate('SentRequestsTab')}
        hasNotifications={hasSentNotifications}
        notificationCount={sentNotificationCount}
        marginRight={15}
      />
      <NotificationIcon
        iconName="mail-outline"
        onPress={() => navigation.navigate('InboxTab')}
        hasNotifications={hasNotifications}
        notificationCount={notificationCount}
      />
    </View>
  ),
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
  headerRight: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
      <NotificationIcon
        iconName="send-outline"
        onPress={() => navigation.navigate('SentRequestsTab')}
        hasNotifications={hasSentNotifications}
        notificationCount={sentNotificationCount}
        marginRight={15}
      />
      <NotificationIcon
        iconName="mail-outline"
        onPress={() => navigation.navigate('InboxTab')}
        hasNotifications={hasNotifications}
        notificationCount={notificationCount}
      />
    </View>
  ),
});

export const backButtonOnlyHeader = {
  headerShown: true,
  title: '',
  headerBackTitle: 'Back'
};
