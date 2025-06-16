import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import React, { useState, useContext } from "react";
import { FIREBASE_AUTH } from "../../../firebase_config";
import { TextInput, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RouterProps } from "../../types/RouterProps";
import { Image } from "react-native";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { HeaderText } from "../../components/text/HeaderText";
import { UserContext } from "../../contexts/UserContext";
import { Platform } from "react-native";
import "../../../global.css"

const Login = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const { width, height } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    const userContext = useContext(UserContext);
    if (!userContext) {
        Alert.alert("Error Fetching User Context");
        return null;
    }
    
    const { userData, setUserData } = userContext;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in: ", response);
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isWeb && isLargeScreen) {
        // Web Desktop Layout
        return (
            <ScrollView 
                className="flex-1 bg-ua-blue"
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
                            <HeaderText text="Welcome Back" />
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

                            <View className="mb-6">
                                <TextInput 
                                    value={password} 
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    autoCapitalize="none" 
                                    placeholder="Enter Password"
                                    secureTextEntry={true}
                                    onChangeText={(text) => setPassword(text)}
                                    returnKeyType="done"
                                />
                            </View>

                            {loading ? (
                                <View className="py-4">
                                    <ActivityIndicator size="large" color="#38B6FF" /> 
                                </View>
                            ) : (
                                <PrimaryButton title="Login" onPress={signIn} />
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
                    <Image
                        source={require('../../images/logo.png')}
                        className="w-32 h-32 mb-4"
                        resizeMode="contain"
                    />
                    <HeaderText text="Login" />
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

                <View className="mb-6">
                    <TextInput 
                        value={password} 
                        style={styles.input} 
                        autoCapitalize="none" 
                        placeholder="Enter Password"
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        returnKeyType="done"
                        className="rounded-md border border-gray-300"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#38B6FF" /> 
                ) : (
                    <PrimaryButton title="Login" onPress={signIn} />
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

export default Login;
