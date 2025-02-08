import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../firebase_config';
import { RouterProps } from '../types/RouterProps';


const Home = ({ navigation }: RouterProps) => {    
    const auth = FIREBASE_AUTH;

  return (
    <View>
      <Text>Home</Text>
      <Button title='Logout' onPress={() => auth.signOut()} />
    </View>
  )
}

export default Home
