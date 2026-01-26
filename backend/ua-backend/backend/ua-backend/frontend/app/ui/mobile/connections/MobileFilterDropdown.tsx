import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions, ActiveFilters } from '../../../types/FilterTypes';
import { Colors } from '../../../themes/colors/Colors';

interface MobileFilterDropdownProps {
  isVisible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
}

const MobileFilterDropdown: React.FC<MobileFilterDropdownProps> = ({
  isVisible,
  onClose,
  filterOptions,
  activeFilters,
  onFiltersChange,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState<ActiveFilters>(activeFilters);
  const screenHeight = Dimensions.get('window').height;

  const handleSkillToggle = (skillId: number) => {
    const newSkills = localFilters.skills.includes(skillId)
      ? localFilters.skills.filter(id => id !== skillId)
      : [...localFilters.skills, skillId];
    
    setLocalFilters({ skills: newSkills });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: ActiveFilters = {
      skills: []
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        {/* Reduced backdrop area - only takes up 1/3 of screen */}
        <TouchableOpacity 
          className="flex-1" 
          style={{ flex: 0.33 }}
          onPress={onClose}
          activeOpacity={1}
        />
        
        {/* Modal content takes up 2/3 of screen */}
        <View 
          className="bg-white rounded-t-3xl"
          style={{ 
            height: screenHeight * 0.67,
            maxHeight: screenHeight * 0.67
          }}
        >
          {/* Header - Fixed height */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">Filter by Skills</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Scrollable content area - Takes remaining space */}
          <ScrollView 
            className="flex-1 p-4"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Skills Filter */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-4">Select Skills</Text>
              <View className="flex-row flex-wrap gap-3">
                {filterOptions.skills.map((skill) => (
                  <TouchableOpacity
                    key={skill.skill_id}
                    className={`px-4 py-3 rounded-full border ${
                      localFilters.skills.includes(skill.skill_id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-white'
                    }`}
                    onPress={() => handleSkillToggle(skill.skill_id)}
                  >
                    <Text
                      className={`font-medium ${
                        localFilters.skills.includes(skill.skill_id)
                          ? 'text-blue-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {skill.title.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {filterOptions.skills.length === 0 && (
                <Text className="text-gray-500 italic text-center mt-8">No skills available</Text>
              )}
              
              {/* Show selected count */}
              {localFilters.skills.length > 0 && (
                <View className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <Text className="text-blue-700 font-medium text-center">
                    {localFilters.skills.length} skill{localFilters.skills.length !== 1 ? 's' : ''} selected
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons - Fixed at bottom */}
          <View className="flex-row p-4 border-t border-gray-200 gap-3 bg-white">
            <TouchableOpacity
              className="flex-1 py-4 rounded-lg border border-gray-300 bg-white"
              onPress={handleClearFilters}
            >
              <Text className="text-center font-semibold text-gray-700 text-base">Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 py-4 rounded-lg"
              style={{ backgroundColor: Colors.uaBlue }}
              onPress={handleApplyFilters}
            >
              <Text className="text-center font-semibold text-white text-base">
                Apply {localFilters.skills.length > 0 ? `(${localFilters.skills.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MobileFilterDropdown;
