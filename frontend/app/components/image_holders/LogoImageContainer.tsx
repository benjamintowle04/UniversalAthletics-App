import { View, Image, Platform, Dimensions } from 'react-native';
import React from 'react';

export const LogoImageContainer = () => {
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  return (
    <View className="items-center mb-8">
      <Image 
        source={require('../../images/logo.png')}
        className={`
          ${isWeb && isLargeScreen ? 'w-32 h-32' : 'w-24 h-24'}
        `}
        resizeMode="contain"
      />
    </View>
  );
};
