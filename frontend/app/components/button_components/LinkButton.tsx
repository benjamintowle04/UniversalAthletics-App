import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { Colors } from '../../themes/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const LinkButton = ({ title, onPress }: ButtonProps) => {
  return (
   <TouchableOpacity style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 5,
        width: '80%', // This controls button width relative to container
    },
    buttonText: {
        color: Colors.uaBlue,
        fontSize: 14,
        fontWeight: 'light',
    },
});

export default LinkButton
