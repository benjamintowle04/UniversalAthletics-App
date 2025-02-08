import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../firebase_config";
import { TextInput } from "react-native";
import { Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { RouterProps } from "../types/RouterProps";
import { Image } from "react-native";
import { Colors } from '../themes/colors/Colors';
import { PrimaryButton } from "../components/button_components/PrimaryButton";
import HeaderText from "../components/text_components/HeaderText";
import LinkButton from "../components/button_components/LinkButton";



const Login = ( { navigation }: RouterProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const moveToSignUp = () => {
        navigation.navigate("SignUp");
        console.log("Moving to Sign Up");
    };

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">

        <Image 
            source={require('../images/logo.png')}
            style={styles.uaLogo}
        />

        <HeaderText text="Login" />

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

        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <>
            <PrimaryButton title="Login" onPress={signIn} />
            <LinkButton title="Create New Account" onPress={moveToSignUp} />
          

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
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },

});

export default Login;