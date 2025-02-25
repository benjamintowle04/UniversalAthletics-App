import { View, Image } from 'react-native'
import React from 'react'
import "../../../global.css"

export const LogoImageContainer = () => {
  return (
    <View>
        <Image
            source={require('../../images/logo.png')}
            className="w-32 h-32"
            resizeMode="contain"
        />    
    </View>
  )
}
