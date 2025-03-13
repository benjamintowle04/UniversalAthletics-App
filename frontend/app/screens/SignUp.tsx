import React, { useState, useContext } from "react";
import { FIREBASE_AUTH } from "../../firebase_config";
import { TextInput, ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View, Alert } from "react-native";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { PrimaryButton } from "../components/buttons/PrimaryButton";
import { Colors } from "../themes/colors/Colors";
import { HeaderText } from "../components/text/HeaderText";
import { LogoImageContainer } from "../components/image_holders/LogoImageContainer";
import { UserContext } from "../contexts/UserContext";
import "../../global.css"


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const userContext = useContext(UserContext);
    if (!userContext) {
        Alert.alert("Error Fetching User Data")
        return;
    }
    const { userData, setUserData } = userContext;


    const signUp = async (email: string, password: string) => {  
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);

            setUserData({
                ...userData,
                email: response.user.email,
                firebaseID: response.user.uid
            });
            console.log("User data after sign up:", userData);
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
                <View className="items-center">
                    <LogoImageContainer />
                </View>
                <HeaderText text="Sign Up"/>
                <TextInput 
                    value={email} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Enter Email"
                    onChangeText={(text) => setEmail(text)}
                    returnKeyType="done"
                    className="rounded-md">
                </TextInput>
                <TextInput 
                    value={firstPassword} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Enter Password"
                    secureTextEntry={true}
                    textContentType="oneTimeCode"                    
                    autoComplete="off"  
                    onChangeText={(text) => setFirstPassword(text)}
                    returnKeyType="done"
                    autoCorrect={false}
                    className="rounded-md">
                </TextInput> 
                <TextInput 
                    value={secondPassword} 
                    style={styles.input} 
                    autoCapitalize="none" 
                    placeholder="Confirm Password"
                    secureTextEntry={true}
                    textContentType="oneTimeCode"                    
                    autoComplete="off"    
                    onChangeText={(text) => setSecondPassword(text)}
                    returnKeyType="done"
                    autoCorrect={false}
                    className="rounded-md">
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