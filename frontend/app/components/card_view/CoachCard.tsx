import { View, Text, Image } from 'react-native'
import React from 'react'
import "../../../global.css"


interface CoachCardProps {
  imageUrl?: string;
  firstName: string;
  lastName: string;
  location: string | undefined;
  skills?: Array<{
    skill_id: string;
    title: string;
    icon: React.ReactNode;
  }>;
}

export const CoachCard = ({ imageUrl, firstName, lastName,  location, skills = []}: CoachCardProps) => {
  // Default image path
  const defaultImage = require('../../images/logo.png');
  const name = firstName + " " + lastName;
  console.log("profile url: " + imageUrl)
  let url = "";

  return (
    <View className="bg-white rounded-lg shadow-md p-4 m-2 flex flex-col items-center">
      {/* Circular Image */}
      <View className="w-24 h-24 rounded-full overflow-hidden mb-3 border-solid bg-gray-100 justify-center items-center">
        <Image 
          source={imageUrl ? { uri: imageUrl } : defaultImage} 
          className="w-24 h-24" 
          resizeMode="cover"
        />
      </View>
      
      {/* Header - Coach Name */}
      <Text className="text-lg font-bold text-center">{name}</Text>
      
      {/* Subheader - Coach Location */}
      <Text className="text-sm text-gray-600 mb-3 text-center">{location}</Text>
      
      {/* Icons Container */}
      <View className="flex flex-row flex-wrap justify-center mt-2">
        {skills.slice(0, 8).map((skill) => (
          <View key={skill.skill_id} className="m-1">
            {skill.icon}
          </View>
        ))}
      </View>
    </View>
  )
}

