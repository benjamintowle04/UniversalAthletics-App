import React from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';

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

interface SkillsManagementWebUIProps {
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

const SkillsManagementWebUI: React.FC<SkillsManagementWebUIProps> = ({
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
    <ScrollView className="flex-1 bg-gray-100">
      <View className="web-container py-8 px-4">
        <View className="web-card bg-white p-8 max-w-4xl mx-auto">
          {/* Header */}
          <View className="mb-8 flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Skills Management
              </Text>
              <Text className="text-gray-600 text-lg">
                {userType === 'COACH' ? 'Manage your coaching skills and expertise levels' : 'Select your athletic interests and skills'}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {selectedSkillsCount} skill{selectedSkillsCount !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <View className="ml-4 flex-row gap-2">
              {isWeb ? (
                <>
                  <button
                    onClick={() => navigation.goBack()}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Button
                    title="Back"
                    onPress={() => navigation.goBack()}
                    color="#6B7280"
                  />
                  <Button
                    title={isSaving ? "Saving..." : "Save"}
                    onPress={handleSave}
                    disabled={isSaving}
                    color="#10B981"
                  />
                </>
              )}
            </View>
          </View>

          {/* Skills Grid */}
          <View>
            <Text className="text-xl font-semibold text-gray-900 mb-6">
              Available Skills
            </Text>
            
            <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSkills.map((skill) => (
                <View
                  key={skill.skill_id}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${
                    skill.selected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Skill Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className={`font-semibold text-lg capitalize ${
                        skill.selected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {skill.title.replace(/_/g, ' ')}
                      </Text>
                    </View>
                    
                    {isWeb ? (
                      <input
                        type="checkbox"
                        checked={skill.selected}
                        onChange={() => handleSkillToggle(skill.skill_id)}
                        className="ml-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    ) : (
                      <Button
                        title={skill.selected ? "✓" : "+"}
                        onPress={() => handleSkillToggle(skill.skill_id)}
                        color={skill.selected ? "#10B981" : "#6B7280"}
                      />
                    )}
                  </View>

                  {/* Skill Level for Coaches */}
                  {userType === 'COACH' && skill.selected && (
                    <View className="mt-3 pt-3 border-t border-gray-200">
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Skill Level:
                      </Text>
                      <View className="flex-row gap-2">
                        {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => handleSkillLevelChange(skill.skill_id, level)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              (skill as CoachSkill).skill_level === level
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {level.charAt(0) + level.slice(1).toLowerCase()}
                          </button>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Empty State */}
            {userSkills.length === 0 && (
              <View className="text-center py-12">
                <Text className="text-gray-500 text-lg">
                  No skills available at the moment.
                </Text>
              </View>
            )}
          </View>

          {/* Summary */}
          {selectedSkillsCount > 0 && (
            <View className="mt-8 bg-gray-50 p-6 rounded-lg">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Selected Skills Summary
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {userSkills.filter(skill => skill.selected).map((skill) => (
                  <View
                    key={skill.skill_id}
                    className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center gap-2"
                  >
                    <Text className="text-blue-800 text-sm capitalize">
                      {skill.title.replace(/_/g, ' ')}
                    </Text>
                    {userType === 'COACH' && (
                      <Text className="text-blue-600 text-xs font-medium">
                        {(skill as CoachSkill).skill_level.charAt(0) + (skill as CoachSkill).skill_level.slice(1).toLowerCase()}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SkillsManagementWebUI;
