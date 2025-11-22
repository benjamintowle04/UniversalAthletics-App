import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';
import { getIconsFromSkills } from '../../../../utils/IconLibrary';

interface SkillWithLevel {
  skillId: number;
  skillTitle: string;
  skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

interface ConnectionProfileWebUIProps {
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

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait' | 'square';
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

const ConnectionProfileWebUI: React.FC<ConnectionProfileWebUIProps> = ({
  profileData,
  getProfileSpecificData,
  skillIcons,
  skillsWithLevels,
  shouldShowSkillLevels,
  renderConnectionButton,
  handleEmailPress,
  handlePhonePress,
  handleBookSession,
  handleMessageProfile,
  isConnected,
  navigation
}) => {
  const isWeb = Platform.OS === 'web';
  const [bioPic1Dimensions, setBioPic1Dimensions] = useState<ImageDimensions | null>(null);
  const [bioPic2Dimensions, setBioPic2Dimensions] = useState<ImageDimensions | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);

  // Function to get image dimensions and determine orientation (for web)
  const getImageDimensions = (imageUri: string): Promise<ImageDimensions> => {
    return new Promise((resolve) => {
        // For web, create an HTML image element to get dimensions
        const img = new window.Image();
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let orientation: 'landscape' | 'portrait' | 'square';
            
            if (aspectRatio > 1) {
            orientation = 'landscape';
            } else if (aspectRatio < 1) {
            orientation = 'portrait';
            } else {
            orientation = 'square';
            }

            console.log("Image Orientation:", orientation, "Aspect Ratio:", aspectRatio);
            
            resolve({ 
                width: img.width, 
                height: img.height, 
                aspectRatio, 
                orientation 
            });
        };
        img.onerror = () => {
            console.error("Error loading image:", imageUri);
            // Default to landscape if we can't determine
            resolve({ width: 16, height: 9, aspectRatio: 16/9, orientation: 'landscape' });
        };
        img.src = imageUri;
      
    });
  };

  // Load image dimensions on component mount
  useEffect(() => {
    const loadImageDimensions = async () => {
      if (!getProfileSpecificData) return;
      
      setLoadingImages(true);
      
      try {
        if (getProfileSpecificData.bioPic1) {
          const pic1Dims = await getImageDimensions(getProfileSpecificData.bioPic1);
          setBioPic1Dimensions(pic1Dims);
        }
        
        if (getProfileSpecificData.bioPic2) {
          const pic2Dims = await getImageDimensions(getProfileSpecificData.bioPic2);
          setBioPic2Dimensions(pic2Dims);
        }
      } catch (error) {
        console.error('Error loading image dimensions:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImageDimensions();
  }, [getProfileSpecificData]);

  // Render skills with levels component for coaches
  const renderSkillsWithLevels = () => {
    if (!shouldShowSkillLevels) {
      return null;
    }

    return (
      <View className="mb-6">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Skills & Expertise Levels
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {skillsWithLevels.map((skill, index) => {
            const levelColor = getSkillLevelColor(skill.skillLevel);
            
            return (
              <View 
                key={`${skill.skillId}-${index}`}
                className="p-4 rounded-xl border shadow-sm bg-white hover:shadow-md transition-shadow"
                style={{ 
                  borderColor: levelColor,
                  minWidth: 180
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Text 
                    className="font-semibold capitalize flex-1"
                    style={{ color: levelColor }}
                  >
                    {skill.skillTitle.replace(/_/g, ' ')}
                  </Text>
                </View>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: levelColor }}
                >
                  <Text className="text-white text-sm font-medium text-center">
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
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          Skills
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {profileData.skills.map((skill: { title: any; }, index: React.Key | null | undefined) => {
            const skillTitle = typeof skill === 'string' ? skill : skill.title;
            const skillIcon = getIconsFromSkills([skillTitle])[0];
            
            return (
              <View 
                key={index}
                className="p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow flex-row items-center"
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


  // Render bio section with dynamic layout based on image orientation
  const renderBioSection = (
    title: string,
    biography: string,
    bioPic: string | null,
    imageDimensions: ImageDimensions | null,
    iconName: string,
    iconColor: string,
    isSecondary: boolean = false
  ) => {
    if (!biography) return null;

    const isPortrait = imageDimensions?.orientation === 'portrait';
    const isLandscape = imageDimensions?.orientation === 'landscape' || imageDimensions?.orientation === 'square';

    return (
      <View className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
        {bioPic && imageDimensions ? (
          <>
            {isPortrait ? (
              // Portrait Image: Side-by-side layout (text left, image right)
              <View className={`flex-col lg:flex-row gap-6 ${isSecondary ? 'lg:flex-row-reverse' : ''}`}>
                {/* Bio Text */}
                <View className="flex-1">
                  <View className="flex-row items-center mb-6">
                    <View 
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: iconColor + '20' }}
                    >
                      <Ionicons name={iconName as any} size={24} color={iconColor} />
                    </View>
                    <Text className="text-xl font-semibold text-gray-900">
                      {title}
                    </Text>
                  </View>
                  <ScrollView 
                    style={{ maxHeight: 400 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    <Text className="text-gray-700 leading-7 text-base lg:text-lg">
                      {biography}
                    </Text>
                  </ScrollView>
                </View>
                
                {/* Portrait Bio Picture */}
                <View className="w-full lg:w-64 flex items-center">
                  <View 
                    className="bg-gray-100 rounded-xl overflow-hidden shadow-sm"
                    style={{ 
                      width: '100%',
                      maxWidth: 256,
                      height: Math.min(400, 256 / imageDimensions.aspectRatio)
                    }}
                  >
                    {isWeb ? (
                      <img
                        src={bioPic}
                        alt="Bio"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        source={{ uri: bioPic }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>
              </View>
            ) : (
              // Landscape/Square Image: Stacked layout (text above, image below)
              <View>
                <View className="flex-row items-center mb-6">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: iconColor + '20' }}
                  >
                    <Ionicons name={iconName as any} size={24} color={iconColor} />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900">
                    {title}
                  </Text>
                </View>
                
                <Text className="text-gray-700 leading-7 text-base lg:text-lg mb-6">
                  {biography}
                </Text>
                
                {/* Landscape Bio Picture */}
                <View className="w-full flex items-center">
                  <View 
                    className="bg-gray-100 rounded-xl overflow-hidden shadow-sm"
                    style={{ 
                      width: '100%',
                      maxWidth: 600,
                      height: Math.min(400, 600 / imageDimensions.aspectRatio)
                    }}
                  >
                    {isWeb ? (
                      <img
                        src={bioPic}
                        alt="Bio"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        source={{ uri: bioPic }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </View>
              </View>
            )}
          </>
        ) : (
          // No image or loading - just show text
          <View>
            <View className="flex-row items-center mb-6">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: iconColor + '20' }}
              >
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </View>
              <Text className="text-xl font-semibold text-gray-900">
                {title}
              </Text>
            </View>
            
            <Text className="text-gray-700 leading-7 text-base lg:text-lg">
              {biography}
            </Text>
            
            {loadingImages && bioPic && (
              <View className="w-full h-64 bg-gray-100 rounded-xl items-center justify-center mt-6">
                <ActivityIndicator size="large" color={Colors.grey.medium} />
                <Text className="text-gray-500 mt-2">Loading image...</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="web-container py-8 px-4">
          <View className="web-card bg-white p-8 max-w-4xl mx-auto rounded-xl shadow-lg">
            
            {/* Back Button */}
            <TouchableOpacity 
              className="flex-row items-center mb-6 p-2 rounded-lg hover:bg-gray-100"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.uaBlue} />
              <Text className="ml-2 text-lg font-medium" style={{ color: Colors.uaBlue }}>
                Back
              </Text>
            </TouchableOpacity>

            {/* Enhanced Profile Header */}
            <View className="items-center p-6 lg:p-8 bg-white shadow-sm rounded-xl mb-6">
              <View className="relative mb-6">
                <Image
                  source={
                    profileData.profilePic 
                      ? { uri: profileData.profilePic }
                      : require('../../../images/logo.png')
                  }
                  className="w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4"
                  style={{ borderColor: Colors.uaBlue }}
                  resizeMode="cover"
                />
                {/* User Type Badge */}
                <View 
                  className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: profileData.userType === 'COACH' ? Colors.uaRed : Colors.uaGreen }}
                >
                  <Text className="text-white text-sm font-bold">
                    {profileData.userType === 'COACH' ? 'COACH' : 'MEMBER'}
                  </Text>
                </View>
              </View>
              
              <Text className="text-4xl font-bold text-gray-900 mb-3">
                {profileData.firstName} {profileData.lastName}
              </Text>
              
              <View className="flex-row items-center mb-6">
                <Ionicons name="location-outline" size={20} color={Colors.uaBlue} />
                <Text className="text-gray-600 ml-2 text-lg">{profileData.location}</Text>
              </View>

              {/* Skills Section */}
              {renderSkillsWithLevels()}
              {renderTraditionalSkills()}
            </View>

            {/* Action Buttons */}
            <View className="p-6 lg:p-8 bg-white rounded-xl shadow-sm mb-6">
              {renderConnectionButton()}
              
              {/* Additional action buttons */}
              {isConnected && (
                <View className="flex-row gap-4 mb-6">
                  <TouchableOpacity 
                    className="py-4 px-8 rounded-full flex-1 flex-row items-center justify-center hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: Colors.uaRed }}
                    onPress={handleBookSession}
                  >
                    <Ionicons name="calendar" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      {getProfileSpecificData?.bookButtonText}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="py-4 px-8 rounded-full flex-1 flex-row items-center justify-center hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: Colors.uaBlue }}
                    onPress={handleMessageProfile}
                  >
                    <Ionicons name="chatbubble" size={20} color="white" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      {getProfileSpecificData?.messageButtonText}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Contact Information */}
            {(profileData.email || profileData.phone) && (
              <View className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 mb-6">
                <View className="flex-row items-center mb-6">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: Colors.uaBlue + '20' }}
                  >
                    <Ionicons name="call-outline" size={24} color={Colors.uaBlue} />
                  </View>
                  <Text className="text-xl font-semibold text-gray-900">Contact Information</Text>
                </View>
                
                <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.email && (
                    <TouchableOpacity 
                      className="flex-row items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: Colors.grey.light }}
                      onPress={handleEmailPress}
                    >
                      <Ionicons name="mail-outline" size={24} color={Colors.uaBlue} />
                      <Text className="ml-3 text-base font-medium" style={{ color: Colors.uaBlue }}>
                        {profileData.email}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {profileData.phone && isConnected && (
                    <TouchableOpacity 
                      className="flex-row items-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      style={{ backgroundColor: Colors.grey.light }}
                      onPress={handlePhonePress}
                    >
                      <Ionicons name="call-outline" size={24} color={Colors.uaBlue} />
                      <Text className="text-gray-700 ml-3 text-base font-medium">{profileData.phone}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Biography Sections with Dynamic Layout */}
            <View className="space-y-6">
              {/* Primary Bio Section - Dynamic Layout */}
              {getProfileSpecificData && renderBioSection(
                getProfileSpecificData.aboutSectionTitle,
                getProfileSpecificData.biography1,
                getProfileSpecificData.bioPic1,
                bioPic1Dimensions,
                'person-outline',
                Colors.uaGreen,
                false
              )}

              {/* Secondary Bio Section - Dynamic Layout (Only for Coaches) */}
              {getProfileSpecificData?.secondaryBioTitle && renderBioSection(
                getProfileSpecificData.secondaryBioTitle,
                getProfileSpecificData.biography2,
                getProfileSpecificData.bioPic2,
                bioPic2Dimensions,
                'heart-outline',
                Colors.uaRed,
                true
              )}
            </View>

            {/* Bottom spacing */}
            <View className="h-8" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectionProfileWebUI;

