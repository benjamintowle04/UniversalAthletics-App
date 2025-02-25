import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors/Colors';
import { useFonts } from 'expo-font';


interface SmallTextProps {
    text: string;
}

export const SmallText = ({ text }: SmallTextProps) => {
    const [fontsLoaded] = useFonts({
        Gagalin: require('../../themes/fonts/Gagalin-Regular.otf'),
      });

    return (
        <Text style={styles.title}>{text}</Text>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 13,
        fontFamily: 'Gagalin',
        color: Colors.uaGreen,
        textAlign: 'left',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    
});

