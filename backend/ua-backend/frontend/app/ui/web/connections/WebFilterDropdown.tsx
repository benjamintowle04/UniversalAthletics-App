import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterOptions, ActiveFilters } from '../../../types/FilterTypes';
import { Colors } from '../../../themes/colors/Colors';

interface WebFilterDropdownProps {
  isVisible: boolean;
  onClose: () => void;
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
}

const WebFilterDropdown: React.FC<WebFilterDropdownProps> = ({
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
        <TouchableOpacity 
          className="flex-1" 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <View 
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: screenHeight * 0.8 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">Filter by Skills</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Skills Filter */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Select Skills</Text>
              <View className="flex-row flex-wrap gap-2">
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
                <Text className="text-gray-500 italic">No skills available</Text>
              )}
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View className="flex-row p-4 border-t border-gray-200 gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg border border-gray-300 bg-white"
              onPress={handleClearFilters}
            >
              <Text className="text-center font-semibold text-gray-700">Clear All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg"
              style={{ backgroundColor: Colors.uaBlue }}
              onPress={handleApplyFilters}
            >
              <Text className="text-center font-semibold text-white">
                Apply ({localFilters.skills.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WebFilterDropdown;
