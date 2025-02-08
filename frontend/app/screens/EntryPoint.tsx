import { View, Text } from 'react-native'
import React from 'react'
import { RouterProps } from '../types/RouterProps'
import { PrimaryButton } from '../components/button_components/PrimaryButton'


const EntryPoint = ({navigation} : RouterProps) => {

  const moveToLogin = () => {
    navigation.navigate("Login");
    console.log("Moving to Login");
  };

  const moveToSignUp = () => {
    navigation.navigate("SignUp");
    console.log("Moving to Sign Up");
  };


  return (
    <View>
      <Text>Welcome To Universal Athletics!</Text>
      <PrimaryButton title="Login" onPress={moveToLogin} />
      <PrimaryButton title="Sign Up" onPress={moveToSignUp} />
    </View>
  )
}

export default EntryPoint;