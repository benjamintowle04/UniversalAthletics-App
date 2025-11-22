import React from 'react';
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HeaderLogo = () => {
  const isWeb = Platform.OS === 'web';
  const webStyle = { width: 54, height: 54, marginLeft: 18 };
  const mobileStyle = { width: 40, height: 40, marginLeft: 12 };

  return (
    <Image
      source={require('../../images/logo.png')}
      style={isWeb ? webStyle : mobileStyle}
      resizeMode="contain"
    />
  );
};

interface NotificationIconProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  hasNotifications: boolean;
  notificationCount: number;
  marginRight?: number;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({
  iconName,
  onPress,
  hasNotifications,
  notificationCount,
  marginRight = 0
}) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{ marginRight, position: 'relative' }}
  >
    <Ionicons name={iconName} size={24} color="blue" />
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
);

interface BackButtonProps {
  onPress: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{ marginLeft: 15, padding: 5 }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name="chevron-back-outline" size={24} color="blue" />
      <Text style={{ color: 'blue', fontSize: 16 }}>Back</Text>
    </View>
  </TouchableOpacity>
);
