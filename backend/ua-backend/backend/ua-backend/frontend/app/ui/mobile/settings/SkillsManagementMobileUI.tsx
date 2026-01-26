import React from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

interface Skill {
  skill_id: number;
  title: string;
}

interface MemberSkill {
  skill_id: number;
  title: string;
  selected: boolean;
}

interface CoachSkill {
  skill_id: number;
  title: string;
  skill_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  selected: boolean;
}

interface SkillsManagementMobileUIProps {
  userData: any;
  allSkills: Skill[];
  userSkills: (MemberSkill | CoachSkill)[];
  isSaving: boolean;
  isWeb: boolean;
  userType: 'MEMBER' | 'COACH';
  handleSkillToggle: (skillId: number) => void;
  handleSkillLevelChange: (skillId: number, level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => void;
  handleSave: () => void;
  navigation: any;
}

const SkillsManagementMobileUI: React.FC<SkillsManagementMobileUIProps> = ({
  userData,
  allSkills,
  userSkills,
  isSaving,
  isWeb,
  userType,
  handleSkillToggle,
  handleSkillLevelChange,
  handleSave,
  navigation
}) => {
  const selectedSkillsCount = userSkills.filter(skill => skill.selected).length;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Skills Management
              </Text>
              <Text className="text-gray-600 text-base">
                {userType === 'COACH' ? 'Manage your coaching skills and expertise levels' : 'Select your athletic interests and skills'}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {selectedSkillsCount} skill{selectedSkillsCount !== 1 ? 's' : ''} selected
              </Text>
            </View>
          </View>
          
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                title="Back"
                onPress={() => navigation.goBack()}
                color="#6B7280"
              />
            </View>
            <View className="flex-1">
              <Button
                title={isSaving ? "Saving..." : "Save Changes"}
                onPress={handleSave}
                disabled={isSaving}
                color="#10B981"
              />
            </View>
          </View>
        </View>

        {/* Skills List */}
        <View>
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Available Skills
          </Text>
          
          <View className="space-y-3">
            {userSkills.map((skill) => (
              <TouchableOpacity
                key={skill.skill_id}
                onPress={() => handleSkillToggle(skill.skill_id)}
                className={`border-2 rounded-lg p-4 ${
                  skill.selected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Skill Header */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className={`font-semibold text-base capitalize ${
                      skill.selected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {skill.title.replace(/_/g, ' ')}
                    </Text>
                  </View>
                  
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    skill.selected
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}>
                    {skill.selected && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                </View>

                {/* Skill Level for Coaches */}
                {userType === 'COACH' && skill.selected && (
                  <View className="mt-3 pt-3 border-t border-gray-200">
                    <Text className="text-sm font-medium text-gray-700 mb-3">
                      Skill Level:
                    </Text>
                    <View className="flex-row justify-between gap-2">
                      {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
                        <TouchableOpacity
                          key={level}
                          onPress={() => handleSkillLevelChange(skill.skill_id, level)}
                          className={`flex-1 py-2 px-3 rounded-lg border ${
                            (skill as CoachSkill).skill_level === level
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <Text className={`text-center text-xs font-medium ${
                            (skill as CoachSkill).skill_level === level
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}>
                            {level.charAt(0) + level.slice(1).toLowerCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Empty State */}
          {userSkills.length === 0 && (
            <View className="text-center py-12">
              <Text className="text-gray-500 text-base">
                No skills available at the moment.
              </Text>
            </View>
          )}
        </View>

        {/* Summary */}
        {selectedSkillsCount > 0 && (
          <View className="mt-6 bg-gray-50 p-4 rounded-lg">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Selected Skills Summary
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {userSkills.filter(skill => skill.selected).map((skill) => (
                <View
                  key={skill.skill_id}
                  className="bg-blue-100 px-3 py-1 rounded-full"
                >
                  <Text className="text-blue-800 text-sm capitalize">
                    {skill.title.replace(/_/g, ' ')}
                    {userType === 'COACH' && (
                      <Text className="text-blue-600 text-xs">
                        {' • ' + (skill as CoachSkill).skill_level.charAt(0) + (skill as CoachSkill).skill_level.slice(1).toLowerCase()}
                      </Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Loading Indicator */}
        {isSaving && (
          <View className="items-center mt-6">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-2">Saving your skills...</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SkillsManagementMobileUI;
