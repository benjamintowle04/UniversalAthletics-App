import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';

interface ConnectionProfileMobileUIProps {
  profileData: any;
  getProfileSpecificData: any;
  skillIcons: any[];
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

const ConnectionProfileMobileUI: React.FC<ConnectionProfileMobileUIProps> = ({
  profileData,
  getProfileSpecificData,
  skillIcons,
  buttonState,
  isProcessingRequest,
  renderConnectionButton,
  handleEmailPress,
  handlePhonePress,
  handleBookSession,
  handleMessageProfile,
  isConnected,
  navigation
}) => {
  const [bioPic1Dimensions, setBioPic1Dimensions] = useState<ImageDimensions | null>(null);
  const [bioPic2Dimensions, setBioPic2Dimensions] = useState<ImageDimensions | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);

  // Function to get image dimensions and determine orientation
  const getImageDimensions = (imageUri: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        imageUri,
        (width, height) => {
          const aspectRatio = width / height;
          let orientation: 'landscape' | 'portrait' | 'square';
          
          if (aspectRatio > 1.2) {
            orientation = 'landscape';
          } else if (aspectRatio < 0.8) {
            orientation = 'portrait';
          } else {
            orientation = 'square';
          }
          
          resolve({ width, height, aspectRatio, orientation });
        },
        (error) => {
          console.error('Error getting image size:', error);
          // Default to landscape if we can't determine
          resolve({ width: 16, height: 9, aspectRatio: 16/9, orientation: 'landscape' });
        }
      );
    });
  };

  // Load image dimensions on component mount
  useEffect(() => {
    const loadImageDimensions = async () => {
      setLoadingImages(true);
      
      try {
        if (getProfileSpecificData?.bioPic1) {
          const pic1Dims = await getImageDimensions(getProfileSpecificData.bioPic1);
          setBioPic1Dimensions(pic1Dims);
        }
        
        if (getProfileSpecificData?.bioPic2) {
          const pic2Dims = await getImageDimensions(getProfileSpecificData.bioPic2);
          setBioPic2Dimensions(pic2Dims);
        }
      } catch (error) {
        console.error('Error loading image dimensions:', error);
      } finally {
        setLoadingImages(false);
      }
    };

    if (getProfileSpecificData) {
      loadImageDimensions();
    }
  }, [getProfileSpecificData]);

  // Render bio section with dynamic layout based on image orientation
  const renderBioSection = (
    title: string,
    biography: string,
    bioPic: string | null,
    imageDimensions: ImageDimensions | null,
    iconName: string,
    iconColor: string
  ) => {
    if (!biography) return null;

    const isPortrait = imageDimensions?.orientation === 'portrait';
    const isLandscape = imageDimensions?.orientation === 'landscape' || imageDimensions?.orientation === 'square';

    return (
      <View className="mx-4 mb-4">
        <View className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {/* Header */}
          <View className="flex-row items-center mb-4">
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: iconColor + '20' }}
            >
              <Ionicons name={iconName as any} size={20} color={iconColor} />
            </View>
            <Text className="text-lg font-semibold text-gray-900 flex-1">
              {title}
            </Text>
          </View>

          {/* Dynamic Layout Based on Image Orientation */}
          {bioPic && imageDimensions ? (
            <>
              {isPortrait ? (
                // Portrait/Vertical Image: Side-by-side layout (like web)
                <View className="flex-row">
                  {/* Text on the left */}
                  <View className="flex-1 pr-4">
                    <ScrollView 
                      style={{ maxHeight: 250 }}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      <Text className="text-gray-700 leading-6 text-base">
                        {biography}
                      </Text>
                    </ScrollView>
                  </View>
                  
                  {/* Portrait image on the right */}
                  <View className="w-32">
                    <View className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: 200 }}>
                      <Image
                        source={{ uri: bioPic }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>
              ) : (
                // Landscape/Square Image: Stacked layout
                <>
                  <Text className="text-gray-700 leading-6 text-base mb-4">
                    {biography}
                  </Text>
                  
                  <View className="w-full bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: 160 }}>
                    <Image
                      source={{ uri: bioPic }}
                      className="w-full"
                      style={{ 
                        minHeight: 160,
                        aspectRatio: imageDimensions.aspectRatio 
                      }}
                      resizeMode="contain"
                    />
                  </View>
                </>
              )}
            </>
          ) : (
            // No image or loading - just show text
            <>
              <Text className="text-gray-700 leading-6 text-base">
                {biography}
              </Text>
              {loadingImages && bioPic && (
                <View className="w-full h-40 bg-gray-100 rounded-lg items-center justify-center mt-4">
                  <ActivityIndicator size="small" color={Colors.grey.medium} />
                  <Text className="text-gray-500 text-sm mt-2">Loading image...</Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Header */}
        <View className="items-center p-6 bg-white shadow-sm">
          <View className="relative mb-4">
            <Image
              source={
                profileData.profilePic 
                  ? { uri: profileData.profilePic }
                  : require('../../../images/logo.png')
              }
              className="w-32 h-32 rounded-full border-4"
              style={{ borderColor: Colors.uaBlue }}
              resizeMode="cover"
            />
            {/* User Type Badge */}
            <View 
              className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full"
              style={{ backgroundColor: profileData.userType === 'COACH' ? Colors.uaRed : Colors.uaGreen }}
            >
              <Text className="text-white text-xs font-bold">
                {profileData.userType === 'COACH' ? 'COACH' : 'MEMBER'}
              </Text>
            </View>
          </View>
          
          <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
            {profileData.firstName} {profileData.lastName}
          </Text>
          
          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={18} color={Colors.uaBlue} />
            <Text className="text-gray-600 ml-2 text-base">{profileData.location}</Text>
          </View>

          {/* Skills Section */}
          {skillIcons.length > 0 && (
            <View className="mb-4 w-full">
              <Text className="text-lg font-semibold text-gray-900 mb-3 text-center">Skills & Interests</Text>
              <View className="flex-row flex-wrap justify-center">
                {skillIcons.map((skill, index) => (
                  <View 
                    key={index} 
                    className="flex-row items-center m-1 px-3 py-2 rounded-full"
                    style={{ backgroundColor: Colors.uaBlue + '20' }}
                  >
                    <Text className="mr-2">{skill.icon}</Text>
                    <Text 
                      className="text-sm font-medium capitalize"
                      style={{ color: Colors.uaBlue }}
                    >
                      {skill.title.replace('_', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="p-6 bg-white">
          {renderConnectionButton()}
          
          {/* Additional action buttons */}
          {isConnected && (
            <View className="flex-row space-x-3 mb-6">
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaRed }}
                onPress={handleBookSession}
              >
                <Ionicons name="calendar" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData?.bookButtonText}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="py-4 px-6 rounded-full flex-1 flex-row items-center justify-center"
                style={{ backgroundColor: Colors.uaBlue }}
                onPress={handleMessageProfile}
              >
                <Ionicons name="chatbubble" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  {getProfileSpecificData?.messageButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Contact Information */}
        {(profileData.email || profileData.phone) && (
          <View className="bg-white mx-4 p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
            <View className="flex-row items-center mb-4">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: Colors.uaBlue + '20' }}
              >
                <Ionicons name="call-outline" size={20} color={Colors.uaBlue} />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Contact Information</Text>
            </View>
            
            {profileData.email && (
              <TouchableOpacity 
                className="flex-row items-center mb-3 p-3 rounded-lg"
                style={{ backgroundColor: Colors.grey.light }}
                onPress={handleEmailPress}
              >
                <Ionicons name="mail-outline" size={20} color={Colors.uaBlue} />
                <Text className="ml-3 text-base" style={{ color: Colors.uaBlue }}>
                  {profileData.email}
                </Text>
              </TouchableOpacity>
            )}
            
            {profileData.phone && isConnected && (
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-lg"
                style={{ backgroundColor: Colors.grey.light }}
                onPress={handlePhonePress}
              >
                <Ionicons name="call-outline" size={20} color={Colors.uaBlue} />
                <Text className="text-gray-700 ml-3 text-base">{profileData.phone}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Primary Bio Section - Dynamic Layout */}
        {getProfileSpecificData && renderBioSection(
          getProfileSpecificData.aboutSectionTitle,
          getProfileSpecificData.biography1,
          getProfileSpecificData.bioPic1,
          bioPic1Dimensions,
          'person-outline',
          Colors.uaGreen
        )}

        {/* Secondary Bio Section - Dynamic Layout (Only for Coaches) */}
        {getProfileSpecificData?.secondaryBioTitle && renderBioSection(
          getProfileSpecificData.secondaryBioTitle,
          getProfileSpecificData.biography2,
          getProfileSpecificData.bioPic2,
          bioPic2Dimensions,
          'heart-outline',
          Colors.uaRed
        )}

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConnectionProfileMobileUI;
