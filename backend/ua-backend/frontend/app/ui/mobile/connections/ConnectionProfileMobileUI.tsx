import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';
import { getIconsFromSkills } from '../../../../utils/IconLibrary';

interface SkillWithLevel {
  skillId: number;
  skillTitle: string;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

interface ConnectionProfileMobileUIProps {
  profileData: any;
  getProfileSpecificData: any;
  skillIcons: any[];
  skillsWithLevels: SkillWithLevel[];
  shouldShowSkillLevels: boolean;
  buttonState: string;
  isProcessingRequest: boolean;
  renderConnectionButton: () => React.ReactNode;
  handleEmailPress: () => void;
  handlePhonePress: () => void;
  handleBookSession: () => void;
  handleMessageProfile: () => void;
  isConnected: boolean;
  navigation: any;
}

// Helper functions for skill levels
const getSkillLevelColor = (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'): string => {
  switch (level) {
    case 'BEGINNER':
      return Colors.uaGreen || '#4CAF50';
    case 'INTERMEDIATE':
      return Colors.uaBlue || '#2196F3';
    case 'ADVANCED':
      return Colors.uaRed || '#F44336';
    default:
      return Colors.grey?.medium || '#757575';
  }
};

const getSkillLevelText = (level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'): string => {
  switch (level) {
    case 'BEGINNER':
      return 'Beginner';
    case 'INTERMEDIATE':
      return 'Intermediate';
    case 'ADVANCED':
      return 'Advanced';
    default:
      return level;
  }
};

const ConnectionProfileMobileUI = ({
  profileData,
  getProfileSpecificData,
  skillIcons,
  skillsWithLevels,
  shouldShowSkillLevels,
  buttonState,
  isProcessingRequest,
  renderConnectionButton,
  handleEmailPress,
  handlePhonePress,
  handleBookSession,
  handleMessageProfile,
  isConnected,
  navigation
}: ConnectionProfileMobileUIProps) => {

  // Render skills with levels component for coaches
  const renderSkillsWithLevels = () => {
    if (!shouldShowSkillLevels) {
      return null;
    }

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Skills & Expertise Levels
        </Text>
        <View className="flex-row flex-wrap">
          {skillsWithLevels.map((skill, index) => {
            const levelColor = getSkillLevelColor(skill.skillLevel);
            
            return (
              <View 
                key={`${skill.skillId}-${index}`}
                className="mr-3 mb-3 p-3 rounded-lg border"
                style={{ 
                  borderColor: levelColor,
                  backgroundColor: `${levelColor}15` // 15% opacity
                }}
              >
                <View className="flex-row items-center mb-1">
                  <Text 
                    className="font-medium capitalize"
                    style={{ color: levelColor }}
                  >
                    {skill.skillTitle.replace(/_/g, ' ')}
                  </Text>
                </View>
                <View 
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: levelColor }}
                >
                  <Text className="text-white text-xs font-medium text-center">
                    {getSkillLevelText(skill.skillLevel)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

// Replace the renderTraditionalSkills function with this:
const renderTraditionalSkills = () => {
  if (shouldShowSkillLevels) {
    return null; // Don't show traditional skills if we have skills with levels
  }

  if (!profileData?.skills || profileData.skills.length === 0) {
    return null;
  }

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Skills
        </Text>
        <View className="flex-row flex-wrap">
          {profileData.skills.map((skill: { title: any; }, index: React.Key | null | undefined) => {
            const skillTitle = typeof skill === 'string' ? skill : skill.title;            
            return (
              <View 
                key={index}
                className="mr-3 mb-3 p-3 rounded-lg flex-row items-center"
                style={{ backgroundColor: Colors.grey?.light || '#f5f5f5' }}
              >
                <Text className="text-gray-800 font-medium capitalize">
                  {skillTitle.replace(/_/g, ' ')}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Profile Header */}
        <View className="items-center py-6">
          {profileData.profilePic && (
            <Image 
              source={{ uri: profileData.profilePic }} 
              className="w-32 h-32 rounded-full mb-4"
            />
          )}
          <Text className="text-2xl font-bold text-gray-900">
            {profileData.firstName} {profileData.lastName}
          </Text>
          <Text className="text-gray-600 mt-1">{profileData.location}</Text>
        </View>

        {/* Connection Button */}
        {renderConnectionButton()}

        {/* Additional action buttons (visible when connected) */}
        {isConnected && (
          <View className="flex-row gap-4 mb-6 w-full">
            <TouchableOpacity
              className="py-3 px-4 rounded-full flex-1 flex-row items-center justify-center mr-2"
              style={{ backgroundColor: Colors.uaRed }}
              onPress={handleBookSession}
            >
              <Ionicons name="calendar" size={18} color="white" />
              <Text className="text-white font-semibold ml-2 text-base">
                {getProfileSpecificData?.bookButtonText || 'Request Session'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 px-4 rounded-full flex-1 flex-row items-center justify-center ml-2"
              style={{ backgroundColor: Colors.uaBlue }}
              onPress={handleMessageProfile}
            >
              <Ionicons name="chatbubble" size={18} color="white" />
              <Text className="text-white font-semibold ml-2 text-base">
                {getProfileSpecificData?.messageButtonText || 'Message'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Skills Section */}
        {renderSkillsWithLevels()}
        {renderTraditionalSkills()}

        {/* Biography Section */}
        {profileData.biography1 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">About</Text>
            <Text className="text-gray-700 leading-6">{profileData.biography1}</Text>
          </View>
        )}

        {/* Add other sections as needed */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectionProfileMobileUI;
