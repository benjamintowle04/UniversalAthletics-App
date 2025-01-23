import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { TextInput } from "react-native";
import { Button, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NavigationProp, Router } from "@react-navigation/native";
import { PrimaryButton } from "../components/button_components/PrimaryButton";
import { Colors } from "../themes/Colors";
import HeaderText from "../components/text_components/HeaderText";
import LinkButton from "../components/button_components/LinkButton";

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const SignUp = ({navigation}: RouterProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;


    const signUp = async () => {
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

    const moveToLogin = () => {
        navigation.navigate("Login");
        console.log("Moving to Login");
    };


  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
        <Image 
            source={require('../images/logo.png')}
            style={styles.uaLogo}
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
            value={password} 
            style={styles.input} 
            autoCapitalize="none" 
            placeholder="Enter Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}>
        </TextInput>

        <TextInput 
            value={password} 
            style={styles.input} 
            autoCapitalize="none" 
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}>
        </TextInput>

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <>
            <PrimaryButton title="Create Account" onPress={signUp} />
            <LinkButton title="Login" onPress={moveToLogin}  />
            </>
        )}
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

export default SignUp