import React, { useState, useContext } from "react";
import { FIREBASE_AUTH } from "../../../firebase_config";
import { TextInput, ActivityIndicator, KeyboardAvoidingView, StyleSheet, View, Alert, ScrollView, Dimensions } from "react-native";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { HeaderText } from "../../components/text/HeaderText";
import { LogoImageContainer } from "../../components/image_holders/LogoImageContainer";
import { UserContext } from "../../contexts/UserContext";
import { Platform } from "react-native";
import { Image } from "react-native";
import "../../../global.css"

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const { width, height } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

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
            console.log("Signed Up: ", response);
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

    if (isWeb && isLargeScreen) {
        // Web Desktop Layout
        return (
            <ScrollView 
                className="flex-1 bg-ua-green"
                contentContainerStyle={{ minHeight: height }}
            >
                <View className="flex-1 justify-center items-center p-8">
                    <View className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
                        <View className="items-center mb-8">
                            <Image
                                source={require('../../images/logo.png')}
                                style={{ width: 64, height: 64, marginBottom: 16 }} // Use inline styles instead of className
                                resizeMode="contain"
                            />
                            <HeaderText text="Join UA Today" />
                        </View>


                        <KeyboardAvoidingView behavior="padding">
                            <View className="mb-4">
                                <TextInput 
                                    value={email} 
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    autoCapitalize="none" 
                                    placeholder="Enter Email"
                                    onChangeText={(text) => setEmail(text)}
                                    returnKeyType="next"
                                />
                            </View>

                            <View className="mb-4">
                                <TextInput 
                                    value={firstPassword} 
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    autoCapitalize="none" 
                                    placeholder="Enter Password"
                                    secureTextEntry={true}
                                    textContentType="oneTimeCode"                    
                                    autoComplete="off"  
                                    onChangeText={(text) => setFirstPassword(text)}
                                    returnKeyType="next"
                                    autoCorrect={false}
                                />
                            </View>

                            <View className="mb-6">
                                <TextInput 
                                    value={secondPassword} 
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    autoCapitalize="none" 
                                    placeholder="Confirm Password"
                                    secureTextEntry={true}
                                    textContentType="oneTimeCode"                    
                                    autoComplete="off"    
                                    onChangeText={(text) => setSecondPassword(text)}
                                    returnKeyType="done"
                                    autoCorrect={false}
                                />
                            </View>

                            {loading ? (
                                <View className="py-4">
                                    <ActivityIndicator size="large" color="#7ED957" /> 
                                </View>
                            ) : (
                                <PrimaryButton title="Create Account" onPress={handleSignUp}/>
                            )}
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </ScrollView>
        );
    }

    // Mobile Layout
    return (
        <View className="flex-1 bg-white justify-center items-center px-4">
            <KeyboardAvoidingView behavior="padding" className="w-full max-w-sm">
                <View className="items-center mb-8">
                    <LogoImageContainer />
                    <HeaderText text="Sign Up"/>
                </View>

                <View className="mb-4">
                    <TextInput 
                        value={email} 
                        style={styles.input} 
                        autoCapitalize="none" 
                        placeholder="Enter Email"
                        onChangeText={(text) => setEmail(text)}
                        returnKeyType="next"
                        className="rounded-md border border-gray-300"
                    />
                </View>

                <View className="mb-4">
                    <TextInput 
                        value={firstPassword} 
                        style={styles.input} 
                        autoCapitalize="none" 
                        placeholder="Enter Password"
                        secureTextEntry={true}
                        textContentType="oneTimeCode"                    
                        autoComplete="off"  
                        onChangeText={(text) => setFirstPassword(text)}
                        returnKeyType="next"
                        autoCorrect={false}
                        className="rounded-md border border-gray-300"
                    />
                </View>

                <View className="mb-6">
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
                        className="rounded-md border border-gray-300"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#7ED957" /> 
                ) : (
                    <PrimaryButton title="Create Account" onPress={handleSignUp}/>
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 50,
        padding: 15,
        fontSize: 16,
    },
});

export default SignUp;
