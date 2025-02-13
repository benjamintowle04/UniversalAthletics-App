import { View, Text, Image } from 'react-native';
import React from 'react';
import { RouterProps } from '../types/RouterProps';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { Colors } from '../themes/colors/Colors';
import { LinkButton } from '../components/buttons/LinkButton';
import { HeaderText } from '../components/text/HeaderText';
import "../../global.css";


const EntryPoint = ({ navigation }: RouterProps) => {

  const moveToLogin = () => {
    navigation.navigate("Login");
    console.log("Moving to Login");
  };

  const moveToSignUp = () => {
    navigation.navigate("SignUp");
    console.log("Moving to Sign Up");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require('../images/logo.png')}
        className="w-48 h-48 "
        resizeMode="contain"
      />
      <HeaderText text='Welcome to UA' />

      <View>
        <PrimaryButton title="Login" onPress={moveToLogin} />
        <PrimaryButton title="Sign Up" onPress={moveToSignUp} />
      </View>
    </View>
  );
};

  

export default EntryPoint;