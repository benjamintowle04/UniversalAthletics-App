import React from 'react';
import { Text, TextProps } from 'react-native';
import { useFonts } from 'expo-font';

/**
 * Simple wrapper that ensures the Gagalin font is loaded and applies
 * fontFamily: 'Gagalin' to its children. Accepts standard Text props.
 */
const GagalinText: React.FC<TextProps> = ({ children, style, ...rest }) => {
  const [fontsLoaded] = useFonts({
    Gagalin: require('../../themes/fonts/Gagalin-Regular.otf'),
  });

  if (!fontsLoaded) return null;

  return (
    <Text style={[{ fontFamily: 'Gagalin' } as any, style]} {...rest}>
      {children}
    </Text>
  );
};

export default GagalinText;
