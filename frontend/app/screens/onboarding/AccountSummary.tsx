import React, { useState, useContext } from "react";
import { View, Alert, ScrollView, Text, Dimensions, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProfilePictureContainer } from "../../components/image_holders/ProfilePictureContainerEdit";
import { HeaderText } from "../../components/text/HeaderText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { LogoImageContainer } from "../../components/image_holders/LogoImageContainer";
import { UserContext } from "../../contexts/UserContext";
import { SubHeaderText1 } from "../../components/text/SubHeaderText1";
import { EditTextField } from "../../components/text/input/EditTextField";
import { EditEmailField } from "../../components/text/input/EditEmailField";
import { EditPhoneField } from "../../components/text/input/EditPhoneField";
import { SmallText } from "../../components/text/SmallText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RouterProps } from "../../types/RouterProps";
import { EditBioField } from "../../components/text/input/EditBioField";
import { postUserOnboarding } from "../../../controllers/OnboardingController";

interface AccountSummaryProps extends RouterProps {
      combinedUserData?: {
        firstName: string;
        lastName: string;
        phone: string;
        biography: string;
        location: string | null;
        skills: { skill_id: number, title: string }[];
      }
}

const AccountSummary = ({ navigation, route }: AccountSummaryProps) => {
  const { width, height } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Get the combined data from previous screens
  const combinedUserData = route?.params?.combinedUserData;

  const userContext = useContext(UserContext);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }

  const { userData, setUserData } = userContext;

  // Initialize state with combined data from previous screens or existing userData
  const [firstName, setFirstName] = useState<string>(
    combinedUserData?.firstName || userData?.firstName || ''
  );
  const [lastName, setLastName] = useState<string>(
    combinedUserData?.lastName || userData?.lastName || ''
  );
  const [email, setEmail] = useState<string>(
    userData?.email || ''
  );
  const [phone, setPhone] = useState<string>(
    combinedUserData?.phone || userData?.phone || ''
  );
  const [biography, setBiography] = useState<string>(
    combinedUserData?.biography || userData?.biography || ''
  );
  const [imageUri, setImageUri] = useState<string | null>(
    userData?.profilePic || null
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleButtonPress = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
      return;
    }
  
    try {
      // Prepare the complete user data for the backend
      const completeUserData = {
        firstName,
        lastName,
        email,
        phone,
        biography,
        location: combinedUserData?.location || userData?.location,
        skills: combinedUserData?.skills || [],
        profilePic: imageUri,
        firebaseId: userData?.firebaseId || '' // Make sure we have the Firebase ID
      };

      console.log("Complete User Data for onboarding:", completeUserData);

      // Call the backend API first to get the complete user data with ID
      const response = await postUserOnboarding(completeUserData, imageUri);
      console.log("User Data response from backend:", response);
      
      // Now set the complete user data in context (response should include the ID)
      if (response && response.id) {
        setUserData(response);
      }
      
      navigation.navigate("Home");
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert("Error", "Failed to complete onboarding. Please try again.");
    }
  };

  if (isWeb && isLargeScreen) {
    // Web Desktop Layout
    return (
      <View 
        className="flex-1 bg-gradient-to-br from-ua-red to-red-600"
        style={{ minHeight: height }}
      >
        <KeyboardAwareScrollView 
          enableOnAndroid={true} 
          extraScrollHeight={80} 
          extraHeight={120}
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: 32 
          }}
        >
          <View className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg">
            {/* Header Section */}
            <View className="items-center mb-8">
              <LogoImageContainer />
              <HeaderText text="Thank you for Joining UA!" />
              <View className="w-16 h-1 bg-ua-red rounded-full mt-4"></View>
            </View>

            {/* Main Content Grid */}
            <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column - Profile Picture */}
              <View className="flex items-center justify-start">
                <View className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
                    Profile Picture
                  </Text>
                  <View className="items-center">
                    <ProfilePictureContainer 
                      imageUri={imageUri} 
                      onPickImage={pickImage} 
                    />
                  </View>
                  <Text className="text-sm text-gray-500 text-center mt-2">
                    Click to upload a photo
                  </Text>
                </View>
              </View>

              {/* Right Column - Form Fields */}
              <View className="space-y-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-4">
                    Account Summary
                  </Text>
                </View>

                {/* Name Fields */}
                <View className="grid grid-cols-2 gap-4">
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">First Name *</Text>
                    <View className="w-full">
                      <EditTextField 
                        value={firstName} 
                        onChange={setFirstName}
                        placeholder="First Name"
                      />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">Last Name *</Text>
                    <View className="w-full">
                      <EditTextField 
                        value={lastName} 
                        onChange={setLastName}
                        placeholder="Last Name"
                      />
                    </View>
                  </View>
                </View>

                {/* Email Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Email *</Text>
                  <View className="w-full">
                    <EditEmailField 
                      value={email} 
                      onChange={setEmail}
                      placeholder="your.email@example.com"
                    />
                  </View>
                </View>

                {/* Phone Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Phone *</Text>
                  <View className="w-full">
                    <EditPhoneField 
                      value={phone} 
                      onChange={setPhone}
                      placeholder="(555) 123-4567"
                    />
                  </View>
                </View>

                {/* Bio Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
                  <View className="w-full">
                    <EditBioField 
                      value={biography} 
                      onChange={setBiography}
                      placeholder="Tell us about yourself..."
                    />
                  </View>
                </View>

                {/* Skills Summary */}
                {combinedUserData?.skills && combinedUserData.skills.length > 0 && (
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">Selected Skills</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {combinedUserData.skills.map((skill: { skill_id: React.Key | null | undefined; title: string; }) => (
                        <View 
                          key={skill.skill_id}
                          className="bg-ua-blue px-3 py-1 rounded-full"
                        >
                          <Text className="text-white text-sm font-medium">
                            {skill.title.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Action Button */}
            <View className="flex items-center mb-6">
              <View className="w-full max-w-sm">
                <PrimaryButton title="Get Started" onPress={handleButtonPress} />
              </View>
            </View>

            {/* Progress Indicator */}
            <View className="flex-row justify-center items-center space-x-2">
              <View className="w-3 h-3 bg-ua-green rounded-full"></View>
              <View className="w-3 h-3 bg-ua-blue rounded-full"></View>
              <View className="w-3 h-3 bg-ua-red rounded-full"></View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  // Mobile Layout (Original)
  return (
    <View className="flex-1 items-center bg-white p-4">
      <LogoImageContainer />
      <HeaderText text="Thank you for Joining UA!" />
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={80} extraHeight={120}>
        <View className="flex-row items-center justify-between w-full">
          <ProfilePictureContainer imageUri={imageUri} onPickImage={pickImage} />
          <View className="mt-8 px-6">
            <SubHeaderText1 text="Account Summary" />
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="First" />
              </View>
              <EditTextField value={firstName} onChange={setFirstName} />
            </View>
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="Last" />
              </View>
              <EditTextField value={lastName} onChange={setLastName} />
            </View>
          </View>
        </View>

        <View className="flex-2 justify-start">
          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Email" />
            </View>
            <EditEmailField value={email} onChange={setEmail} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Phone" />
            </View>
            <EditPhoneField value={phone} onChange={setPhone} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Bio" />
            </View>
            <EditBioField value={biography} onChange={setBiography} />
          </View>

          {/* Skills Summary for Mobile */}
          {combinedUserData?.skills && combinedUserData.skills.length > 0 && (
            <View className="mt-4">
              <SmallText text="Skills" />
              <View className="flex-row flex-wrap mt-2">
                {combinedUserData.skills.map((skill: { skill_id: React.Key | null | undefined; title: string; }) => (
                  <View 
                    key={skill.skill_id}
                    className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-blue-800 text-xs">
                      {skill.title.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <View>
          <PrimaryButton title="Get Started" onPress={handleButtonPress} />
      </View>
    </View>
  );
};

export default AccountSummary;
