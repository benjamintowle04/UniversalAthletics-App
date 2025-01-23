import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../themes/colors/Colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
}

export const PrimaryButton = ({ title, onPress }: ButtonProps) => {
    return (
        <TouchableOpacity style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        alignSelf: 'center',
        width: '100%',
        paddingTop: 20
    },
    button: {
        backgroundColor: Colors.uaBlue,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 5,
        width: '80%', // This controls button width relative to container
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
