import { View, Text, TextInput, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useMemo } from 'react'
import { CoachCard } from '../../../components/card_view/CoachCard'
import { getIconsFromSkills } from '../../../../utils/IconLibrary'
import { Ionicons } from '@expo/vector-icons'
import { HeaderText } from '../../../components/text/HeaderText'
import MobileFilterDropdown from './MobileFilterDropdown'
import { FilterOptions, ActiveFilters } from '../../../types/FilterTypes'
import "../../../../global.css"

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

interface ExploreConnectionsMobileUIProps {
  connections: Connection[];
  filteredConnections: Connection[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userSpecificData: UserSpecificData | null;
  userData: UserData | null;
  onConnectionPress: (connection: Connection) => void;
  onFilterPress?: () => void;
}

const ExploreConnectionsMobileUI = ({
  connections,
  filteredConnections: initialFilteredConnections,
  searchQuery,
  setSearchQuery,
  userSpecificData,
  userData,
  onConnectionPress,
  onFilterPress
}: ExploreConnectionsMobileUIProps) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    skills: [],
  });

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
      <View className="mt-4">
        <HeaderText text={userSpecificData.headerTitle}/>
      </View>
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-gray-100 rounded-md px-4 py-2 flex-1">
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
        
        {/* Filter Button */}
        <TouchableOpacity 
          className="ml-3 bg-blue-500 p-3 rounded-md flex-row items-center justify-center"
          onPress={() => setIsFilterVisible(true)}
        >
          <Ionicons name="filter" size={20} color="white" />
          {(activeFilters.skills.length > 0) && (
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </TouchableOpacity>
      </View>     
      <ScrollView className="flex-1 px-2">
        {filteredConnections.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text className="text-lg text-gray-500 mt-4">
              No {userSpecificData.connectionType} found
            </Text>
            <Text className="text-gray-400 mt-1">
              {searchQuery ? 'Try adjusting your search' : `No ${userSpecificData.connectionType} available in your area`}
            </Text>
          </View>
        ) : (
          filteredConnections.map((connection) => (
            <View key={connection.firebaseID || connection.id}>
              <CoachCard
                imageUrl={connection.profilePic}
                firstName={connection.firstName || ""}
                lastName={connection.lastName || ""}
                location={connection.location || ""}
                skills={connection.skills ? getIconsFromSkills(connection.skills) : []}
                onPress={() => onConnectionPress(connection)}              
              />
            </View> 
          ))
        )}
      </ScrollView>

      {/* Filter Dropdown */}
      <MobileFilterDropdown
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />
    </SafeAreaView>
  );
};

export default ExploreConnectionsMobileUI;
