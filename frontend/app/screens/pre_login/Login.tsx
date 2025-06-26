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
import { getMemberByFirebaseId } from "../../../controllers/MemberInfoController";
import { getCoachByFirebaseId } from "../../../controllers/CoachController";
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
            
            // After successful Firebase authentication, determine user type and fetch data
            const firebaseUser = response.user;
            
            try {
                // First try to fetch as member
                const memberData = await getMemberByFirebaseId(firebaseUser.uid);
                if (memberData && memberData.firstName) {
                    // User is a member
                    const userData = {
                        id: memberData.id,
                        firstName: memberData.firstName,
                        lastName: memberData.lastName,
                        email: memberData.email,
                        phone: memberData.phone,
                        biography: memberData.biography,
                        profilePic: memberData.profilePic,
                        location: memberData.location,
                        firebaseId: memberData.firebaseId,
                        userType: 'MEMBER' as const,
                        skills: memberData.skills
                    };
                    await setUserData(userData);
                    console.log("Member logged in successfully");
                    return;
                }
            } catch (memberError) {
                console.log("Not a member, checking if coach...");
            }

            // If not a member, try to fetch as coach
            try {
                const coachData = await getCoachByFirebaseId(firebaseUser.uid);
                if (coachData && coachData.firstName) {
                    // User is a coach
                    const userData = {
                        id: coachData.id,
                        firstName: coachData.firstName,
                        lastName: coachData.lastName,
                        email: coachData.email,
                        phone: coachData.phone,
                        biography1: coachData.biography1,
                        biography2: coachData.biography2,
                        profilePic: coachData.profilePic,
                        bioPic1: coachData.bioPic1,
                        bioPic2: coachData.bioPic2,
                        location: coachData.location,
                        firebaseId: coachData.firebaseId,
                        userType: 'COACH' as const,
                        skills: coachData.skills
                    };
                    await setUserData(userData);
                    console.log("Coach logged in successfully");
                    return;
                }
            } catch (coachError) {
                console.error("Error checking coach status:", coachError);
            }

            // If neither member nor coach found
            console.log("User not found in member or coach tables");
            alert("User account not found. Please contact support.");
            
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
                                style={{ width: 64, height: 64, marginBottom: 16 }}
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
