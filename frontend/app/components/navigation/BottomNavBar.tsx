import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RouterProps } from '../../types/RouterProps';
import "../../../global.css"

export const BottomNavBar = ({ navigation }: RouterProps) => {
  return (
    <View className="flex-row h-16 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 shadow-lg">
      <TouchableOpacity 
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={24} className="text-gray-700" />
        <Text className="text-xs mt-1 text-gray-600">Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate('ScheduleContainer')}
      >
        <MaterialIcons name="calendar-month" size={24} className="text-gray-700" />
        <Text className="text-xs mt-1 text-gray-600">Schedule</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate('Merch')}
      >
        <Ionicons name="person" size={24} className="text-gray-700" />
        <Text className="text-xs mt-1 text-gray-600">Merch</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate('MyConnections')}
      >
        <Ionicons name="people-outline" size={24} className="text-gray-700" />
        <Text className="text-xs mt-1 text-gray-600">My Connections</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="flex-1 items-center justify-center"
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="settings" size={24} className="text-gray-700" />
        <Text className="text-xs mt-1 text-gray-600">Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

