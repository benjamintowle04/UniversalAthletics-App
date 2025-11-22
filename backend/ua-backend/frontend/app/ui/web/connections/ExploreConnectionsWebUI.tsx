import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';
import { HeaderText } from '../../../components/text/HeaderText';
import WebFilterDropdown from './WebFilterDropdown';
import { FilterOptions, ActiveFilters } from '../../../types/FilterTypes';

interface Connection {
  firebaseID: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  profilePic?: string;
  skills: Array<{skill_id: number, title: string, icon: React.ReactNode}>;
  userType: 'COACH' | 'MEMBER';
}

interface UserSpecificData {
  headerTitle: string;
  searchPlaceholder: string;
  connectionType: 'members' | 'coaches';
  targetUserType: 'COACH' | 'MEMBER';
}

interface UserData {
  userType: 'COACH' | 'MEMBER';
  location?: string;
  skills?: any[];
}

interface ExploreConnectionsWebUIProps {
  connections: Connection[];
  filteredConnections: Connection[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userSpecificData: UserSpecificData | null;
  userData: UserData | null;
  onConnectionPress: (connection: Connection) => void;
}

const ExploreConnectionsWebUI: React.FC<ExploreConnectionsWebUIProps> = ({
  connections,
  filteredConnections: initialFilteredConnections,
  searchQuery,
  setSearchQuery,
  userSpecificData,
  userData,
  onConnectionPress
}) => {
  const isWeb = Platform.OS === 'web';
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    skills: []
  });
  const filterButtonRef = useRef(null);

  // Generate filter options from connections
  const filterOptions: FilterOptions = useMemo(() => {
    const uniqueSkills = new Map();
    const uniqueLocations = new Set<string>();

    connections.forEach(connection => {
      connection.skills?.forEach(skill => {
        uniqueSkills.set(skill.skill_id, { skill_id: skill.skill_id, title: skill.title });
      });
      if (connection.location) {
        uniqueLocations.add(connection.location);
      }
    });

    return {
      skills: Array.from(uniqueSkills.values()),
      locations: Array.from(uniqueLocations),
      userTypes: ['COACH', 'MEMBER']
    };
  }, [connections]);

  // Apply filters to connections
  const filteredConnections = useMemo(() => {
    let filtered = initialFilteredConnections;

  

    // Apply skills filter
    if (activeFilters.skills.length > 0) {
      filtered = filtered.filter(connection => 
        connection.skills?.some(skill => activeFilters.skills.includes(skill.skill_id))
      );
    }

    

    return filtered;
  }, [initialFilteredConnections, activeFilters]);

  const handleFiltersChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      skills: []
    });
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

        {/* Action Button */}
        <TouchableOpacity 
          className="py-2 px-4 rounded-lg flex-row items-center justify-center"
          style={{ backgroundColor: Colors.uaBlue }}
          onPress={() => onConnectionPress(connection)}
        >
          <Ionicons name="person-outline" size={16} color="white" />
          <Text className="text-white font-medium ml-1 text-sm">View Profile</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => {
    if (filteredConnections.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <View className="bg-white rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mx-auto mb-4">
              <Ionicons name="people-outline" size={32} color="#ccc" />
            </View>
            <Text className="text-xl font-semibold text-gray-500 mb-2">
              No {userSpecificData?.connectionType} found
            </Text>
            <Text className="text-gray-400">
              {searchQuery ? 'Try adjusting your search' : `No ${userSpecificData?.connectionType} available in your area`}
            </Text>
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
          <View className="items-center justify-center">
            <HeaderText text={userSpecificData.headerTitle} />
          </View>
        </View>
      </View>

      {/* Search Bar + Filter*/}
      <View className="bg-white border-b border-gray-100">
        <View className="web-container py-4 px-4">
          <View className="flex-row items-center max-w-md mx-auto">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3 flex-1">
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

            <View className="relative ml-3">
              <TouchableOpacity
                ref={filterButtonRef}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                onPress={() => setIsFilterVisible(!isFilterVisible)}
              >
                <Ionicons name="funnel-outline" size={20} color="white" />
                {(activeFilters.skills.length > 0) && (
                  <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </TouchableOpacity>

              {/* Filter Dropdown */}
              <WebFilterDropdown
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        <View className="web-container min-h-screen">
          {renderSearchResults()}
        </View>
      </ScrollView>
    </View>
  );
};

export default ExploreConnectionsWebUI;

