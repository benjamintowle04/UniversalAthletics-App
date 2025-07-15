import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';
import { HeaderText } from '../../../components/text/HeaderText';

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

interface MyConnectionsWebUIProps {
  connections: Connection[];
  filteredConnections: Connection[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;
  userSpecificData: {
    headerTitle: string;
    emptyStateTitle: string;
    emptyStateDescription: string;
    exploreButtonText: string;
    exploreNavigation: string;
    searchPlaceholder: string;
    connectionType: string;
  } | null;
  userData: any;
  navigation: any;
  onConnectionPress: (connection: Connection) => void;
  onExplorePress: () => void;
  onMessagePress: (connection: Connection) => void;
}

const MyConnectionsWebUI: React.FC<MyConnectionsWebUIProps> = ({
  connections,
  filteredConnections,
  searchQuery,
  setSearchQuery,
  isLoading,
  userSpecificData,
  userData,
  navigation,
  onConnectionPress,
  onExplorePress, 
  onMessagePress
}) => {
  const isWeb = Platform.OS === 'web';

  const renderEmptyState = () => {
    if (!userSpecificData) return null;

    return (
      <View className="flex-1 items-center justify-center px-8 py-16">
        <View className="bg-white rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mx-auto mb-6">
            <Ionicons name="people-outline" size={40} color="#ccc" />
          </View>
          <Text className="text-2xl font-bold text-gray-700 mb-4">
            {userSpecificData.emptyStateTitle}
          </Text>
          <Text className="text-base text-gray-500 mb-8 leading-6">
            {userSpecificData.emptyStateDescription}
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-full flex-row items-center justify-center transition-colors"
            onPress={onExplorePress}
          >
            <Ionicons 
              name={userData?.userType === 'COACH' ? "settings" : "compass"} 
              size={20} 
              color="white" 
            />
            <Text className="text-white font-semibold ml-2 text-base">
              {userSpecificData.exploreButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderConnectionCard = (connection: Connection) => {
    const skillsToShow = connection.skills?.slice(0, 3) || [];
    
    return (
      <TouchableOpacity
        key={connection.firebaseID || connection.id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 transform hover:-translate-y-1"
        onPress={() => onConnectionPress(connection)}
      >
        {/* Profile Image */}
        <View className="items-center mb-4">
          <View className="relative">
            {connection.profilePic ? (
              isWeb ? (
                <img
                  src={connection.profilePic}
                  alt={`${connection.firstName} ${connection.lastName}`}
                  className="w-20 h-20 rounded-full object-cover border-3"
                  style={{ borderColor: Colors.uaBlue }}
                />
              ) : (
                <Image
                  source={{ uri: connection.profilePic }}
                  className="w-20 h-20 rounded-full border-3"
                  style={{ borderColor: Colors.uaBlue }}
                  resizeMode="cover"
                />
              )
            ) : (
              <View 
                className="w-20 h-20 rounded-full items-center justify-center border-3"
                style={{ 
                  backgroundColor: Colors.grey.light,
                  borderColor: Colors.uaBlue 
                }}
              >
                <Ionicons name="person" size={32} color={Colors.grey.medium} />
              </View>
            )}
            
            {/* User Type Badge */}
            <View 
              className="absolute -bottom-1 -right-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: connection.userType === 'COACH' ? Colors.uaRed : Colors.uaGreen }}
            >
              <Text className="text-white text-xs font-bold">
                {connection.userType === 'COACH' ? 'COACH' : 'MEMBER'}
              </Text>
            </View>
          </View>
        </View>

        {/* Name */}
        <Text className="text-lg font-bold text-gray-900 text-center mb-2">
          {connection.firstName} {connection.lastName}
        </Text>

        {/* Location */}
        <View className="flex-row items-center justify-center mb-4">
          <Ionicons name="location-outline" size={16} color={Colors.grey.medium} />
          <Text className="text-gray-600 ml-1 text-sm text-center" numberOfLines={1}>
            {connection.location}
          </Text>
        </View>

        {/* Skills */}
        {skillsToShow.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 text-center mb-2">
              Skills
            </Text>
            <View className="flex-row flex-wrap justify-center gap-1">
              {skillsToShow.map((skill, index) => (
                <View 
                  key={index}
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: Colors.uaBlue + '20' }}
                >
                  <Text 
                    className="text-xs font-medium capitalize"
                    style={{ color: Colors.uaBlue }}
                  >
                    {skill.title?.replace('_', ' ') || 'Skill'}
                  </Text>
                </View>
              ))}
              {connection.skills && connection.skills.length > 3 && (
                <View 
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: Colors.grey.light }}
                >
                  <Text className="text-xs font-medium text-gray-600">
                    +{connection.skills.length - 3}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity 
            className="flex-1 py-2 px-3 rounded-lg flex-row items-center justify-center"
            style={{ backgroundColor: Colors.uaBlue }}
            onPress={() => onConnectionPress(connection)}
          >
            <Ionicons name="person-outline" size={16} color="white" />
            <Text className="text-white font-medium ml-1 text-sm">View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-2 px-3 rounded-lg flex-row items-center justify-center"
            style={{ backgroundColor: Colors.uaGreen }}
            onPress={() => {
              onMessagePress(connection);
            }}
          >
            <Text className="text-white font-medium ml-1 text-sm">Message</Text>
          </TouchableOpacity>
          
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => {
    if (filteredConnections.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <View className="bg-white rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mx-auto mb-4">
              <Ionicons name="search-outline" size={32} color="#ccc" />
            </View>
            <Text className="text-xl font-semibold text-gray-500 mb-2">
              No {userSpecificData?.connectionType} found
            </Text>
            <Text className="text-gray-400">Try adjusting your search</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {filteredConnections.map((connection) => renderConnectionCard(connection))}
      </View>
    );
  };

  if (!userData || !userSpecificData) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Loading user data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-100">
        <View className="web-container py-6 px-4">
          <View className="items-center justify-between">
            <HeaderText text={userSpecificData.headerTitle} />
            <View className='items-center'> 
              
              {/* Explore Button */}
              <TouchableOpacity 
                className="ml-4 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-full flex-row items-center transition-colors"
                onPress={onExplorePress}
              >
                <Ionicons name="compass" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Explore
                </Text>
              </TouchableOpacity>
              
            </View>
            
            
          </View>
        </View>
      </View>

      {/* Search Bar */}
      {connections.length > 0 && (
        <View className="bg-white border-b border-gray-100">
          <View className="web-container py-4 px-4">
            <View className="max-w-md mx-auto">
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-3 text-base outline-none"
                  placeholder={userSpecificData.searchPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#666"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="web-container min-h-screen">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">
                Loading {userSpecificData.connectionType}...
              </Text>
            </View>
          ) : connections.length === 0 ? (
            renderEmptyState()
          ) : (
            renderSearchResults()
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyConnectionsWebUI;
