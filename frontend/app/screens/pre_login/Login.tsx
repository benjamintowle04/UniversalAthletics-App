import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { FIREBASE_AUTH } from "../../../firebase_config";
import { TextInput, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RouterProps } from "../../types/RouterProps";
import { Image } from "react-native";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { HeaderText } from "../../components/text/HeaderText";
import { UserContext } from "../../contexts/UserContext";
import "../../../global.css"


const Login = ( { navigation }: RouterProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

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
            console.log(response);
            setUserData({
              ...userData,
              firebaseID: response.user.uid
            });

            console.log("User data after login:", userData);

        
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <Image
            source={require('../../images/logo.png')}
            className="w-48 h-48 "
            resizeMode="contain"
          />

        <HeaderText text="Login" />

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
            value={password} 
            style={styles.input} 
            autoCapitalize="none" 
            placeholder="Enter Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            returnKeyType="done"
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
                <PrimaryButton title="Login" onPress={signIn} />
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
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },

});

export default Login;