import { View, Text, ActivityIndicator, Platform, Dimensions, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import SkillsManagementWebUI from '../../ui/web/settings/SkillsManagementWebUI';
import SkillsManagementMobileUI from '../../ui/mobile/settings/SkillsManagementMobileUI';
import { ApiRoutes } from '../../../utils/APIRoutes';
import { FIREBASE_AUTH } from '../../../firebase_config';
import { updateMemberSkillsWithFormData, updateCoachSkillsWithFormData} from '../../../controllers/ProfileUpdateController';

import '../../../global.css';

// Types for skills management
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

const SkillsManagement = ({ navigation }: RouterProps) => {    
  const { userData, setUserData, isLoading, userType, isDetectingUserType } = useUser();
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<(MemberSkill | CoachSkill)[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Fetch all available skills
  const fetchAllSkills = useCallback(async () => {
    try {
      setIsLoadingSkills(true);
      const response = await fetch(`${ApiRoutes.GET_SKILLS_ALL}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      
      const skills: Skill[] = await response.json();
      setAllSkills(skills);
      
      // Initialize user skills based on current user data and user type
      if (userData) {
        initializeUserSkills(skills);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      if (isWeb) {
        alert('Failed to load skills. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to load skills. Please try again.');
      }
    } finally {
      setIsLoadingSkills(false);
    }
  }, [userData, isWeb]);

  // Initialize user skills based on current user data
  const initializeUserSkills = (skills: Skill[]) => {
    if (!userData) return;

    if (userData.userType === 'MEMBER') {
      const memberSkills: MemberSkill[] = skills.map(skill => ({
        skill_id: skill.skill_id,
        title: skill.title,
        selected: userData.skills?.some((userSkill: any) => userSkill.skill_id === skill.skill_id) || false
      }));
      setUserSkills(memberSkills);
    } else if (userData.userType === 'COACH') {
      const coachSkills: CoachSkill[] = skills.map(skill => {
        // Only access skillsWithLevels if it exists on userData
        const existingSkill = userData?.skillsWithLevels?.find((userSkill: any) => userSkill.skillId === skill.skill_id);
        const level = (existingSkill?.skillLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') || 'INTERMEDIATE';
        return {
          skill_id: skill.skill_id,
          title: skill.title,
          skill_level: level,
          selected: !!existingSkill
        };
      });
      setUserSkills(coachSkills);
    }
  };

  // Handle skill selection toggle
  const handleSkillToggle = (skillId: number) => {
    setUserSkills(prev => 
      prev.map(skill => 
        skill.skill_id === skillId 
          ? { ...skill, selected: !skill.selected }
          : skill
      )
    );
  };

  // Handle skill level change for coaches
  const handleSkillLevelChange = (skillId: number, level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => {
    if (userData?.userType !== 'COACH') return;
    
    setUserSkills(prev => 
      prev.map(skill => 
        skill.skill_id === skillId 
          ? { ...skill, skill_level: level } as CoachSkill
          : skill
      )
    );
  };

  // Save skills changes using the existing POST endpoints with FormData
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const selectedSkills = userSkills.filter(skill => skill.selected);
      
      if (userData?.userType === 'MEMBER') {
        // For members, use the existing POST endpoint that accepts FormData
        const memberSkillsData = selectedSkills.map(skill => ({
          skill_id: skill.skill_id,
          title: skill.title
        }));
        
        await updateMemberSkillsWithFormData(memberSkillsData, userData);
        
        // Update local user data
        if (setUserData) {
          const updatedUserData = {
            ...userData,
            skills: memberSkillsData
          };
          await setUserData(updatedUserData);
        }
        
      } else if (userData?.userType === 'COACH') {
        // For coaches, use the existing POST endpoint that accepts FormData with skill levels
        const coachSkillsData = selectedSkills.map(skill => ({
          skillId: skill.skill_id,
          skillTitle: skill.title,
          skillLevel: (skill as CoachSkill).skill_level
        }));
        
        await updateCoachSkillsWithFormData(coachSkillsData, userData);
        
        // Update local user data
        if (setUserData) {
          const skillsWithLevels = coachSkillsData.map(skill => ({
            skillId: skill.skillId,
            title: skill.skillTitle,
            skillLevel: skill.skillLevel
          }));
          const updatedUserData = {
            ...userData,
            skillsWithLevels: skillsWithLevels
          };
          await setUserData(updatedUserData);
        }
      }
      
      if (isWeb) {
        alert('Skills updated successfully!');
      } else {
        Alert.alert('Success', 'Skills updated successfully!');
      }
      
    } catch (error) {
      console.error('Error saving skills:', error);
      if (isWeb) {
        alert('Failed to update skills. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to update skills. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };


  // Fetch skills on component mount
  useEffect(() => {
    if (userData) {
      fetchAllSkills();
    }
  }, [userData, fetchAllSkills]);

  // Show loading state while user data is being fetched or user type is being detected
  if (isLoading || isDetectingUserType || !userData || isLoadingSkills) {
    return (
      <View className={`flex-1 justify-center items-center ${isWeb ? 'min-h-screen bg-gray-100' : ''}`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">
          {isDetectingUserType ? 'Detecting user type...' : 
           isLoadingSkills ? 'Loading skills...' : 'Loading user data...'}
        </Text>
        {userType && (
          <Text className="mt-1 text-gray-500 text-sm">
            User type: {userType}
          </Text>
        )}
      </View>
    );
  }

  // Prepare props for UI components
  const uiProps = {
    userData,
    allSkills,
    userSkills,
    isSaving,
    isWeb,
    userType: userData.userType,
    handleSkillToggle,
    handleSkillLevelChange,
    handleSave,
    navigation
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <SkillsManagementWebUI {...uiProps} />;
  }

  // Mobile/Tablet Layout
  return <SkillsManagementMobileUI {...uiProps} />;
}

export default SkillsManagement;
