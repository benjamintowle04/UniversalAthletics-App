import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../firebase_config";
import { TextInput } from "react-native";
import { Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Colors } from "../themes/colors/Colors";
import {HeaderText} from "../components/text/HeaderText";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async (email: string, password: string) => {  
        console.log("ASYNC Email: " + email);
        console.log("ASYNC Password: " + password);
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            alert("Sign up failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isPasswordStrong = (password: string) => {
        const minLength = 6;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
    };

    const handleSignUp = () => {
        console.log("First Password: " + firstPassword);
        console.log("Second Password: " + secondPassword);

        if (firstPassword !== secondPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!isPasswordStrong(firstPassword)) {
            alert("Password must be at least 6 characters long, contain at least one letter, one number, and one special character.");
            return;
        }

        signUp(email, firstPassword);
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Image
                    source={require('../images/logo.png')}
                    className="w-48 h-48 "
                    resizeMode="contain"
                />
                <HeaderText text="Sign Up"/>
                <TextInput 
                    value={email} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Enter Email"
                    onChangeText={(text) => setEmail(text)}>
                </TextInput>
                <TextInput 
                    value={firstPassword} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Enter Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setFirstPassword(text)}>
                </TextInput> 
                <TextInput 
                    value={secondPassword} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    onChangeText={(text) => setSecondPassword(text)}>
                </TextInput>
                {
                    loading ? 
                    (
                        <ActivityIndicator size="large" color="#0000ff" /> 
                    ) 
                    : 
                    (
                        <>
                            <PrimaryButton title="Create Account" onPress={handleSignUp}/>
                        </>
                    )
                }
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    uaLogo: {
        alignSelf: 'center',
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    }, 
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.uaRed,
        textAlign: 'center',
        marginBottom: 20,
    }
});

export default SignUp;