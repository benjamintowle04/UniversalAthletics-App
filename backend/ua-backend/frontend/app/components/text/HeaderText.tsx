import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../../themes/colors/Colors';
import { useFonts } from 'expo-font';

interface HeaderTextProps {
    text: string;
    style?: TextStyle | TextStyle[];
    className?: string; // Add className for NativeWind
}

export const HeaderText = ({ text, style, className }: HeaderTextProps) => {
    const [fontsLoaded] = useFonts({
        Gagalin: require('../../themes/fonts/Gagalin-Regular.otf'),
    });

    // Don't render until fonts are loaded
    if (!fontsLoaded) {
        return null;
    }

    return (
        <Text 
            style={[styles.title, style]} 
            className={className}
        >
            {text}
        </Text>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontFamily: 'Gagalin',
        color: Colors.uaRed,
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
});
