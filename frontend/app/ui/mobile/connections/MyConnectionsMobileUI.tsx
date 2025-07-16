import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { CoachCard } from '../../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../../utils/IconLibrary'
import { Ionicons } from '@expo/vector-icons'
import { HeaderText } from '../../../components/text/HeaderText'
import "../../../../global.css"

interface Connection {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePic?: string;
  skills: Array<{skill_id: number, title: string}>;
  userType: 'COACH' | 'MEMBER'; 
}

interface UserSpecificData {
  headerTitle: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  exploreButtonText: string;
  exploreNavigation: string;
  searchPlaceholder: string;
  connectionType: 'members' | 'coaches';
}

interface UserData {
  userType: 'COACH' | 'MEMBER';
  id: string;
  firstName: string;
  lastName: string;
}

interface MyConnectionsMobileUIProps {
  connections: Connection[];
  filteredConnections: Connection[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  userSpecificData: UserSpecificData | null;
  userData: UserData | null;
  onConnectionPress: (connection: Connection) => void;
  onExplorePress: () => void;
  onMessagePress: (connection: Connection) => void;
}

const MyConnectionsMobileUI = ({
  connections,
  filteredConnections,
  searchQuery,
  setSearchQuery,
  isLoading,
  userSpecificData,
  userData,
  onConnectionPress,
  onExplorePress,
  onMessagePress
}: MyConnectionsMobileUIProps) => {

  const renderEmptyState = () => {
    if (!userSpecificData) return null;

    return (
      <View className="flex-1 items-center justify-center px-8">
        <Ionicons name="people-outline" size={80} color="#ccc" />
        <Text className="text-xl font-semibold text-gray-700 mt-4 text-center">
          {userSpecificData.emptyStateTitle}
        </Text>
        <Text className="text-base text-gray-500 mt-2 text-center leading-6">
          {userSpecificData.emptyStateDescription}
        </Text>
        <TouchableOpacity 
          className="bg-blue-500 px-6 py-3 rounded-full mt-6 flex-row items-center"
          onPress={onExplorePress}
        >
          <Ionicons 
            name={userData?.userType === 'COACH' ? "settings" : "compass"} 
            size={20} 
            color="white" 
          />
          <Text className="text-white font-semibold ml-2">
            {userSpecificData.exploreButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderConnectionCard = (connection: Connection) => {
    //Debug log
    console.log('Raw skills data:', connection.skills);
    console.log('Processed skills:', getIconsFromSkills(connection.skills));

    return (
      <View key={connection.firebaseID || connection.id}>
        <CoachCard
          imageUrl={connection.profilePic}
          firstName={connection.firstName}
          lastName={connection.lastName}
          location={connection.location}
          skills={connection.skills ? getIconsFromSkills(connection.skills) : []}
          onPress={() => onConnectionPress(connection)}
        />
      </View>
    );
  };

  // Show loading while user data is being determined
  if (!userData || !userSpecificData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-8 mb-0">
        <HeaderText text={userSpecificData.headerTitle}/>
      </View>
      
      {connections.length > 0 && (
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 mt-0">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder={userSpecificData.searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <Ionicons 
                name="close-circle" 
                size={20} 
                color="#666" 
                onPress={() => setSearchQuery('')}
              />
            )}
          </View>
        </View>
      )}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">
            Loading {userSpecificData.connectionType}...
          </Text>
        </View>
      ) : connections.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView className="flex-1 px-2">
          {filteredConnections.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search-outline" size={60} color="#ccc" />
              <Text className="text-lg text-gray-500 mt-4">
                No {userSpecificData.connectionType} found
              </Text>
              <Text className="text-gray-400 mt-1">Try adjusting your search</Text>
            </View>
          ) : (
            filteredConnections.map((connection) => renderConnectionCard(connection))
          )}
        </ScrollView>
      )}

      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={onExplorePress}
      >
        <Ionicons 
          name="compass"
          size={28} 
          color="white" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MyConnectionsMobileUI;
