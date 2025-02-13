import { View, Text, Image } from 'react-native'
import React from 'react'
import { RouterProps } from '../types/RouterProps'
import { PrimaryButton } from '../components/button_components/PrimaryButton'
import "../../global.css";


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
      <View className='flex flex-row justify-center bg-gray-500 p-2'>
        <Text className='font-bold'>Universal Athletics</Text>
      </View>

      <Text className=''>Welcome To Universal Athletics!</Text>
      <PrimaryButton title="Login" onPress={moveToLogin} />
      <PrimaryButton title="Sign Up" onPress={moveToSignUp} />
    </View>
  )
}

export default EntryPoint;