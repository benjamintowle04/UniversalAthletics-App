import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../themes/Colors';
import { useFonts } from 'expo-font';


interface HeaderTextProps {
    text: string;
}

const HeaderText = ({ text }: HeaderTextProps) => {
    const [fontsLoaded] = useFonts({
        Gagalin: require('../../themes/fonts/Gagalin-Regular.otf'),
      });

    return (
        <Text style={styles.title}>{text}</Text>
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

export default HeaderText
