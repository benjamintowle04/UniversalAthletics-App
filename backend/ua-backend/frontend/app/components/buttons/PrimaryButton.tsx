import { TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import React from 'react';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress }) => {
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  return (
    <TouchableOpacity
      className={`
        bg-ua-blue rounded-lg py-4 px-6 w-full
        ${isWeb ? 'hover:bg-blue-700 transition-colors duration-200' : ''}
        ${isWeb && isLargeScreen ? 'py-5 text-lg' : ''}
      `}
      onPress={onPress}
    >
      <Text 
        className={`
          text-white font-bold text-center
          ${isWeb && isLargeScreen ? 'text-lg' : 'text-base'}
        `}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
