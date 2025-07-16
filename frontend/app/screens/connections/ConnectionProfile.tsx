import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert, ActivityIndicator, Platform, Dimensions } from 'react-native'
import React, { useMemo } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { getIconsFromSkills } from '../../../utils/IconLibrary'
import { Colors } from '../../themes/colors/Colors'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"
import { RouteProp } from '@react-navigation/native';
import ConnectionProfileWebUI from '../../ui/web/connections/ConnectionProfileWebUI'
import ConnectionProfileMobileUI from '../../ui/mobile/connections/ConnectionProfileMobileUI'
import { useProfileData } from '../../hooks/connections/useProfileData'
import { useConnection } from '../../hooks/connections/useConnection'

// Make route params optional to handle undefined cases
type ConnectionProfileRouteProp = RouteProp<{ 
  params?: { 
    profileId?: string; 
    profileType?: 'COACH' | 'MEMBER';
    profileFirebaseId?: string;
    // Legacy support for existing navigation calls
    coachId?: string;
    memberId?: string;
  } 
}, 'params'>;

interface ConnectionProfileProps extends RouterProps {
  route: ConnectionProfileRouteProp;
}

// Define skill level type and helper functions
type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

interface SkillWithLevel {
  skillId: number;
  skillTitle: string;
  skillLevel: SkillLevel;
}

const getSkillLevelColor = (level: SkillLevel): string => {
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

const getSkillLevelText = (level: SkillLevel): string => {
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

const ConnectionProfile = ({ route, navigation }: ConnectionProfileProps) => {
  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Extract and validate route parameters with fallbacks
  const { profileId, profileType, profileFirebaseId } = useMemo(() => {
    const params = route.params || {};
    
    // Handle legacy navigation calls
    let id: string | undefined;
    let type: 'COACH' | 'MEMBER' | undefined;
    let firebaseId: string | undefined;
    
    if (params.profileId && params.profileType) {
      id = params.profileId;
      type = params.profileType;
      firebaseId = params.profileFirebaseId;
    } else if (params.coachId) {
      id = params.coachId;
      type = 'COACH';
    } else if (params.memberId) {
      id = params.memberId;
      type = 'MEMBER';
    }
    
    return {
      profileId: id,
      profileType: type,
      profileFirebaseId: firebaseId
    };
  }, [route.params]);

  // Use custom hooks
  const { profileData, error, isLoading } = useProfileData({
    profileId,
    profileType,
    profileFirebaseId
  });

  const {
    isProcessingRequest,
    isConnected,
    buttonState,
    getProfileSpecificData,
    handleEmailPress,
    handlePhonePress,
    handleMessageProfile,
    handleConnectWithProfile,
    handleAcceptRequest,
    handleDeclineRequest,
    handleBookSession
  } = useConnection({
    profileData,
    profileId,
    profileType,
    profileFirebaseId,
    navigation
  });

  // Process skills with levels for coaches
  const skillsWithLevels = useMemo(() => {
    if (profileType === 'COACH' && profileData?.skillsWithLevels) {
      console.log("Processing skills with levels:", profileData.skillsWithLevels);
      return profileData.skillsWithLevels as SkillWithLevel[];
    }
    return [];
  }, [profileData?.skillsWithLevels, profileType]);

  // Determine if we should show skills with levels or traditional skills
  const shouldShowSkillLevels = profileType === 'COACH' && skillsWithLevels.length > 0;

  // Get skill icons
  const skillIcons = useMemo(() => {
    if (profileData?.skills) {
      // Extract skill titles regardless of format
      const skillTitles = profileData.skills.map(skill => 
        typeof skill === 'string' ? { skill_id: 0, title: skill } : { skill_id: skill.skill_id || 0, title: skill.title }
      );
      return getIconsFromSkills(skillTitles);
    }
    return [];
  }, [profileData?.skills]);


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
            const skillIcon = getIconsFromSkills([{ skill_id: skill.skillId, title: skill.skillTitle }])[0];
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
                  {skillIcon && (
                    <Ionicons 
                      name={skillIcon as any} 
                      size={20} 
                      color={levelColor}
                      style={{ marginRight: 6 }}
                    />
                  )}
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

  // Render traditional skills component (for members or coaches without skill levels)
  const renderTraditionalSkills = () => {
    if (shouldShowSkillLevels) {
      return null; // Don't show traditional skills if we have skills with levels
    }

    if (skillIcons.length === 0) {
      return null;
    }

    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          Skills
        </Text>
        <View className="flex-row flex-wrap">
          {skillIcons.map((icon, index) => (
            <View 
              key={index}
              className="mr-3 mb-3 p-3 rounded-lg"
              style={{ backgroundColor: Colors.grey?.light || '#f5f5f5' }}
            >
              <Ionicons 
                name={icon as any} 
                size={24} 
                color={Colors.uaBlue || '#2196F3'} 
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ... rest of your existing renderConnectionButton function stays the same ...
  const renderConnectionButton = () => {
    if (!getProfileSpecificData) return null;

    switch (buttonState) {
      case 'loading':
        return (
          <TouchableOpacity 
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.grey.medium }}
            disabled={true}
          >
            <ActivityIndicator size="small" color="white" />
            <Text className="text-white font-semibold ml-2">Loading...</Text>
          </TouchableOpacity>
        );

      case 'connected':
        return (
          <TouchableOpacity 
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.uaGreen }}
            disabled={true}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {getProfileSpecificData.connectedText}
            </Text>
          </TouchableOpacity>
        );

      case 'accept_decline':
        return (
          <View className="mb-4">
            <Text className="text-center text-gray-600 mb-3 text-base">
              {getProfileSpecificData.participantLabel} wants to connect with you
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaGreen }}
                onPress={handleAcceptRequest}
                disabled={isProcessingRequest}
              >
                {isProcessingRequest ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Accept</Text>
                  </>
                )}
              </TouchableOpacity>
              
              // In your ConnectionProfileWebUI component, replace the existing skills section with:

              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaRed }}
                onPress={handleDeclineRequest}
                disabled={isProcessingRequest}
              >
                {isProcessingRequest ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="close" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2">Decline</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'request_sent':
        return (
          <TouchableOpacity 
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.grey.dark }}
            disabled={true}
          >
            <Ionicons name="time" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              {getProfileSpecificData.requestSentText}
            </Text>
          </TouchableOpacity>
        );

      case 'connect':
      default:
        return (
          <TouchableOpacity 
            className="py-4 px-6 rounded-full flex-row items-center justify-center mb-4"
            style={{ backgroundColor: Colors.uaBlue }}
            onPress={handleConnectWithProfile}
            disabled={isProcessingRequest}
          >
            {isProcessingRequest ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="person-add" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData.connectButtonText}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
    }
  };

  // Show error state if parameters are missing or invalid
  if (error || !profileId || !profileType) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color={Colors.uaRed} />
          <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
            Profile Not Found
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            {error || 'The profile you are looking for could not be loaded.'}
          </Text>
          <TouchableOpacity 
            className="py-3 px-6 rounded-full mt-6"
            style={{ backgroundColor: Colors.uaBlue }}
            onPress={() => navigation.goBack()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading state
  if (isLoading || !profileData || !getProfileSpecificData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.uaBlue} />
          <Text className="mt-2 text-gray-600">
            Loading {profileType.toLowerCase()} profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Prepare props for UI components
  const uiProps = {
    profileData,
    getProfileSpecificData,
    skillIcons,
    skillsWithLevels, 
    shouldShowSkillLevels, 
    buttonState,
    isProcessingRequest,
    renderConnectionButton,
    renderSkillsWithLevels, 
    renderTraditionalSkills, 
    handleEmailPress,
    handlePhonePress,
    handleBookSession,
    handleMessageProfile,
    isConnected,
    navigation
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <ConnectionProfileWebUI {...uiProps} />;
  }

  return <ConnectionProfileMobileUI {...uiProps} />;
};

export default ConnectionProfile;

